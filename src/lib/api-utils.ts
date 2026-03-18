import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

type Role = "ADMIN" | "OWNER" | "MANAGER" | "RECEPTIONIST" | "EMPLOYEE";

/**
 * Authenticates the current request and optionally enforces role-based access.
 * Returns { session, user, error } — if error is present, return it immediately.
 */
export async function apiAuth(allowedRoles?: Role[]) {
    const session = await auth();

    if (!session?.user) {
        return {
            session: null,
            user: null,
            error: NextResponse.json(
                { error: "Authentication required" },
                { status: 401 }
            ),
        };
    }

    if (allowedRoles && !allowedRoles.includes(session.user.role as Role)) {
        return {
            session,
            user: session.user,
            error: NextResponse.json(
                { error: "Insufficient permissions" },
                { status: 403 }
            ),
        };
    }

    return { session, user: session.user, error: null };
}

/**
 * Validates that required fields exist and are non-empty strings in the request body.
 * Returns { data, error } — if error is present, return it immediately.
 */
export function validateFields<T extends Record<string, unknown>>(
    body: T,
    requiredFields: (keyof T)[]
): { valid: true; error: null } | { valid: false; error: NextResponse } {
    const missing = requiredFields.filter(
        (field) => body[field] === undefined || body[field] === null || body[field] === ""
    );

    if (missing.length > 0) {
        return {
            valid: false,
            error: NextResponse.json(
                {
                    error: "Missing required fields",
                    details: missing.map((f) => `'${String(f)}' is required`),
                },
                { status: 400 }
            ),
        };
    }

    return { valid: true, error: null };
}

/**
 * Wraps an API handler with consistent error handling.
 * Catches any unhandled errors and returns a 500 with a safe message.
 */
export function apiHandler(
    handler: () => Promise<NextResponse>
): Promise<NextResponse> {
    return handler().catch((error: unknown) => {
        console.error("API Error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    });
}
