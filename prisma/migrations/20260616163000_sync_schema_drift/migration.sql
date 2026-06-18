-- Sync schema drift: lockers table, added columns, indexes, foreign keys
-- These changes were applied via `prisma db push` but never captured as a migration.

-- CreateTable
CREATE TABLE "lockers" (
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

-- AlterTable: add columns to businesses
ALTER TABLE "businesses" ADD COLUMN "monthlyCheckInCount" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "businesses" ADD COLUMN "checkInCounterResetAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable: add column to corporates
ALTER TABLE "corporates" ADD COLUMN "trialEndsAt" TIMESTAMP(3);

-- AlterTable: add columns to platform_packages
ALTER TABLE "platform_packages" ADD COLUMN "employeeLimit" INTEGER NOT NULL DEFAULT 1;
ALTER TABLE "platform_packages" ADD COLUMN "serviceLimit" INTEGER NOT NULL DEFAULT 5;
ALTER TABLE "platform_packages" ADD COLUMN "checkInLimit" INTEGER NOT NULL DEFAULT 100;
ALTER TABLE "platform_packages" ALTER COLUMN "branchLimit" SET DEFAULT 1;

-- AlterTable: add columns to service_records
ALTER TABLE "service_records" ADD COLUMN "pawapayDepositId" TEXT;
ALTER TABLE "service_records" ADD COLUMN "paymentStatus" TEXT DEFAULT 'PENDING';
ALTER TABLE "service_records" ADD COLUMN "lockerNumber" TEXT;
ALTER TABLE "service_records" DROP COLUMN IF EXISTS "boxNumber";

-- CreateIndex
CREATE INDEX "service_records_businessId_status_idx" ON "service_records"("businessId", "status");
CREATE INDEX "service_records_businessId_status_completedAt_idx" ON "service_records"("businessId", "status", "completedAt");
CREATE INDEX "service_records_clientId_businessId_idx" ON "service_records"("clientId", "businessId");
CREATE INDEX "service_records_employeeId_idx" ON "service_records"("employeeId");
CREATE UNIQUE INDEX "service_records_pawapayDepositId_key" ON "service_records"("pawapayDepositId");

-- CreateIndex for lockers
CREATE INDEX "lockers_branchId_isActive_idx" ON "lockers"("branchId", "isActive");
CREATE UNIQUE INDEX "lockers_branchId_lockerNumber_key" ON "lockers"("branchId", "lockerNumber");

-- CreateIndex for clients
CREATE INDEX "clients_phone_idx" ON "clients"("phone");
CREATE INDEX "clients_businessId_status_idx" ON "clients"("businessId", "status");

-- CreateIndex for commission_logs
CREATE INDEX "commission_logs_employeeId_status_idx" ON "commission_logs"("employeeId", "status");

-- CreateIndex for audit_logs
CREATE INDEX "audit_logs_businessId_createdAt_idx" ON "audit_logs"("businessId", "createdAt");

-- AddForeignKey for lockers
ALTER TABLE "lockers" ADD CONSTRAINT "lockers_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "businesses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey for commission_logs payout
ALTER TABLE "commission_logs" ADD CONSTRAINT "commission_logs_payoutId_fkey" FOREIGN KEY ("payoutId") REFERENCES "employee_payouts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey for audit_logs
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "businesses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
