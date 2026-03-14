import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    console.log("Adding a simplified test user...");

    // Find the business first
    const business = await prisma.business.findFirst();
    if (!business) {
        console.error("No business found. Please run regular seed first.");
        return;
    }

    const passwordHash = await bcrypt.hash("password123", 10);

    const user = await prisma.user.upsert({
        where: { email: "test@test.com" },
        update: {
            passwordHash: passwordHash,
            status: "ACTIVE"
        },
        create: {
            username: "testuser",
            email: "test@test.com",
            passwordHash: passwordHash,
            fullName: "Test User",
            role: "ADMIN",
            businessId: business.id,
            status: "ACTIVE"
        }
    });

    console.log("✅ Test user ready: test@test.com / password123");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
