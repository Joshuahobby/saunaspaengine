# Responsiveness & Accessibility Improvement Plan

---

## Overview

Two-track plan: **Responsive Layout** (all screen sizes) and **Accessibility** (screen readers, keyboard, motion). Each track organized by priority. Estimated effort: **~25-30 hours total**.

---

## Track A — Responsiveness (All Screen Sizes)

### A1 — Landing Page: Hero + Pricing on Mobile
**Priority:** High | **Files:** `src/app/page.tsx`, `src/components/landing/PricingContent.tsx`
- Pricing table `min-w-[700px]` wrapped in `overflow-x-auto` — add card-based layout at `max-md:` as alternative
- Hero section: verify `flex-col` on mobile works with all content (icons, CTAs)
- Feature grid: currently `md:grid-cols-3` — add stacking behavior

### A2 — Fixed-Height Containers on Mobile
**Priority:** High | **Files:** Multiple dashboard pages
- Chart/detail containers with `h-[350px]`, `h-[500px]`, `h-[600px]`, `h-[650px]` overflow on short mobile viewports
- Replace with `min-h-[300px] max-h-[50vh] md:h-[600px]` or similar viewport-relative approach
- Key files: `client-profile.tsx` (h-[650px]), `admin/analytics/client-page.tsx`, `executive/analytics/client-page.tsx`, admin dashboard

### A3 — Touch Target Audit
**Priority:** High | **Files:** All interactive components
- All interactive elements should be `min-h-[44px]` (WCAG 2.5.8)
- Search for `py-1`, `py-1.5`, `size-8`, `size-9` on clickable elements — upgrade to `min-h-[44px]`
- Focus: pagination buttons (`size-10` ✓), tab buttons (`py-1.5` ✗), close buttons (`size-8` ✗)

### A4 — Navigation Tabs Horizontal Scroll
**Priority:** Medium | **Files:** Multiple tabbed pages
- `whitespace-nowrap` on tab bars forces horizontal scroll on mobile
- Add `flex-wrap` at `max-md:` or use dropdown pattern for overflow tabs
- Key files: `staff/page.tsx`, `operations/page.tsx`, `growth/page.tsx`, `settings/compliance/page.tsx`, admin sub-pages

### A5 — Table Mobile Layouts
**Priority:** Medium | **Files:** ~20 table instances
- Current: `overflow-x-auto` wrapper — functional but poor UX
- Add responsive card-based row layout at `max-md:` for key tables (clients list, inventory, services, payments)
- Alternatively: hide less-important columns with `hidden md:table-cell`
- Priority tables: `clients/client-page.tsx`, `inventory/client-page.tsx`, `services/client-page.tsx`

### A6 — Dashboard Charts Responsive Height
**Priority:** Medium | **Files:** Analytics/report pages
- Recharts containers use `h-[350px]` — add `w-full` + responsive aspect ratio
- Use `min-h-[250px] md:min-h-[350px]` pattern

### A7 — Ultra-Wide Screen Layout
**Priority:** Low | **Files:** Root dashboard layout, content grids
- Very low `2xl:` usage — add `max-w-[1600px] mx-auto` constraint where missing
- Add `3xl:` breakpoint at 1800px for ultra-wide monitors

### A8 — Modal Mobile Sizing
**Priority:** Medium | **Files:** All modal components
- CheckoutModal, MembershipCardModal, override-modal, paywall-modal use `max-w-sm` or fixed `max-w-[400px]`
- Change to `w-[calc(100vw-32px)] max-w-md` so modals fill width on mobile with 16px gutters
- Ensure modal content scrolls (overflow-y-auto) on short viewports

---

## Track B — Accessibility (Screen Readers & Keyboard)

### B1 — Skip-to-Content Link [CRITICAL]
**Priority:** Highest | **Files:** `src/app/layout.tsx`, `src/app/(dashboard)/layout.tsx`
- Add visually-hidden skip link as first focusable element
- Links to `<main id="main-content">` — add `id` to main element in both layouts
- ```tsx
  <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-[var(--color-primary)] focus:text-white focus:rounded-xl">
      Skip to content
  </a>
  ```
- **WCAG 2.4.1 Bypass Blocks** — this is a failure without it

