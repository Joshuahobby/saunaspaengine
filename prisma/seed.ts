import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    console.log("Seeding database with Rwandan demo data...");

    // 1. Create Business
    const business = await prisma.business.create({
        data: {
            name: "Kigali Oasis Spa",
            address: "KG 9 Ave, Nyarutarama, Kigali",
            phone: "+250788123456",
            email: "hello@kigalioasis.rw",
        },
    });
    console.log("✅ Created business:", business.name);

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
            businessId: business.id,
        },
    });

    await prisma.user.create({
        data: {
            username: "mugisha",
            email: "mugisha@kigalioasis.rw",
            passwordHash: ownerPassword,
            fullName: "Mugisha Jean",
            role: "OWNER",
            businessId: business.id,
        },
    });

    await prisma.user.create({
        data: {
            username: "uwase",
            email: "uwase@kigalioasis.rw",
            passwordHash: staffPassword,
            fullName: "Uwase Aline",
            role: "EMPLOYEE",
            businessId: business.id,
        },
    });
    console.log("✅ Created users: admin (admin123), mugisha (owner123), uwase (staff123)");

    // 3. Create Services
    await prisma.service.createMany({
        data: [
            {
                name: "Sauna + Steam (Walk-in)",
                category: "Sauna & Steam",
                price: 15000,
                duration: 120,
                businessId: business.id,
            },
            {
                name: "Deep Tissue Massage",
                category: "Massage",
                price: 35000,
                duration: 60,
                businessId: business.id,
            },
            {
                name: "Swedish Massage",
                category: "Massage",
                price: 30000,
                duration: 60,
                businessId: business.id,
            },
            {
                name: "VIP Package (Sauna + Massage)",
                category: "Packages",
                price: 45000,
                duration: 180,
                businessId: business.id,
            },
        ],
    });
    console.log("✅ Created services with RWF pricing");

    // 4. Create Employee Categories & Employees
    const therapistCat = await prisma.employeeCategory.create({
        data: {
            name: "Massage Therapist",
            businessId: business.id,
        },
    });

    await prisma.employee.createMany({
        data: [
            {
                fullName: "Kamanzi Eric",
                phone: "+250789000111",
                categoryId: therapistCat.id,
                businessId: business.id,
            },
            {
                fullName: "Mutoni Sarah",
                phone: "+250789000222",
                categoryId: therapistCat.id,
                businessId: business.id,
            },
        ],
    });
    console.log("✅ Created staff members");

    console.log("🎉 Seeding completed successfully!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
