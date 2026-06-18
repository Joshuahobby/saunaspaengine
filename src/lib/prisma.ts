import { PrismaClient } from "@prisma/client";

/**
 * PRISMA SINGLETON CONFIGURATION
 *
 * Uses the NATIVE Prisma engine (TCP) in all environments.
 * The Neon adapter has array/json column parsing bugs on Vercel serverless,
 * so we use the native engine which handles all PostgreSQL types correctly.
 */

const prismaClientSingleton = () => {
  if (typeof window !== "undefined") {
    return {} as unknown as PrismaClient;
  }

  const isDev = process.env.NODE_ENV === "development";

  if (!process.env.DATABASE_URL && isDev) {
    try {
      const dotenv = require("dotenv");
      dotenv.config();
      console.log("[PRISMA] Environment fallback triggered: .env loaded manually.");
    } catch (e) {
    }
  }

  const databaseUrl = process.env.DATABASE_URL?.trim();

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not defined in your environment. Please check your .env file.");
  }

  return new PrismaClient({
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
    log: isDev ? ["error", "warn"] : ["error"],
  });
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
