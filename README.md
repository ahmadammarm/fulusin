# Fulusin

Fulusin is a web-based personal finance tracker. It helps people record income and expenses, see where their money goes over any period, plan monthly budgets, save toward goals, and automate transactions that repeat on a schedule.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Database](#database)
- [Recurring Transactions and Cron](#recurring-transactions-and-cron)
- [Testing](#testing)
- [Deployment](#deployment)
- [Running with Docker](#running-with-docker)
- [Contributing](#contributing)

## Features

**Authentication and onboarding**
- Sign in with Google OAuth or with an email and password account.
- A first-run wizard asks for the user's preferred currency before the dashboard becomes available.

**Dashboard**
- Income, expense, and balance summary for any date range.
- Top income and expense categories for the selected range.
- Monthly and yearly history charts.
- AI insights for the selected range: a summary, highlights, warnings, and suggestions based on the period's totals, category spending, budgets, goals, and upcoming recurring transactions. Insights are generated on request and cached until the underlying data changes.

**Transactions**
- Record income and expenses with a category, description, and date.
- Searchable, filterable, and paginated transaction history.
- Export transactions to CSV.
- Bulk import from CSV with the headers `date, amount, description, type, category`. Categories must already exist.

**Preferences**
- Choose a default currency. Amounts are formatted with the matching locale and symbol across the app.
- Create and delete income and expense categories, each with an emoji icon. A category cannot be deleted while transactions, budgets, or recurring schedules still use it.

**Planning**
- **Budgets:** set a monthly spending limit per expense category and track spending against it. Cards turn amber at 80% of the limit and red when the limit is exceeded. Budgets can be edited, deleted, and copied from the previous month.
- **Goals:** create savings goals with a target amount and an optional deadline, then add or withdraw funds. Goal funds are tracked separately and do not change the account balance.
- **Recurring:** schedule income or expenses that repeat daily, weekly, monthly, or yearly. Each occurrence is recorded as a real transaction when it falls due, including any occurrences missed while the app was not used.

**Education**
- An AI assistant powered by Google Gemini that answers free-form personal finance questions with a definition, key ideas, practical strategies, and an example. Answers stream in as they are generated.

**AI usage limits**
- Each user can make 30 Education requests and 10 insight requests per day. Limits reset at midnight WIB.
- Only aggregated figures are sent to Gemini for insights. Transaction descriptions never leave the app.

## Tech Stack

| Area | Technology |
| --- | --- |
| Framework | Next.js 16 (App Router), React 18 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4, shadcn/ui (Radix UI primitives) |
| Database | PostgreSQL (Neon), Prisma ORM 7 with the Neon serverless adapter |
| Authentication | NextAuth.js v4 (Google OAuth and credentials) |
| Data fetching | TanStack React Query v5, Next.js Server Actions |
| Forms and validation | React Hook Form, Zod |
| Charts and motion | Recharts, Framer Motion, Three.js |
| AI | Google Gen AI SDK (`@google/genai`) with `gemini-3.8-flash` |
| Testing | Vitest |
| Hosting | Vercel (Docker is also supported) |

## Architecture

**Reads and writes are separated.**
- Mutations are Server Actions in `src/actions/`. Each action validates input with Zod, resolves the signed-in user from the session, and scopes every query to that user.
- Reads are Route Handlers in `src/app/api/` that are consumed by TanStack React Query on the client.

**Balances are pre-aggregated.**
Instead of summing all transactions on every dashboard render, the database keeps running totals:
- `MonthHistory` stores income and expense per user per day.
- `YearHistory` stores income and expense per user per month.

Creating, importing, or deleting a transaction updates these tables in the same database transaction. If they ever drift, `pnpm history:resync` rebuilds them from the transaction records.

**All dates use the Asia/Jakarta (WIB) calendar.**
Daily and monthly boundaries are computed in WIB with the helpers in `src/lib/dateHelper.ts`, so a transaction always lands on the same calendar day regardless of where the server runs.

**Concurrent writes are serialized per user.**
Writes that touch balances take a PostgreSQL advisory lock per user, which prevents double submissions and duplicate recurring transactions. Money values are rounded to two decimals with the helpers in `src/lib/financialMath.ts`.

**Routes are protected in two layers.**
`src/proxy.ts` redirects signed-out visitors away from `/dashboard`. The dashboard layout also redirects users without a currency setting to the `/wizard` onboarding page.

## Project Structure

```
fulusin/
├── prisma/
│   ├── schema.prisma          # Database models
│   └── migrations/            # SQL migrations
├── scripts/
│   └── resyncHistory.ts       # Rebuilds MonthHistory and YearHistory
├── src/
│   ├── actions/               # Server Actions (mutations)
│   ├── app/
│   │   ├── (auth)/            # Sign in and sign up pages
│   │   ├── (user)/dashboard/  # Dashboard, transactions, planning, education, manage
│   │   ├── api/               # Route Handlers (reads, auth, cron)
│   │   └── wizard/            # Currency onboarding
│   ├── components/
│   │   ├── home/              # Landing page sections
│   │   ├── planning/          # Budgets, goals, and recurring UI
│   │   ├── skeletons/         # Loading placeholders
│   │   └── ui/                # shadcn/ui primitives
│   ├── generated/prisma/      # Generated Prisma client (not committed)
│   ├── hooks/                 # Shared React hooks
│   ├── lib/                   # Auth, Prisma, date, money, and domain helpers
│   ├── providers/             # NextAuth and React Query providers
│   ├── schemas/               # Zod validation schemas
│   └── proxy.ts               # Route protection
├── tests/
│   └── unit/lib/              # Vitest unit tests, one folder per src/lib module
├── deployment/Dockerfile
├── docker-compose.yaml
└── vercel.json                # Vercel Cron schedule
```

## Getting Started

### Prerequisites

- Node.js 20 or newer
- pnpm
- A PostgreSQL database on [Neon](https://neon.tech)
- A Google OAuth client and a Gemini API key (see [Environment Variables](#environment-variables))

### Installation

1. Clone the repository and enter the project directory:

   ```sh
   git clone https://github.com/ahmadammarm/fulusin.git
   cd fulusin
   ```

2. Install dependencies. This also generates the Prisma client into `src/generated/prisma`:

   ```sh
   pnpm install
   ```

3. Create your environment file and fill in the values:

   ```sh
   cp .env.example .env
   ```

4. Apply the database migrations:

   ```sh
   pnpm prisma migrate deploy
   ```

5. Start the development server:

   ```sh
   pnpm dev
   ```

6. Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

All variables are documented in `.env.example`.

| Variable | Required | Description |
| --- | --- | --- |
| `DATABASE_URL` | Yes | PostgreSQL connection string. The Prisma client uses the Neon serverless adapter, so use a Neon connection string. |
| `NEXTAUTH_SECRET` | Yes | Secret used to encrypt session tokens. Changing it signs out every user. |
| `NEXTAUTH_URL` | Recommended | Public base URL of the app, for example `http://localhost:3000` locally. |
| `GOOGLE_CLIENT_ID` | Yes | Google OAuth client ID. |
| `GOOGLE_CLIENT_SECRET` | Yes | Google OAuth client secret. |
| `GEMINI_API_KEY` | For AI features | Google Gemini API key used by the Education assistant and AI insights. |
| `GEMINI_MODEL` | No | Gemini model used by every AI feature. Defaults to `gemini-3.8-flash`. |
| `CRON_SECRET` | For cron | Secret that authorizes `/api/cron/recurring`. Use a different value in every environment. |

Generate random secrets with:

```sh
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

For Google OAuth, add `<NEXTAUTH_URL>/api/auth/callback/google` as an authorized redirect URI in the Google Cloud Console.

## Available Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Start the development server on port 3000. |
| `pnpm build` | Apply migrations, type-check, lint, and build for production. |
| `pnpm start` | Start the production server after a build. |
| `pnpm lint` | Run ESLint. |
| `pnpm lint:strict` | Run ESLint and fail on more than 10 warnings. |
| `pnpm type-check` | Run the TypeScript compiler without emitting files. |
| `pnpm test` | Run Vitest in watch mode. |
| `pnpm test:run` | Run the test suite once. |
| `pnpm history:resync` | Rebuild `MonthHistory` and `YearHistory` from transactions. Pass `--userId=<id>` to limit it to one user. |

`pnpm build` runs `prisma migrate deploy` first, so it needs a reachable database.

## Database

The schema lives in `prisma/schema.prisma`. The generated client is written to `src/generated/prisma`, so application code imports Prisma types from `@/generated/prisma/client` rather than `@prisma/client`.

| Command | Use it to |
| --- | --- |
| `pnpm prisma migrate dev --name <name>` | Create and apply a new migration during development. |
| `pnpm prisma migrate deploy` | Apply pending migrations (CI, production, fresh setups). |
| `pnpm prisma generate` | Regenerate the client after changing the schema. |
| `pnpm prisma studio` | Browse the data in a local UI. |

## Recurring Transactions and Cron

Due recurring transactions are recorded in two ways:

1. **When a user opens the Recurring tab.** The app processes that user's due schedules immediately.
2. **On a daily schedule.** Vercel Cron calls `GET /api/cron/recurring` at 00:05 WIB (`5 17 * * *` UTC), as configured in `vercel.json`, and processes every user.

The cron endpoint only accepts requests with the header `Authorization: Bearer <CRON_SECRET>`. Vercel adds this header automatically when `CRON_SECRET` is set in the project's environment variables.

To trigger it manually, for example locally:

```sh
curl -H "Authorization: Bearer <CRON_SECRET>" http://localhost:3000/api/cron/recurring
```

This processes real data in the database that `DATABASE_URL` points to.

Each run records every missed occurrence, up to 366 per schedule. Next dates are calculated on the WIB calendar. Monthly schedules on days 29 to 31 fall on the last day of shorter months.

## Testing

Unit tests use Vitest and live in `tests/unit/`, mirroring the source path. Each module in `src/lib` gets its own folder:

```
tests/unit/lib/
├── aiInsight/aiInsight.test.ts     # src/lib/aiInsight.ts
├── aiQuota/aiQuota.test.ts         # src/lib/aiQuota.ts
├── dateHelper/dateHelper.test.ts   # src/lib/dateHelper.ts
├── gemini/gemini.test.ts           # src/lib/gemini.ts
├── planning/planning.test.ts       # src/lib/planning.ts
└── recurring/recurring.test.ts     # src/lib/recurring.ts
```

Name new test files `<module>.test.ts` and import the code under test through the `@/` alias, for example `import { getBudgetProgress } from "@/lib/planning"`.

```sh
pnpm test:run
```

The current suite covers budget and goal progress, recurring date scheduling, the WIB month and period helpers, the AI insight snapshot, AI quota counting, and Gemini output validation and error mapping. Modules that import Prisma are tested with `vi.mock("@/lib/prisma")`, so the suite never needs a database.

## Deployment

The app is deployed on Vercel.

1. Import the repository into Vercel.
2. Add every variable from [Environment Variables](#environment-variables) under Project Settings, Environment Variables. Set `NEXTAUTH_URL` to the production domain.
3. Deploy. The build applies pending migrations before compiling.
4. Check Project Settings, Cron Jobs to confirm the recurring job is registered. Cron jobs only run on production deployments, and on the Hobby plan they run at most once a day.

## Running with Docker

The repository includes a `Dockerfile` and a `docker-compose.yaml`. The app container reads `.env` and applies migrations before starting.

```sh
# Build and start in the background
docker-compose up -d

# Stop and remove the containers
docker-compose down
```

The compose file also starts a local PostgreSQL 15 container on port 5432. The Prisma client is configured with the Neon serverless adapter, so point `DATABASE_URL` at a Neon database unless you change the adapter in `src/lib/prisma.ts`.

## Contributing

Contributions are welcome through issues and pull requests.

### Branch strategy

| Branch | Purpose |
| --- | --- |
| `main` | Production |
| `develop` | Active development and staging |
| `feature/*` | New features |
| `refactor/*` | Improvements that keep existing behavior |

### Workflow

1. Check out `develop` and create a branch from it:

   ```sh
   git checkout develop
   git pull
   git checkout -b feature/your-feature-name
   ```

2. Make your changes, then make sure these pass:

   ```sh
   pnpm type-check
   pnpm lint:strict
   pnpm test:run
   ```

3. Commit with a clear message, for example `feat(planning): add budget copy action`.
4. Push the branch and open a pull request to `develop`.

Do not open pull requests directly against `main`.
