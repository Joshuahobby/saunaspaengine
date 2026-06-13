import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

function validatePasswordServer(password: string): string | null {
    if (password.length < 8) return "Password must be at least 8 characters long.";
    if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter.";
    if (!/[a-z]/.test(password)) return "Password must contain at least one lowercase letter.";
    if (!/[0-9]/.test(password)) return "Password must contain at least one number.";
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) return "Password must contain at least one special character.";
    return null;
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const session = await auth();

    // 1. Authenticate Request
    if (!session?.user || session.user.id !== id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { currentPassword, newPassword } = body;

        if (!currentPassword || !newPassword) {
            return NextResponse.json({ error: "Current and new passwords are required" }, { status: 400 });
        }

        // 2. Fetch User and verify existing password
        const user = await prisma.user.findUnique({
            where: { id }
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const isPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);
        if (!isPasswordValid) {
            return NextResponse.json({ error: "Incorrect current password" }, { status: 400 });
        }

        // 3. Verify new password strength server-side
        const pwError = validatePasswordServer(newPassword);
        if (pwError) {
            return NextResponse.json({ error: pwError }, { status: 400 });
        }

        // 4. Hash and Update
        const newPasswordHash = await bcrypt.hash(newPassword, 12);

        await prisma.user.update({
            where: { id },
            data: { passwordHash: newPasswordHash }
        });

        return NextResponse.json({ success: true, message: "Password updated successfully" });
    } catch (error) {
        console.error("Password update error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
