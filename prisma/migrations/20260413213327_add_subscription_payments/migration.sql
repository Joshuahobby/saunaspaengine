-- CreateTable
CREATE TABLE "subscription_payments" (
    "id" TEXT NOT NULL,
    "depositId" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'RWF',
    "phone" TEXT NOT NULL,
    "correspondent" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "failureReason" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscription_payments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "subscription_payments_depositId_key" ON "subscription_payments"("depositId");

-- CreateIndex
CREATE INDEX "subscription_payments_businessId_idx" ON "subscription_payments"("businessId");

-- CreateIndex
CREATE INDEX "subscription_payments_status_idx" ON "subscription_payments"("status");

-- AddForeignKey
ALTER TABLE "subscription_payments" ADD CONSTRAINT "subscription_payments_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "corporates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
