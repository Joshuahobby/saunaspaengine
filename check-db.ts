import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
    console.log("Businesses:");
    const businesses = await prisma.business.findMany({ select: { id: true, name: true } });
    console.log(businesses);

    console.log("\nUsers:");
    const users = await prisma.user.findMany({ 
        select: { id: true, email: true, usr_businessId: true },
        where: { email: { in: ['owner1@saunaspa.com', 'admin@saunaspa.com', 'ceo@saunaspa.com', 'sarah@saunaspa.com'] } }
    });
    console.log(users);
}

main().catch(console.error).finally(() => prisma.$disconnect());
