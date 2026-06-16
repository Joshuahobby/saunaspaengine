# Membership Scanning & PawaPay Integration Completion

This document outlines the architecture and implementation plan for the remaining aspects of the **Membership Card Scanning** flow and the **PawaPay Webhook B2C Expansion**.

## Current Progress

- [X] **Database Schema Migration**: Added `pawapayDepositId` and `paymentStatus` to `ServiceRecord`.
- [X] **Database Sync**: Ran `npx prisma db push` and fixed `seed.ts` for idempotent data reset.

---

## Proposed Changes

### 1. Membership Card Scanning (Hardware Integration)

#### [MODIFY] `src/components/operations/CheckInContainer.tsx`

- **USB Scanner Support**: Buffer-based approach already exists at line 126. Enhance with:
  - **Scan buffer indicator**: Show a pill/chip near the QR reader area displaying the buffer length when scanning is active. Style per DESIGN.md: IBM Plex Mono 12px, `--text-muted`, `--r-sm` (6px) radius, Ghost-tier visibility.
  - **Promote `buffer` from `let` to `useState`**: The existing `let buffer = ""` inside `useEffect` cannot drive React renders. Must use `useState<string>('')` (or a ref + tickle state) for the visual indicator to update in real time.
  - **Client-side input validation**: Accept either `spa-client:` or `SSE:` prefix. Reject silently (no toast) for any other prefix or minimum length failure. Clear the buffer and remain in SCANNING mode.
  - **Buffered characters** accumulated until `Enter` key is received.
  - **Feedback differentiation**: Minimal feedback for high-frequency use (50-100x/day) — scan indicator resolves briefly, mode transitions to RESULT.

**DESIGN.md tokens**: Scan indicator uses `var(--text-muted)` for label, IBM Plex Mono 12px for buffer count, `var(--r-sm)` radius.

**a11y**: Scan result output needs an `aria-live="polite"` region. Reduced motion: `@media (prefers-reduced-motion: reduce)` disables scan-line animations.

### 2. Legacy Client Support (QR Generation)

#### [ALREADY DONE] `src/app/(dashboard)/clients/[id]/actions.ts`

- `generateClientQrAction(clientId)` already exists at line 20. Generates `spa-client:${clientId}`, saves to `client.qrCode`, revalidates path. No changes needed.

#### [MODIFY] `src/app/(dashboard)/clients/[id]/client-profile.tsx`

- **Restyle existing "Generate System QR" button** (currently at line 154, `bg-rose-500/10` alert style) to **Ghost variant** per DESIGN.md: transparent bg, `--text-muted`, hover → `--text-main` + `--bg-hover`.
- **Add QR-missing badge** to the client card header as a subtle indicator that a QR code needs to be generated (compensates for Ghost button being less visible than the current rose alert).
- **Icon**: `QrCode` (was `Fingerprint`).
- **Interaction states**:
  - **Idle**: "Generate QR Code" label with `QrCode` icon, Ghost variant
  - **Loading**: Spinner replaces icon, button disabled
  - **Success**: Label swaps to "QR Ready", non-interactive with subtle success tint
  - **Error**: Toast error with server action error message
- **Feedback differentiation**: Explicit success confirmation (label change, badge) since this is an infrequent admin action.

**DESIGN.md tokens**: Ghost variant uses `var(--text-dim)` idle → `var(--text-muted)` hover.

**Responsive**: Stacks below membership card content on mobile. Touch target ≥44px.

**a11y**: Focus moves to new QR indicator after generation. `aria-label="Generate QR code for client"`.

### 3. Cloudinary Integration for Membership Cards

#### [ALREADY DONE] `src/lib/membership-actions.ts`

- `saveMembershipCardAction` already uploads Base64 to Cloudinary `sauna-spa/membership-cards` folder, stores `secure_url`, backfills QR code, creates Audit Log, revalidates paths. No changes needed.

### 4. PawaPay B2C Expansion (Service Checkout)

#### [MODIFY] `src/components/operations/CheckoutModal.tsx`

- Add `"use client"` directive (missing — component uses hooks but lacks it).
- **Add MoMo 120s timeout + polling**:
  - Polling endpoint: `GET /api/service-records/[id]/status` → returns `{ status, paymentStatus }` or 404.
  - Use `apiAuth(['RECEPTIONIST', 'MANAGER'])` + `apiHandler` from `api-utils.ts`.
  - Start `setInterval(3000)` when `status === 'PENDING_MOMO'`, check record status.
  - **COMPLETED** from poll → `status = 'SUCCESS'`.
  - **FAILED** from poll → `status = 'ERROR'` with failure details.
  - **POLL_FAILED** (network error / 500) → distinct error state from timeout.
  - **120s elapsed** without completion → `status = 'ERROR'`, message "Payment prompt expired", Retry button re-sends prompt.
  - **Cleanup**: `clearInterval` on unmount, success, or error.
- Timeout respects `prefers-reduced-motion: reduce` via CSS `@media` query disabling `animate-ping` ring.

**DESIGN.md tokens**: Timeout error uses Danger pattern. Retry button uses Secondary variant (`--bg-surface`, `--text-main`, `--border`).

