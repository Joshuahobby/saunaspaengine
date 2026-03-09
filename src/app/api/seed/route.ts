import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
    try {
        // 1. Create Corporate
        const corporate = await prisma.corporate.create({
            data: {
                name: "GetRwanda Wellness Group",
                taxId: "CORP-RW-2026-001",
                headquarters: "Kigali Heights, 5th Floor",
            },
        });

        // 2. Create Businesses
        const business1 = await prisma.business.create({
            data: {
                name: "Kigali Oasis Spa",
                address: "KG 9 Ave, Nyarutarama, Kigali",
                phone: "+250788123456",
                email: "hello@kigalioasis.rw",
                corporateId: corporate.id,
            },
        });

        const business2 = await prisma.business.create({
            data: {
                name: "Rubavu Lakeside Spa",
                address: "Lake Kivu Waterfront, Rubavu",
                phone: "+250788765432",
                email: "rubavu@kigalioasis.rw",
                corporateId: corporate.id,
            },
        });

        // 2. Create Admin and Owner users
        const adminPassword = await bcrypt.hash("admin123", 10);
        const ownerPassword = await bcrypt.hash("owner123", 10);
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
                passwordHash: ownerPassword,
                fullName: "Kagame Paul (Group CEO)",
                role: "CORPORATE",
                corporateId: corporate.id,
            },
        });

        await prisma.user.create({
            data: {
                username: "mugisha",
                email: "mugisha@kigalioasis.rw",
                passwordHash: ownerPassword,
                fullName: "Mugisha Jean",
                role: "OWNER",
                businessId: business1.id,
            },
        });

        await prisma.user.create({
            data: {
                username: "uwase",
                email: "uwase@kigalioasis.rw",
                passwordHash: staffPassword,
                fullName: "Uwase Aline",
                role: "EMPLOYEE",
                businessId: business1.id,
            },
        });

        // 4. Create Services for both
        const businesses = [business1, business2];
        for (const b of businesses) {
            await prisma.service.createMany({
                data: [
                    {
                        name: "Sauna + Steam (Walk-in)",
                        category: "Sauna & Steam",
                        price: 15000,
                        duration: 120,
                        businessId: b.id,
                    },
                    {
                        name: "Deep Tissue Massage",
                        category: "Massage",
                        price: 35000,
                        duration: 60,
                        businessId: b.id,
                    },
                ],
            });
        }

        // 5. Create Employee Categories & Employees
        for (const b of businesses) {
            const therapistCat = await prisma.employeeCategory.create({
                data: {
                    name: "Massage Therapist",
                    businessId: b.id,
                },
            });

            await prisma.employee.createMany({
                data: [
                    {
                        fullName: b.name === business1.name ? "Kamanzi Eric" : "Nshuti David",
                        phone: b.name === business1.name ? "+250789000111" : "+250789000333",
                        categoryId: therapistCat.id,
                        businessId: b.id,
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
