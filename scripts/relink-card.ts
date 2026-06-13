import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
dotenv.config({ override: true });

const prisma = new PrismaClient();

async function main() {
    const cardId = process.argv[2];

    if (!cardId) {
        console.error("Please provide the raw QR text (e.g. spa-client:cmntzrrkz0006l104kddsyr84)");
        process.exit(1);
    }

    // Extract the CUID from the string
    const clientId = cardId.replace('spa-client:', '').trim();

    // 1. Get the current active business and branch (since the old one was deleted, we use the new seeded one)
    const currentBusiness = await prisma.business.findFirst();
    const currentBranch = await prisma.branch.findFirst({ where: { businessId: currentBusiness?.id } });

    if (!currentBusiness || !currentBranch) {
        console.error("No active business found in the database. Please run seed first or create one via the UI.");
        process.exit(1);
    }

    // 2. Check if the user already exists (maybe we already recreated it?)
    const existing = await prisma.client.findUnique({ where: { id: clientId } });
    if (existing) {
        console.log(`Client ${clientId} already exists! Their name is ${existing.fullName}`);
        process.exit(0);
    }

    // 3. Create the client with the precise ID from the printed card
    const newClient = await prisma.client.create({
        data: {
            id: clientId, // Hardcoding the ID from the physical card!
            branchId: currentBranch.id,
            
            // Placeholder info — you can edit their name from the dashboard later
            fullName: "Restored Card Member",
            phone: "+25000000000",
            qrCode: cardId
        }
    });

    console.log(`\n✅ SUCCESS: Linked card ${clientId} to the current Database!`);
    console.log(`You can now scan this card in the app, and you can edit their name in the Clients dashboard.`);
}

main()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