**a11y**: PENDING_MOMO ping/pulse disabled via `@media (prefers-reduced-motion: reduce)`.

#### [ALREADY DONE] `src/app/api/webhooks/pawapay/route.ts`

- `handleServiceRecordPayment` already handles COMPLETED → `completeServiceRecord()` and FAILED → `paymentStatus: "FAILED"`. No changes needed.

#### [NEW] `src/app/api/service-records/[id]/status/route.ts`

- `GET` handler returning `{ status: ServiceRecordStatus, paymentStatus: string | null }`.
- Auth: `apiAuth(['RECEPTIONIST', 'MANAGER'])` via `api-utils.ts`.
- Wrapped with `apiHandler` for consistent error handling.
- 404 if record not found.

## NOT in Scope

| Item | Rationale |
|------|-----------|
| SSE: ↔ spa-client: QR format unification | Both formats work via dual-prefix scanner validation. Full unification is a cleanup PR. |
| Cloudinary card generation refinements | Already shipping. Further polish (retry, progress tracking) is future work. |
| Test framework setup (Jest/Vitest) | The project has no test infrastructure. Adding one is a prerequisite for automated tests, not part of feature work. |
| Ghost Button reusable component | Every Ghost button is hand-coded with CSS vars. A `Button` component with `variant="ghost"` would prevent style drift, but is a refactor, not a feature. |

## What Already Exists

| File | Purpose | Status |
|------|---------|--------|
| `src/lib/membership-actions.ts:28-42` | Cloudinary upload to `sauna-spa/membership-cards` | SHIPPED |
| `src/app/api/webhooks/pawapay/route.ts:103-131` | `handleServiceRecordPayment` — COMPLETED → `completeServiceRecord()` | SHIPPED |
| `src/app/(dashboard)/clients/[id]/actions.ts:20-36` | `generateClientQrAction` — produces `spa-client:${clientId}` | SHIPPED |
| `src/app/(dashboard)/clients/[id]/client-profile.tsx:104-114` | `handleGenerateQr` — calls the server action | SHIPPED (needs restyle) |
| `src/components/operations/CheckInContainer.tsx:126-160` | USB scanner buffer — 50ms debounce, 8-char min, Enter acceptance | SHIPPED (needs indicator + validation) |
| `src/components/operations/CheckoutModal.tsx:263-286` | MoMo PENDING_MOMO state UI | SHIPPED (needs timeout + polling) |

## Implementation Tasks

- [ ] **T1 (P1, human: ~1h / CC: ~15min)** — CheckInContainer.tsx — Promote buffer to useState, add scan indicator pill
  - Files: `src/components/operations/CheckInContainer.tsx`
  - Verify: type rapidly → pill shows character count; Enter → scan fires
- [ ] **T2 (P1, human: ~30min / CC: ~10min)** — CheckInContainer.tsx — Add dual-prefix validation (spa-client: + SSE:), silent garbage rejection
  - Files: `src/components/operations/CheckInContainer.tsx`
  - Verify: garbage clears silently; valid prefix triggers search
- [ ] **T3 (P1, human: ~15min / CC: ~5min)** — /api/clients/search — Fix SSE: prefix search to parse SSE:branchId:clientId → clientId
  - Files: `src/app/api/clients/search/route.ts`
  - Verify: scanning SSE: format code finds the client
- [ ] **T4 (P1, human: ~1.5h / CC: ~20min)** — CheckoutModal.tsx — Add MoMo 120s timeout + 3s polling + POLL_FAILED state + cleanup
  - Files: `src/components/operations/CheckoutModal.tsx`
  - Verify: send MoMo → poll every 3s → webhook completes → SUCCESS; 120s elapsed → error + Retry
- [ ] **T5 (P1, human: ~30min / CC: ~10min)** — Create GET /api/service-records/[id]/status endpoint with api-utils.ts pattern
  - Files: `src/app/api/service-records/[id]/status/route.ts`
  - Verify: `curl` returns `{ status, paymentStatus }` or 404
- [ ] **T6 (P1, human: ~5min / CC: ~1min)** — CheckoutModal.tsx — Add "use client" directive
  - Files: `src/components/operations/CheckoutModal.tsx`
  - Verify: no "You're importing a component that needs useState" error
- [ ] **T7 (P2, human: ~30min / CC: ~10min)** — client-profile.tsx — Restyle QR button to Ghost variant + QrCode icon + loading/success states
  - Files: `src/app/(dashboard)/clients/[id]/client-profile.tsx`
  - Verify: Ghost style visible; loading → spinner; success → "QR Ready"
- [ ] **T8 (P2, human: ~15min / CC: ~5min)** — client-profile.tsx — Add QR-missing badge to client card header
  - Files: `src/app/(dashboard)/clients/[id]/client-profile.tsx`
  - Verify: badge visible when `!qrCode`; hidden after generation

## Failure Modes

