-- CreateIndex
CREATE INDEX "audit_logs_businessId_createdAt_idx" ON "audit_logs"("businessId", "createdAt");

-- CreateIndex
CREATE INDEX "clients_phone_idx" ON "clients"("phone");

-- CreateIndex
CREATE INDEX "clients_businessId_status_idx" ON "clients"("businessId", "status");

-- CreateIndex
CREATE INDEX "commission_logs_employeeId_status_idx" ON "commission_logs"("employeeId", "status");

-- CreateIndex
CREATE INDEX "service_records_businessId_status_idx" ON "service_records"("businessId", "status");

-- CreateIndex
CREATE INDEX "service_records_businessId_status_completedAt_idx" ON "service_records"("businessId", "status", "completedAt");

-- CreateIndex
CREATE INDEX "service_records_clientId_businessId_idx" ON "service_records"("clientId", "businessId");

-- CreateIndex
CREATE INDEX "service_records_employeeId_idx" ON "service_records"("employeeId");
