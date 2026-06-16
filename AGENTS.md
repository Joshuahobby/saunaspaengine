# AGENTS.md — Sauna SPA Engine

## Tech Stack

- **Next.js 16** App Router with Turbopack (dev), **no Pages Router**
- **PostgreSQL** via Neon serverless (production) / native TCP (development)
- **Prisma 6** with `driverAdapters` (Neon adapter in prod, native engine in dev) — `src/lib/prisma.ts`
- **NextAuth v5** (beta.30), JWT sessions, 60min expiry, 15min refresh
- **Tailwind CSS v4** (`@import "tailwindcss"` postcss plugin), **no Sass/Styled Components**
- **Framer Motion** for page transitions (`src/app/template.tsx`)
- **Hosted on Vercel** with Analytics

## Project Structure

```
src/
  app/             # Next.js App Router routes
    (public)/      # Landing, pricing, booking, changelog, docs
    (auth)/        # Auth layout wrapper
    (onboarding)/  # Post-signup onboarding wizard
    (dashboard)/   # 30+ dashboard route groups (operations, clients, finance, etc.)
    api/           # 20+ API route handlers
    actions/       # Server Actions (auth, business setup)
  components/
    admin/ auth/ clients/ dashboard/ employees/ forms/ landing/ layout/
    operations/ providers/ safety/ settings/ support/ theme/ ui/
  lib/             # Shared logic: prisma.ts, auth.ts, branch-context.ts, permissions,
                   # subscription.ts, pawapay.ts, rate-limit.ts, cloudinary.ts, etc.
  types/           # operations.ts — ExtraService shared type
  hooks/           # use-debounce.ts
  proxy.ts         # Next.js 16 proxy (replaces middleware.ts) — NextAuth matcher
  auth.config.ts   # Edge-safe auth config (callbacks, pages, authorized)
```

## Key Architecture Patterns

### Auth
- `src/proxy.ts` is the **Next.js 16 proxy** (equivalent of `middleware.ts`). Exports `NextAuth(authConfig).auth` with a matcher that excludes `/api`, `/_next/static`, `/sw.js`, `.png`.
- Auth config split: `src/auth.config.ts` (edge-safe — providers empty) + `src/lib/auth.ts` (Credentials provider with bcrypt).
- Users log in via email OR username (see `src/lib/auth.ts:findFirst({ OR: [...] })`).
- Roles: `ADMIN | OWNER | MANAGER | RECEPTIONIST | EMPLOYEE`.

### Multitenancy — Branch Context
- `src/lib/branch-context.ts` is critical. Staff (EMPLOYEE/RECEPTIONIST) are locked to one branch. OWNER/ADMIN can switch via `?branchId=` URL param or `sauna_active_branch` cookie.
- Always call `resolveEffectiveBranchId(session)` in API routes and `getActiveBranchContext(session, searchParams)` in pages.

### Permissions
- Two guard patterns: `requireRole(roles[])` (simple role check) and `requirePermission(key)` (fine-grained, with per-business overrides — `src/lib/permissions.ts`).

### Subscription Gating
- `getSubscriptionState(businessId)` → `SubscriptionGate` component wraps dashboard content; `SubscriptionBanner` shows warnings. Business has `approvalStatus: PENDING | APPROVED | REJECTED | SUSPENDED`.

### Prisma Quirks
- **All tables use `@@map("snake_case")`** — query with Prisma model names, but raw SQL / migrations use snake_case.
- Client singleton guards against browser eval (`typeof window !== "undefined"` returns dummy object).
- Dev uses native engine (TCP); prod uses `PrismaNeon` adapter with `ws` WebSocket.

### Style & Design
- DESIGN.md is source of truth. Design tokens as CSS variables in `globals.css`. `--color-primary: #2d5a27` (Eucalyptus Green).
- **ESLint rule**: `react/forbid-dom-props: ["warn", {forbid: ["style"]}]` — use CSS variables, not inline styles.
- Fonts: Cabinet Grotesk (display), Instrument Sans (body), IBM Plex Mono (data). Loaded via Google Fonts + Fontshare in root layout.
- `globals.css` uses `@import "tailwindcss"` — no `@tailwind` directives.
- **All new UI features must specify loading/empty/error/success states** in their plan or spec, referencing DESIGN.md tokens. MoMo payment flow has a 120s timeout before showing an error with retry.

### Config
- `tsconfig.json: noImplicitAny: false` — intentional relaxation.
- `package.json` seed command: `npx tsx prisma/seed.ts`.

## Developer Commands

| Command | What it does |
|---|---|
| `npm run dev` | Next.js dev server (Turbopack) |
| `npm run build` | `prisma generate` → `next build` |
| `npm run lint` | `next lint` (ESLint flat config) |
| `npm run seed` | `npx tsx prisma/seed.ts` |
| `npx prisma studio` | Prisma GUI data browser |
| `npx prisma migrate dev` | Local schema migration |

There is no `npm test` script yet.

## Critical Conventions

- **Server-first**: default to server components. Only add `"use client"` when state/hooks/browser APIs are needed.
- **Route groups**: `(public)/`, `(auth)/`, `(onboarding)/`, `(dashboard)/` — use these instead of top-level routes.
- **API route pattern**: `GET/DELETE` in route.ts with `export const dynamic = "force-dynamic"` at top. Use `apiAuth(roles?)` from `src/lib/api-utils.ts` for auth+role check, `validateFields()` for input, `apiHandler()` for error wrapping.
- **Server Actions** live in `src/app/actions/` (not `src/lib/`).
- **Rate limiting**: login (10/15min) and password reset use `src/lib/rate-limit.ts`.
- **Payment**: PawaPay integration in `src/lib/pawapay.ts` for MoMo deposits.
- **Image uploads**: Cloudinary via `src/lib/cloudinary.ts`.
- **No `.env` in repo**. DATABASE_URL, RESEND_API_KEY, CLOUDINARY_URL, AUTH_SECRET, etc. required.

## Security

- CSP headers in `next.config.ts` allow `unsafe-inline` scripts/styles (Next.js hydration), Cloudinary/Unsplash/Google images.
- `X-Frame-Options: DENY`, `Strict-Transport-Security: 1 year`.
- Auth config (`src/auth.config.ts:87-89`) has 60min inactivity timeout, 15min token refresh.
- `sanitizeHexColor()` in dashboard layout prevents CSS injection via DB-stored primaryColor.
