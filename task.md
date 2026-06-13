- [ ] **1. Database Schema Migration**
  - [ ] Add `pawapayDepositId String? @unique` to `ServiceRecord`.
  - [ ] Add `paymentStatus String? @default("PENDING")` to `ServiceRecord`.
  - [ ] Run `npx prisma migrate dev` in `sauna-spa-engine`.

- [ ] **2. Hardware Integration (USB Scanners)**
  - [ ] Modify `CheckInContainer.tsx` to handle rapid sequential keystrokes (intercept USB scanners acting as keyboards).
  - [ ] Test verification logic bypass.

- [ ] **3. Legacy QR Code Generation**
  - [ ] Add action in `src/app/(dashboard)/clients/[id]/actions.ts` (or similar) to backfill missing QR codes for older clients.
  - [ ] Add "Generate QR Code" button to `client-profile.tsx` for clients without one.

- [ ] **4. Cloudinary Integration for Membership Cards**
  - [ ] Update `src/lib/membership-actions.ts` to upload base64 images to Cloudinary.
  - [ ] Save Cloudinary persistent URL to `client.membershipCardUrl`.

- [x] **5. PawaPay B2C Expansion (Service Checkout)**
  - [x] Allow selection of payment mode AND initiation of MoMo prompt during the **Check-Out** flow for a Service Record.
  - [x] Create/Update endpoint to trigger PawaPay B2C payment and stamp `pawapayDepositId` to `ServiceRecord`.
  - [x] Update `src/app/api/webhooks/pawapay/route.ts` to process webhook completions for `ServiceRecord$ checkouts.
  - [x] Created `completeServiceRecord` core logic in `operations-logic.ts`.
  - [x] Implemented `CheckoutModal` and server actions for MoMo flow.
