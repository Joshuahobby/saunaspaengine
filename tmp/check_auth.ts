import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    const email = "admin@saunaengine.rw";
    const password = "admin123";

    const user = await prisma.user.findFirst({
        where: { email }
    });

    if (!user) {
        console.log("User not found");
        return;
    }

    console.log("User found:", user.email);
    console.log("Hash in DB:", user.passwordHash);

    const isValid = await bcrypt.compare(password, user.passwordHash);
    console.log("Is password valid?", isValid);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
