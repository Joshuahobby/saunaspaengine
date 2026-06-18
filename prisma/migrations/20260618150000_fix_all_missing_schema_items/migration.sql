-- Migration 20260616163000_sync_schema_drift was marked applied but its
-- ALTER TABLE / CREATE TABLE statements were never executed for several tables.
-- Only the CREATE INDEX statements from that migration took effect.
-- This migration applies all the missing schema changes using IF NOT EXISTS guards.

-- === 1. Create lockers table (completely missing) ===
CREATE TABLE IF NOT EXISTS "lockers" (
    "id" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "lockerNumber" TEXT NOT NULL,
    "type" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "lockers_pkey" PRIMARY KEY ("id")
);

-- === 2. Add missing columns to Branch table (businesses) ===
ALTER TABLE "businesses" ADD COLUMN IF NOT EXISTS "monthlyCheckInCount" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "businesses" ADD COLUMN IF NOT EXISTS "checkInCounterResetAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- === 3. Add missing column to Business table (corporates) ===
ALTER TABLE "corporates" ADD COLUMN IF NOT EXISTS "trialEndsAt" TIMESTAMP(3);

-- === 4. Add missing columns to ServiceRecord table (service_records) ===
ALTER TABLE "service_records" ADD COLUMN IF NOT EXISTS "pawapayDepositId" TEXT;
ALTER TABLE "service_records" ADD COLUMN IF NOT EXISTS "paymentStatus" TEXT DEFAULT 'PENDING';
ALTER TABLE "service_records" ADD COLUMN IF NOT EXISTS "lockerNumber" TEXT;
ALTER TABLE "service_records" DROP COLUMN IF EXISTS "boxNumber";

-- === 5. Create missing unique constraint / indexes for lockers ===
CREATE UNIQUE INDEX IF NOT EXISTS "lockers_branchId_lockerNumber_key" ON "lockers"("branchId", "lockerNumber");
CREATE INDEX IF NOT EXISTS "lockers_branchId_isActive_idx" ON "lockers"("branchId", "isActive");

-- === 6. Add missing foreign keys (DO blocks for IF NOT EXISTS) ===
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'lockers_branchId_fkey') THEN
    ALTER TABLE "lockers" ADD CONSTRAINT "lockers_branchId_fkey"
      FOREIGN KEY ("branchId") REFERENCES "businesses"("id")
      ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'commission_logs_payoutId_fkey') THEN
    ALTER TABLE "commission_logs" ADD CONSTRAINT "commission_logs_payoutId_fkey"
      FOREIGN KEY ("payoutId") REFERENCES "employee_payouts"("id")
      ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'audit_logs_businessId_fkey') THEN
    ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_businessId_fkey"
      FOREIGN KEY ("businessId") REFERENCES "businesses"("id")
      ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END;
$$;
