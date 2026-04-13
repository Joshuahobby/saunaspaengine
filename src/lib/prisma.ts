import { PrismaClient } from "@prisma/client";
import { neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import ws from 'ws';

/**
 * PRISMA SINGLETON CONFIGURATION
 * 
 * Stability Strategy:
 * - Development: Uses the NATIVE Prisma engine (TCP) for maximum stability on local machines.
 * - Production: Uses the NEON Serverless Adapter for optimized performance in edge environments.
 */

const prismaClientSingleton = () => {
  const isDev = process.env.NODE_ENV === "development";
  const databaseUrl = process.env.DATABASE_URL?.trim();

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not defined in your environment.");
  }

  // 1. Local/Dev Mode: Native TCP Engine
  if (isDev) {
    console.log("[PRISMA] Initializing Native Engine (Local Mode)");
    return new PrismaClient({
      datasources: {
        db: {
          url: databaseUrl,
        },
      },
      log: ["error", "warn"],
    });
  }

  // 2. Production/Edge Mode: Neon Serverless Adapter
  console.log("[PRISMA] Initializing Neon Adapter (Production Mode)");
  
  if (typeof window === 'undefined') {
    neonConfig.webSocketConstructor = ws;
  }

  const adapter = new PrismaNeon({ connectionString: databaseUrl });

  return new PrismaClient({
    adapter,
    log: ["error"],
  });
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
