import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
    try {
        // 1. Create Business
        const business = await prisma.business.create({
            data: {
                name: "GetRwanda Wellness Group",
                taxId: "CORP-RW-2026-001",
                headquarters: "Kigali Heights, 5th Floor",
            },
        });

        // 2. Create Branches
        const branch1 = await prisma.branch.create({
            data: {
                name: "Kigali Oasis Spa",
                address: "KG 9 Ave, Nyarutarama, Kigali",
                phone: "+250788123456",
                email: "hello@kigalioasis.rw",
                businessId: business.id,
            },
        });

        const branch2 = await prisma.branch.create({
            data: {
                name: "Rubavu Lakeside Spa",
                address: "Lake Kivu Waterfront, Rubavu",
                phone: "+250788765432",
                email: "rubavu@kigalioasis.rw",
                businessId: business.id,
            },
        });

        // 2. Create Admin and Manager users
        const adminPassword = await bcrypt.hash("admin123", 10);
        const managerPassword = await bcrypt.hash("manager123", 10);
        const staffPassword = await bcrypt.hash("staff123", 10);

        await prisma.user.create({
            data: {
                username: "admin",
                email: "admin@saunaengine.rw",
                passwordHash: adminPassword,
                fullName: "System Administrator",
                role: "ADMIN",
            },
        });

        await prisma.user.create({
            data: {
                username: "ceo",
                email: "exec@getrwanda.rw",
                passwordHash: managerPassword,
                fullName: "Kagame Paul (Group CEO)",
                role: "OWNER",
                usr_businessId: business.id,
            },
        });

        await prisma.user.create({
            data: {
                username: "mugisha",
                email: "mugisha@kigalioasis.rw",
                passwordHash: managerPassword,
                fullName: "Mugisha Jean",
                role: "MANAGER",
                usr_branchId: branch1.id,
            },
        });

        await prisma.user.create({
            data: {
                username: "uwase",
                email: "uwase@kigalioasis.rw",
                passwordHash: staffPassword,
                fullName: "Uwase Aline",
                role: "EMPLOYEE",
                usr_branchId: branch1.id,
            },
        });

        // 4. Create Services for both
        const branches = [branch1, branch2];
        for (const b of branches) {
            await prisma.service.createMany({
                data: [
                    {
                        name: "Sauna + Steam (Walk-in)",
                        category: "Sauna & Steam",
                        price: 15000,
                        duration: 120,
                        branchId: b.id,
                    },
                    {
                        name: "Deep Tissue Massage",
                        category: "Massage",
                        price: 35000,
                        duration: 60,
                        branchId: b.id,
                    },
                ],
            });
        }

        // 5. Create Employee Categories & Employees
        for (const b of branches) {
            const therapistCat = await prisma.employeeCategory.create({
                data: {
                    name: "Massage Therapist",
                    branchId: b.id,
                },
            });

            await prisma.employee.createMany({
                data: [
                    {
                        fullName: b.name === branch1.name ? "Kamanzi Eric" : "Nshuti David",
                        phone: b.name === branch1.name ? "+250789000111" : "+250789000333",
                        categoryId: therapistCat.id,
                        branchId: b.id,
                    },
                ],
            });
        }

        return NextResponse.json({ message: "Database seeded successfully!" });
    } catch (error) {
        console.error("Seeding error:", error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}
