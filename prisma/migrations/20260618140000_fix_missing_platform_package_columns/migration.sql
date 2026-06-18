-- Migration 20260616163000_sync_schema_drift was marked as applied but the
-- ALTER TABLE statements for platform_packages were never executed.
-- These three columns are present in the Prisma schema but missing from the DB.

ALTER TABLE "platform_packages" ADD COLUMN IF NOT EXISTS "employeeLimit" INTEGER NOT NULL DEFAULT 1;
ALTER TABLE "platform_packages" ADD COLUMN IF NOT EXISTS "serviceLimit" INTEGER NOT NULL DEFAULT 5;
ALTER TABLE "platform_packages" ADD COLUMN IF NOT EXISTS "checkInLimit" INTEGER NOT NULL DEFAULT 100;
