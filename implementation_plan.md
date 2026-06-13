# Membership Scanning & PawaPay Integration Completion

This document outlines the architecture and implementation plan for the remaining aspects of the **Membership Card Scanning** flow and the **PawaPay Webhook B2C Expansion**.

## Current Progress

- [X] **Database Schema Migration**: Added `pawapayDepositId` and `paymentStatus` to `ServiceRecord`.
- [X] **Database Sync**: Ran `npx prisma db push` and fixed `seed.ts` for idempotent data reset.

---

## Proposed Changes

### 1. Membership Card Scanning (Hardware Integration)

#### [MODIFY] `src/components/operations/CheckInContainer.tsx`

- **USB Scanner Support**: Implement a `useEffect` that listens for `keydown` events.
- **Logic**:
  - Detect rapid sequential keystrokes (intervals < 40ms).
  - Buffer characters until an `Enter` key is received.
  - If the buffer is received rapidly, call `handleScanSuccess(buffer)`.
  - This allows plug-and-play support for external USB scanners acting as HID keyboards.

### 2. Legacy Client Support (QR Generation)

#### [NEW] `src/app/(dashboard)/clients/[id]/actions.ts`

- Add `generateClientQrAction(clientId)` to generate a `spa-client:id` string and save it to the client's `qrCode` field if null.

#### [MODIFY] `src/app/(dashboard)/clients/[id]/client-profile.tsx`

- Add a "Generate QR Code" status indicator/button for clients currently missing one.
- Ensure the `MembershipCardModal` only opens if a QR code exists or handles the generation.

### 3. Cloudinary Integration for Membership Cards

#### [MODIFY] `src/lib/membership-actions.ts`

- Integrate `cloudinary` SDK.
- Update `saveMembershipCardAction` to:
  1. Upload the provided Base64 image to a `sauna-spa/membership-cards` folder.
  2. Store the resulting `secure_url` in `client.membershipCardUrl`.

### 4. PawaPay B2C Expansion (Service Checkout)

#### [MODIFY] `src/components/operations/CheckoutModal.tsx` (or similar)

- Update the checkout UI to include a "Mobile Money" option.
- When MoMo is selected, initiate a PawaPay B2C deposit prompt.
- Stamp the `ServiceRecord` with the `pawapayDepositId`.

#### [MODIFY] `src/app/api/webhooks/pawapay/route.ts`

- Add logic to handle `ServiceRecord` updates when a deposit webhook arrives.
- Map `COMPLETED` -> `ServiceRecordStatus.COMPLETED` and `paymentStatus = "PAID"`.

## Verification Plan

### Automated Tests

- Mock a PawaPay success webhook targeting a `ServiceRecord`.

### Manual Verification

- **USB Scanner**: Type a valid QR string very rapidly manually (or use a scanner) and verify the "Membership Verified" toast appears without using the camera.
- **Cloudinary**: Verify the `client.membershipCardUrl` in Prisma Studio starts with `https://res.cloudinary.com/...` after syncing a card.
- **Checkout**: Trigger a MoMo prompt on a test phone and verify status updates automatically.
