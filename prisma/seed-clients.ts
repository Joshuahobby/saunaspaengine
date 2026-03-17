import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const branch = await prisma.branch.findFirst();
    if (!branch) {
        console.error("No branch found. Run the main seed first.");
        process.exit(1);
    }

    console.log("Seeding demo clients for:", branch.name);

    const clients = [
        { fullName: "Uwimana Eric", phone: "+250788100001", clientType: "MEMBER" as const },
        { fullName: "Mukamana Grace", phone: "+250788100002", clientType: "MEMBER" as const },
        { fullName: "Habimana Patrick", phone: "+250788100003", clientType: "WALK_IN" as const },
        { fullName: "Ingabire Chantal", phone: "+250788100004", clientType: "MEMBER" as const },
        { fullName: "Nshimiyimana Jean", phone: "+250788100005", clientType: "WALK_IN" as const },
        { fullName: "Uwera Diane", phone: "+250788100006", clientType: "MEMBER" as const },
        { fullName: "Mugabo David", phone: "+250788100007", clientType: "WALK_IN" as const },
        { fullName: "Mukamusoni Alice", phone: "+250788100008", clientType: "MEMBER" as const },
    ];

    for (const client of clients) {
        await prisma.client.upsert({
            where: { id: `demo-${client.phone}` },
            update: {},
            create: {
                ...client,
                branchId: branch.id,
            },
        });
    }

    console.log(`✅ Seeded ${clients.length} demo clients`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