### B2 — Form Validation ARIA [CRITICAL]
**Priority:** Highest | **Files:** All form components
- Add `aria-describedby` linking to error message elements
- Add `aria-invalid` dynamically when validation fails
- Add `aria-required="true"` alongside HTML5 `required`
- Key patterns to update:
  - `form onSubmit` handlers: set `aria-invalid` on fields with errors
  - Error display spans: give them `id="field-error-{name}"` for `aria-describedby` reference
  - Login, signup, employee forms, checkout, settings, client registration

### B3 — Configure eslint-plugin-jsx-a11y [CRITICAL]
**Priority:** Highest | **Files:** `eslint.config.mjs`
- Package already installed — add recommended ruleset
- ```js
  import jsxA11y from "eslint-plugin-jsx-a11y";
  // in config array:
  jsxA11y.flatConfigs.recommended,
  ```
- Will catch: missing alt text, non-button onClick, missing ARIA, heading hierarchy issues
- Run `npm run lint` and fix all auto-fixable issues, then triage remaining

### B4 — aria-current on Navigation [HIGH]
**Priority:** High | **Files:** `src/components/layout/Sidebar.tsx`, `MobileNav.tsx`, `Header.tsx`
- Add `aria-current="page"` to active nav link
- Sidebar: check `pathname.startsWith(link.href)` pattern (already exists for active class) → add `aria-current`
- MobileNav: same pattern
- Public Header: same for landing page nav

### B5 — Modal Focus Trapping [HIGH]
**Priority:** High | **Files:** ~8 modal components
- Create reusable `useFocusTrap` hook or `<FocusTrap>` component
- On modal open: save `document.activeElement`, focus first focusable element inside modal
- On Tab at end of modal: cycle focus back to first element (focus trap)
- On modal close: restore previously focused element
- Trap `Tab` and `Shift+Tab` keys
- Key modals: `MembershipCardModal`, `CheckoutModal`, `override-modal`, `paywall-modal`, `action-dropdown`, `emergency-overlay`, `DeleteBranchModal`, confirmation dialogs

### B6 — Replace Non-Button Interactive Divs [HIGH]
**Priority:** High | **Files:** ~15 instances
- All modal backdrop `<div onClick={onClose}>` elements:
  - Add `<button>` with `aria-label="Close"` and `className="absolute inset-0"`
  - Or add `role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && onClose()}`
- Interactive card in `client-profile.tsx:210` — add `role="button" tabIndex={0}`
- Service/inventory modals — same treatment
- Key: every interactive element must be focusable and keyboard-activatable

### B7 — framer-motion Reduced Motion [HIGH]
**Priority:** High | **Files:** 20+ files using framer-motion `<motion.*>`
- Create `useReducedMotion` wrapper in `src/hooks/use-reduced-motion.ts`
- ```tsx
  import { useReducedMotion } from "framer-motion";
  // In animated components:
  const shouldReduce = useReducedMotion();
  const transition = shouldReduce ? { duration: 0 } : { duration: 0.3 };
  ```
- Or import framer-motion's built-in `useReducedMotion` hook
- Key files: `template.tsx` (page transitions), `Sidebar.tsx`, `FaqAccordion.tsx`, `Step3Team.tsx`, `command-center.tsx`, `client-profile.tsx`, all `motion.*` usages

### B8 — aria-describedby for Tooltips/Descriptions [MEDIUM]
**Priority:** Medium | **Files:** Multiple components
- Add `aria-describedby` on form elements that have helper text below them
- ID pattern: `{field-name}-hint`
- Key: ALL form validation states need this

### B9 — Fieldset/Legend for Form Groups [MEDIUM]
**Priority:** Medium | **Files:** Settings forms, employee forms
- Wrap radio button groups, checkbox groups, and related sections in `<fieldset>` with `<legend>`
- Key files: settings forms, employee registration, Step2Services, Step3Team

### B10 — Auto-A11y Testing Setup [MEDIUM]
**Priority:** Medium | **Files:** New files
- Add `jest-axe` to devDependencies
- Create test helper: `src/test/custom-matchers.ts` with `toBeAccessible()` matcher
- Add CI step: `npx axe --exit` (or configure in vitest)
- Write smoke tests for key pages checking basic a11y rules

