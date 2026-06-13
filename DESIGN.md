# DESIGN.md — Sauna SPA Engine

## Concept: Legitimacy

Every spa management SaaS competes on calm — soft rounding, pastel palettes, retreat aesthetics. **Sauna SPA Engine takes the opposite position.** The owner who opens this software is not here to relax; they are checking if today's revenue hit target. The software should feel like their most serious business tool — the thing that proves they run a real operation.

The one thing a new user should feel when they open the dashboard for the first time:
> "This is what running a real business looks like."

**Design direction:** Industrial / Utilitarian. Dark by default. Precise, high-contrast, structured. Every pixel earns its place.

---

## Typography

Three fonts. One for structure, one for reading, one for data.

| Role | Font | Use |
|---|---|---|
| Display / Structure | **Cabinet Grotesk** (900 Black) | Page titles, dashboard headings, KPI values, the product name. Tracked tight (`letter-spacing: -0.04em`). Never italic, never light. |
| Body / UI | **Instrument Sans** (400–700) | All paragraph text, nav labels, form inputs, descriptions, alerts. The workhorse. |
| Data / Identity | **IBM Plex Mono** (400–600) | Amounts, IDs, timestamps, badges, stat labels, QR codes. Anything that should feel precise and machine-readable. |

**Previous font (Poppins):** Still mapped as `var(--font-poppins)` in globals.css for backwards compatibility but should not be added to new components.

### Font size scale

| Token | Size | Use |
|---|---|---|
| Display XL | `clamp(52px, 7vw, 84px)` | Hero / landing headlines only |
| Display | `30–52px` | Section titles, stat values |
| Heading | `24px` | Dashboard page title |
| Body LG | `16–17px` | Hero subtitle, prominent descriptions |
| Body | `15px` (base) | Default body, nav items, inputs |
| Body SM | `14px` | Compact body, activity rows, alert text |
| Label | `13px` | Buttons (uppercase tracked), secondary body |
| Mono Label | `12px` | Badges, timestamps, stat deltas, section labels |
| Micro | `11px` | Sidebar section headers, mobile stat labels, QR metadata |

**Minimum font size: 11px.** Nothing below 11px in production UI.

---

## Color Tokens

Dark mode is the default. Light mode is a supported variant.

### Dark Mode (default)

```css
--bg-app:       #0a1412;   /* deepest background — app shell */
--bg-surface:   #111e1b;   /* elevated surfaces — sidebar, topbar */
--bg-card:      #1c2f29;   /* cards, stat boxes, lists */
--bg-hover:     #223830;   /* hover state for interactive items */
--border:       #2e4840;   /* default border — visible but not loud */
--border-active:#3d7a35;   /* active/selected border */
```

### Light Mode

```css
--bg-app:       #f8f7f4;
--bg-surface:   #ffffff;
--bg-card:      #ffffff;
--bg-hover:     #f0eeea;
--border:       #d0d8d2;
--border-active:#2d5a27;
```

### Text Hierarchy (4 levels)

All four levels pass WCAG AA on their respective background contexts.

| Token | Dark | Light | Use |
|---|---|---|---|
| `--text-main` | `#eef2ef` | `#141f1a` | Headings, active content, KPI numbers |
| `--text-secondary` | `#c8d9ca` | `#2e4838` | Body text, section descriptions, amounts |
| `--text-muted` | `#9ab89e` | `#4a6b52` | Labels, nav items, supporting text |
| `--text-dim` | `#6e9474` | `#7a9c82` | Timestamps, IDs, true metadata only |

**Rule:** Never use `--text-dim` for anything the user needs to read quickly. Reserve it strictly for metadata (timestamps, member IDs, secondary counts).

### Brand & Semantic

```css
/* Primary — Eucalyptus Green */
--primary:        #2d5a27;
--primary-light:  #4a8c43;   /* hover states, accents, active borders */
--primary-muted:  rgba(45,90,39,0.18);  /* subtle tints, active nav bg */

/* Semantic */
--success:    #4ade80;  --success-bg:  rgba(74,222,128,0.10);
--danger:     #f87171;  --danger-bg:   rgba(248,113,113,0.10);
--warning:    #fbbf24;  --warning-bg:  rgba(251,191,36,0.10);
--info:       #60a5fa;  --info-bg:     rgba(96,165,250,0.10);
```

**In light mode**, semantic colors shift to their standard-contrast equivalents: `#16a34a`, `#dc2626`, `#d97706`, `#2563eb`.

---

## Border Radius Scale

