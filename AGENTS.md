# Repository Guidelines

## Project Structure & Module Organization

Sauna SPA Engine is a Next.js 16 App Router application for sauna and spa business operations. UI routes live in `src/app`, with public pages in `(public)`, onboarding in `(onboarding)`, dashboard workflows in `(dashboard)`, auth pages, and API handlers under `src/app/api/**/route.ts`. Reusable UI lives in `src/components`, shared logic in `src/lib`, hooks in `src/hooks`, and typed domain shapes in `src/types`. Prisma schema, migrations, and seed data live in `prisma/`. Static files are in `public/`; design and implementation notes are in `DESIGN.md`, `implementation_plan.md`, and `html_UI_screens/`.

## Build, Test, and Development Commands

- `npm run dev` starts the local Next.js dev server.
- `npm run build` runs `prisma generate` and creates a production build.
- `npm run start` serves the production build.
- `npm run lint` runs the configured Next.js lint command.
- `npm run seed` runs the Prisma seed script through `npx prisma db seed`.

Use `npx prisma migrate dev` for local schema migrations and `npx prisma studio` when inspecting data.

## Coding Style & Naming Conventions

Use TypeScript with strict compiler settings and the `@/*` import alias for `src`. Keep React components in PascalCase, functions and variables in camelCase, and route folders in kebab-case or Next route-group syntax. Prefer server components unless client state, browser APIs, or event handlers require `"use client"`. Styling uses Tailwind CSS v4 plus design tokens in `src/app/globals.css`; avoid introducing a competing component or styling system.

## Testing Guidelines

There is no dedicated `npm test` script yet. Before handoff, run `npm run lint` and `npm run build`. When adding tests, prefer colocated `*.test.ts` or `*.test.tsx` files and add the exact test command to `package.json`.

## Commit & Pull Request Guidelines

Recent history uses Conventional Commit-style subjects such as `fix:`, `feat:`, `design:`, and `fix(copy):`. Keep commits focused and imperative, for example `fix(auth): enforce branch scope`. Pull requests should include a summary, verification commands, linked issue or finding IDs, and screenshots for visible UI changes.

## Security & Configuration Tips

Do not commit `.env`, credentials, logs, or generated debug output. Keep tenant and branch access checks close to Prisma queries. Auth uses NextAuth-related configuration and role-aware helpers; verify admin, owner, and employee flows when changing middleware, route handlers, or subscription gates.
