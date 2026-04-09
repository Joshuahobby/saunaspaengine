import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { Pool } from "@neondatabase/serverless";

// Robust Singleton pattern for Prisma in Next.js/Turbopack as per @prisma/client best practices
const prismaClientSingleton = () => {
    const connectionString = process.env.DATABASE_URL || "";
    
    if (!connectionString) {
        return new PrismaClient();
    }

    try {
        const pool = new Pool({ connectionString });
        const adapter = new PrismaNeon(pool);
        return new PrismaClient({ adapter });
    } catch (error) {
        console.error("[PRISMA-ADAPTER-ERROR]", error);
        return new PrismaClient();
    }
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

export const prisma = globalThis.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") {
    globalThis.prisma = prisma;
}
