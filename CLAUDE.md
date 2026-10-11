# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development & Build
- `pnpm dev`: Start Next.js development server on `http://localhost:3000`.
- `pnpm build`: Build production bundle (Next.js 16).
- `pnpm start`: Start production server after build.
- `pnpm lint`: Run ESLint checks across the codebase.

### Database & Prisma
- `pnpm prisma generate` (or `npx prisma generate`): Generate Prisma client. Generated files output to `src/generated/prisma`.
- `pnpm prisma db push`: Push schema state directly to PostgreSQL without generating migrations.
- `pnpm prisma migrate dev`: Create and apply a migration from `prisma/schema.prisma`.

### Docker
- `docker-compose up -d`: Run local containerized services in background mode.
- `docker-compose down`: Stop and tear down containerized services.

---

## High-Level Architecture & Key Patterns

### Tech Stack
- Framework: Next.js 16 (App Router), React 18, TypeScript 5
- Styling: TailwindCSS v4, tw-animate-css, shadcn/ui components (Radix UI primitives)
- Database: PostgreSQL with Prisma ORM 7.2
- State & Data Fetching: TanStack React Query v5, Next.js Server Actions
- Charts: Recharts v3
- Authentication: NextAuth.js v4 with Google OAuth, GitHub OAuth, and Credentials

### Custom Prisma Client Output
- The Prisma generator is configured with output: `../src/generated/prisma`.
- When referencing Prisma models in application code, import from `../../src/generated/prisma/client` (or the appropriate relative path to `src/generated/prisma`), not `@prisma/client`.

### Pre-Aggregated History Pattern
- Rather than running heavy `SUM` or `GROUP BY` SQL queries across transactions on each dashboard render, the database maintains pre-aggregated balance tables:
  - `MonthHistory`: Aggregated income and expenses by `userId`, `day`, `month`, and `year`.
  - `YearHistory`: Aggregated income and expenses by `userId`, `month`, and `year`.
- When creating or importing transactions, use a Prisma transaction (`prisma.$transaction`) to create the record and atomically increment `MonthHistory` and `YearHistory`.
- When deleting a transaction, decrement the corresponding day/month/year records.

### Timezone Normalization
- All daily and monthly aggregation points use `Asia/Jakarta` (WIB) as the reference timezone.
- Use `date-fns-tz` to normalize dates: `fromZonedTime(startOfDay(transactionDate), "Asia/Jakarta")` before extracting UTC day, month, and year values for historical records.

### Authentication & Wizard Flow
- NextAuth configuration resides in `src/lib/auth.ts` and `src/app/api/auth/[...nextauth]/route.ts`.
- Dashboard layouts and protected routes verify both session authentication and the existence of a `CurrencySettings` record for the user.
- If a user has no currency configured, redirect to `/wizard` to complete onboarding before permitting dashboard access.

### Dual Data-Handling Layer
- `src/actions/`: Server Actions for mutations (transactions, categories, currency settings, CSV bulk imports, budgets, goals, recurring).
- `src/app/api/`: Route Handlers providing REST endpoints for queries consumed by TanStack React Query (`/api/categories`, `/api/statistics/balance`, `/api/history-data`, etc.).

### AI Integration
- Google Generative AI (`@google/generative-ai`) is configured in `src/lib/gemini.ts` using `gemini-2.5-flash-lite`.
- The assistant endpoint is served at `src/app/api/ai-assistant/route.ts` and provides structured financial explanations.

---

## Branching Strategy
- `main`: Production branch.
- `develop`: Staging and active development branch.
- `feature/*`: New feature branches.
- `refactor/*`: Improvements to existing functionality.
- Pull requests should target `develop`, not `main`.