Sharp, functional, structured. Not the "friendly bubbles" aesthetic used by Fresha/GlossGenius.

| Token | Value | Use |
|---|---|---|
| `--r-xs` | `4px` | Badges, tags, tiny chips |
| `--r-sm` | `6px` | Buttons, inputs, small cards |
| `--r-md` | `8px` | Standard cards, dashboard frames |
| `--r-lg` | `12px` | Section containers, activity lists |
| `--r-xl` | `16px` | Dashboard mockup outer frame, modals |
| `--r-2xl` | `24px` | Feature cards only |

**Do not use `rounded-3xl` or higher (≥24px)** except for the hero/marketing layer. Business-tool pages use `--r-md` (8px) as the default card radius.

---

## Component Patterns

### Buttons

Three variants. One CTA, two supporting.

```
Primary:   bg --primary, white text, hover → --primary-light
Secondary: bg --bg-surface, --text-main, border --border, hover → border --primary-light
Ghost:     transparent, --text-muted, hover → --text-main + --bg-hover bg
Danger:    --danger-bg, --danger text, border rgba(danger, 0.25)
```

Height: `36px`. Font: Instrument Sans 700, 13px, `letter-spacing: 0.06em`, uppercase.

### Badges

Font: IBM Plex Mono 600, 12px. Dot indicator before text (`::before`, 5px circle). Rounded `--r-xs`.

- `badge-success` / `badge-danger` / `badge-warning` use semantic tokens
- `badge-muted`: `--primary-muted` bg, `--text-muted` text — for neutral states (Walk-in, Free)

### Stat Cards

Font: IBM Plex Mono for the value, `--font-display` (Cabinet Grotesk) for KPI display numbers.
- Highlight card: `border-color: --border-active` + faint green gradient background
- Currency prefix: superscript, smaller, `--text-muted`
- Delta: 12px mono, `--success` for positive, `--text-muted` for neutral

### Activity Rows

Grid layout: `1fr auto auto auto`. 13px body font.
- Name: Instrument Sans 600, `--text-main`
- Service: Instrument Sans 400, 13px, `--text-muted`
- Amount: IBM Plex Mono 600, `--text-secondary`
- Time: IBM Plex Mono, 12px, `--text-muted`

### Navigation (Sidebar)

- Width: 224px
- Nav item: 14px Instrument Sans 500, `--text-muted`, `border-left: 2px solid transparent`
- Active: `--text-main`, `--primary-muted` bg, `border-left-color: --primary-light`
- Section labels: IBM Plex Mono 600, 11px, uppercase, `--text-muted`

---

## QR Check-in Screen

Split layout (2 equal columns):
- Left: scan side — `--bg-surface`, QR placeholder centered
- Right: result side — faint semantic tint bg, centered status

Status label: Cabinet Grotesk Black, 36px, semantic color (`--success`, `--danger`, `--warning`).
Supporting text: IBM Plex Mono, 12px.

---

## Dark / Light Mode Switch

Controlled by `data-theme="light"` on `<html>`. All tokens swap via CSS custom properties. No JavaScript class juggling required for the theme itself. The toggle component uses IBM Plex Mono, 12px, `--text-muted`.

---

## Design Principles

1. **Dark first.** Design in dark mode. Light mode is a variant, not the primary.
2. **Mono for data.** Any value that is a number, ID, code, or timestamp gets IBM Plex Mono.
3. **4 text levels, always.** Never use fewer than 4 named levels. Never make up a fifth inline — use the nearest matching token.
4. **11px minimum.** No text below 11px in production. Dashboard metadata lives at 11–12px, never lower.
5. **Eucalyptus green is power, not decoration.** Use `--primary` for active borders, CTAs, and indicators. Do not use it as a background color on large surfaces.
6. **Borders are structure.** Use `--border` (visible) by default. Use transparent borders only for hover states and ghost variants.
7. **No wellness rounding.** Resist the urge to make `border-radius` larger. `--r-md` (8px) is the default card radius. Softness is for the spa, not the software.

---

## Implementation Notes

- All tokens live in `src/app/globals.css` under `:root` (dark) and `[data-theme="light"]`
- `var(--font-display)` is currently mapped to Poppins in globals.css — new components should import Cabinet Grotesk from Google Fonts until globals.css is updated
- Google Fonts import string: `family=Cabinet+Grotesk:wght@400;500;700;900&family=Instrument+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=IBM+Plex+Mono:wght@400;500;600`
- Rwanda-specific: format all currency with `formatRWF()` from `src/lib/utils.ts`; format all dates with `formatDate()` (timezone: `Africa/Kigali`)
