import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const getPrisma = () => {
  const connectionString = process.env.DATABASE_URL || "";

  if (!connectionString) {
    return new PrismaClient();
  }

  try {
    // PrismaNeon v7+ accepts { connectionString } directly — no Pool or ws needed.
    // It handles WebSocket connections internally over port 443.
    const adapter = new PrismaNeon({ connectionString });
    return new PrismaClient({ adapter });
  } catch {
    return new PrismaClient();
  }
};

type PrismaClientType = ReturnType<typeof getPrisma>;

const globalForPrisma = globalThis as unknown as {
  prisma_neon: PrismaClientType | undefined;
};

export const prisma = globalForPrisma.prisma_neon ?? getPrisma();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma_neon = prisma;
