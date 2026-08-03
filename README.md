# FixItNow — Frontend

Next.js 16 (App Router) + TypeScript frontend for FixItNow, consuming the existing backend at `NEXT_PUBLIC_API_BASE_URL` (`http://localhost:5000/api` by default).

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Requires Node.js ≥ 20.9 (Next.js 16 requirement). Make sure your backend is running on the URL configured in `.env.local` before starting the dev server — this frontend has no mock data and every feature module talks to the real API.

## Stack

Next.js 16, TypeScript, Tailwind CSS v4, Shadcn UI, TanStack React Query, Axios, React Hook Form + Zod, Framer Motion, Lucide React, Sonner, date-fns, Recharts.

## Route protection

Role-based route protection lives in `src/proxy.ts` — Next.js 16 renamed `middleware.ts` to `proxy.ts` (same request-interception behavior, now on the Node.js runtime instead of Edge). Do not add a `middleware.ts` file; `proxy.ts` is the only convention this project uses.

## Module scope so far

- **Module 1** — scaffolding, TS/ESLint/Prettier config, Tailwind v4 tokens, root layout/providers, typed API client
- **Module 2** — JWT auth (login/register/logout), `proxy.ts` route protection, AuthGuard
- **Module 3** — public pages: home, services, technicians, search/filter/sort/pagination
- **Module 4** — customer dashboard: bookings, payments, reviews, editable profile/settings
- **Module 5** — technician dashboard: bookings, availability, services, reviews, earnings, profile
- **Module 6** — admin dashboard: statistics, user management (ban/unban), full category CRUD
- **Module 7** — payment flow: SSLCommerz redirect, payment success/cancel pages with status polling
- **Module 8** — final polish (in progress)

See `FixItNow-Implementation-Plan.md` and `API_INTEGRATION.md` for full details, confirmed endpoint mappings, and known backend gaps.