---

## Implementation Order

### Phase 1 — Quick Wins (~2 hours)
| Step | Task | Est. |
|------|------|------|
| 1 | B1 — Skip-to-content link | 10min |
| 2 | B3 — Configure eslint-plugin-jsx-a11y | 5min |
| 3 | B4 — aria-current on sidebar/nav | 20min |
| 4 | B8 — aria-describedby on form fields | 30min |
| 5 | A7 — Ultra-wide constraint | 10min |

### Phase 2 — Forms & Inputs (~4 hours)
| Step | Task | Est. |
|------|------|------|
| 6 | B2 — form validation ARIA (aria-invalid + aria-describedby) | 2h |
| 7 | B9 — fieldset/legend on form groups | 1h |
| 8 | A3 — touch target audit (min-h-[44px]) | 1h |

### Phase 3 — Modals & Navigation (~5 hours)
| Step | Task | Est. |
|------|------|------|
| 9 | B5 — modal focus trap hook + implementation | 2h |
| 10 | B6 — replace non-button interactive divs | 1.5h |
| 11 | A4 — navigation tab wrapping on mobile | 1h |
| 12 | A8 — modal mobile sizing | 30min |

### Phase 4 — Animations & Motion (~2 hours)
| Step | Task | Est. |
|------|------|------|
| 13 | B7 — framer-motion useReducedMotion integration | 1.5h |
| 14 | A2 — fixed-height containers responsive | 30min |

### Phase 5 — Tables & Layouts (~6 hours)
| Step | Task | Est. |
|------|------|------|
| 15 | A5 — responsive table layouts (card view on mobile) | 4h |
| 16 | A1 — landing page mobile layout | 1h |
| 17 | A6 — chart responsive heights | 1h |

### Phase 6 — Testing & Polish (~3 hours)
| Step | Task | Est. |
|------|------|------|
| 18 | B10 — jest-axe setup + smoke tests | 1h |
| 19 | Run full lint after jsx-a11y config, fix issues | 1h |
| 20 | Manual QA on 375px, 768px, 1280px, 1920px | 1h |

---

## Files Most Impacted

| File | Phases | Changes |
|------|--------|---------|
| `src/app/layout.tsx` | 1 | Skip link, main-content id |
| `eslint.config.mjs` | 1 | jsx-a11y ruleset |
| `src/components/layout/Sidebar.tsx` | 1, 4 | aria-current, reduced motion |
| `src/components/layout/MobileNav.tsx` | 1 | aria-current |
| `src/app/(dashboard)/layout.tsx` | 1 | skip link, main-content id |
| `src/components/operations/CheckoutModal.tsx` | 3, 4 | focus trap, backdrop button, reduced motion |
| `src/components/clients/MembershipCardModal.tsx` | 3 | focus trap |
| `src/components/ui/paywall-modal.tsx` | 3 | backdrop button, focus trap |
| `src/components/safety/emergency-overlay.tsx` | 3 | backdrop button |
| `src/app/template.tsx` | 4 | reduced motion |
| `src/app/(dashboard)/clients/[id]/client-profile.tsx` | 3 | interactive div role, touch targets |
| `src/app/(dashboard)/clients/client-page.tsx` | 5 | responsive table |
| `src/app/(dashboard)/inventory/client-page.tsx` | 5 | responsive table, modal a11y |
| `src/app/(dashboard)/services/client-page.tsx` | 5 | responsive table, modal a11y |
| ~20 form files | 2 | aria-invalid, fieldset, touch targets |
| ~15 component files | 4 | useReducedMotion |

---

## NOT in Scope

| Item | Rationale |
|------|-----------|
| Full design system refactor | This plan adapts existing code, does not redesign |
| i18n / lang attribute | Separate effort |
| Color contrast redesign | Tokens already pass WCAG AA — low-opacity edge cases are the issue |
| Screen reader testing on real devices | Requires JAWS/NVDA/VoiceOver — manual QA step |
| Rewrite inline `<img>` to `next/image` | Build optimization, not a11y/response concern |
| Dynamic font scaling | Separate accessibility enhancement |
