import { PrismaClient } from "@prisma/client";

// Robust Singleton pattern for Prisma in Next.js
const prismaClientSingleton = () => {
    const connectionString = process.env.DATABASE_URL || "";
    
    if (!connectionString) {
        throw new Error("DATABASE_URL is missing. Please check your Next.js env variables.");
    }

    // Initialize native PrismaClient (uses Rust query engine with direct TCP pooling, bypassing buggy WS Serverless adapters)
    return new PrismaClient({
        datasourceUrl: connectionString
    });
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

export const prisma = globalThis.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") {
    globalThis.prisma = prisma;
}
