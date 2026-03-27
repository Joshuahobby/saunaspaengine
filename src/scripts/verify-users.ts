import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("Checking users...");
    const users = await prisma.user.findMany({
        take: 20,
        select: {
            id: true,
            email: true,
            role: true,
            usr_branchId: true,
            usr_businessId: true,
            status: true
        }
    });
    console.table(users);
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
