import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import RolesClientPage from "./client-page";

export default async function RolesPage() {
    const session = await auth();
    if (!session?.user) redirect("/login");
    
    // Only Owners and Admins can manage roles
    const isExecutive = session.user.role === 'OWNER' || session.user.role === 'ADMIN';
    if (!isExecutive) redirect("/employees");

    // Fetch existing categories with employee count
    const categories = await prisma.employeeCategory.findMany({
        orderBy: { name: "asc" },
        include: {
            _count: { select: { employees: true } }
        }
    });

    return (
        <RolesClientPage initialCategories={categories} />
    );
}