| Code Path | Failure | Covers? | User sees |
|-----------|---------|---------|-----------|
| USB buffer → search API | Network timeout on `/api/clients/search` | No test, yes error handling | `toast.error` (existing) |
| USB buffer → search API | Malformed QR with valid prefix but invalid client ID | No test, yes error handling | `toast.error` "Client not found" |
| MoMo polling → status endpoint | Poll endpoint 500 | POLL_FAILED state added | Distinct error from timeout |
| MoMo polling → status endpoint | Webhook completes but poll doesn't see it (race) | 3s interval handles | Transitions to SUCCESS on next tick |
| MoMo deposit initiation | PawaPay API timeout (>10s) | No client-side timeout | User waits indefinitely on button |
| QR generation | Server action fails mid-write | Yes, try/catch returns error | Toast error message |
| QR generation | Double-click rapid submit | `isSaving` guard (existing) | Second click blocked |

## Parallelization Strategy

| Step | Modules touched | Depends on |
|------|----------------|------------|
| T1 + T2 | `CheckInContainer.tsx` | — |
| T3 | `api/clients/search/route.ts` | — |
| T4 + T6 | `CheckoutModal.tsx` | T5 |
| T5 | `api/service-records/[id]/status/route.ts` | — |
| T7 + T8 | `client-profile.tsx` | — |

**Lane A:** T1+T2 (CheckInContainer) — independent
**Lane B:** T3 (search route fix) — independent
**Lane C:** T5 (status endpoint) → T4+T6 (CheckoutModal with polling) — sequential
**Lane D:** T7+T8 (client-profile restyle) — independent

**Execution:** Launch A + B + C + D in parallel worktrees. CheckoutModal (C) depends on the status endpoint — build the endpoint first, then add polling. Merge order doesn't matter; no module conflicts between lanes.

- **USB Scanner**: Type a valid QR string very rapidly manually (or use a scanner) and verify:
  - The scan buffer indicator appears during input
  - "Membership Verified" toast appears without using the camera
  - Typing garbage data (e.g., "/////") silently clears without a toast error
- **QR Generation**: Open a client profile without a QR code, click the Ghost "Generate QR Code" button, and verify the button enters loading state then transitions to a success state.
- **Cloudinary**: Upload a membership card and verify loading indicator appears, then success toast fires and `client.membershipCardUrl` starts with `https://res.cloudinary.com/...`.
- **Checkout**: Trigger a MoMo prompt on a test phone and verify:
  - PENDING_MOMO state with animated indicator
  - On completion: success state with green checkmark
  - On timeout (120s without response): error state with "Payment prompt expired" and Retry button
- **Reduced motion**: Enable `prefers-reduced-motion: reduce` in OS/browser settings and verify MoMo ping animation and scan animations are disabled.

---

## Design Decisions

| # | Source | Decision | Resolution |
|---|--------|----------|-----------|
| D2 | design-review | USB scan buffer feedback | Add pill indicator showing buffer state |
| D3 | design-review | QR Generate button placement | Near membership card section |
| D4 | design-review | MoMo timeout | 120s timeout → error state with Retry |
| D5 | design-review | Missing states (QR gen, Cloudinary) | Add loading/error/success to both |
| D6 | design-review | Power-user vs first-time UX | Scanner = minimal; QR gen = explicit |
| D7 | design-review | DESIGN.md alignment | All new elements reference specific tokens |
| D8 | design-review | Responsive & a11y | Reduced motion, ARIA, touch targets, responsive stacking |
| D9 | design-review | Invalid USB scan | Reject silently, clear buffer, no toast |
| D10 | design-review | QR button variant | Ghost (per DESIGN.md button spec) |
| D11 | eng-review | MoMo timeout architecture | Lightweight polling endpoint + 3s client interval |
| D12 | eng-review | QR format divergence | Scanner accepts both spa-client: and SSE: prefixes |
| D13 | eng-review | Plan accuracy | Mark done items [ALREADY DONE] |
| D14 | eng-review | Buffer indicator feasibility | Promote `let buffer` to `useState` |
| D15 | eng-review | SSE: backend search | Fix `/api/clients/search` to parse SSE: format |
| D16 | eng-review | QR button UX regression | Ghost button + QR-missing badge on card header |
| D17 | eng-review | Polling endpoint pattern | Use `apiAuth` + `apiHandler` from `api-utils.ts` |
| D18 | eng-review | Polling failure state | Add distinct POLL_FAILED state (network vs timeout) |
| D19 | eng-review | Missing "use client" | Add directive to CheckoutModal.tsx |
| D20 | eng-review | Reduced-motion mechanism | CSS `@media (prefers-reduced-motion: reduce)` |

---

## GSTACK REVIEW REPORT

| Review | Trigger | Why | Runs | Status | Findings |
|--------|---------|-----|------|--------|----------|
| Design Review | `/plan-design-review` | UI/UX gaps | 1 | CLEAR | score: 4/10 → 8/10, 10 decisions |
| Eng Review | `/plan-eng-review` | Architecture & tests (required) | 1 | CLEAR | 4 issues, 0 critical gaps |

- **VERDICT:** ENG + DESIGN CLEARED — ready to implement
- **NO UNRESOLVED DECISIONS**
