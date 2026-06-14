# obisa — web

Next.js 14 + TypeScript + Tailwind + Supabase.

## Setup

```bash
npm install
cp .env.example .env.local   # then fill in your Supabase URL + anon key
npm run dev
```

Open http://localhost:3000.

## Supabase

Run `supabase/migrations/0001_init.sql` in your Supabase project's SQL editor. It creates
the `profiles`, `resumes`, `applications`, `messages` tables, the `resumes` storage bucket,
and the RLS policies.

## Routes

- `/` — landing + market toggle
- `/onboarding/resume` — step 1
- `/onboarding/about` — step 2 (India/UK variant)
- `/onboarding/setup` — step 3
- `/app/dashboard` — match feed + tracker summary
- `/app/browse` — filterable job list + quick add
- `/app/tracker` — applications tracker
- `/app/inbox` — message inbox
- `/app/profile` — profile
- `/app/settings` — apply settings, password, billing, referrals, email, account

## Notes

- Designed pixel-close to `design/obisa/project/Obisa App.dc.html`.
- Market toggle is a global Zustand store — flipping it in the top bar rewrites
  the dashboard, browse, tracker, and salary display.
- Data is currently in-memory sample data (`src/lib/sample-data.ts`). Supabase
  wiring is scaffolded but not yet wired to the UI — schema + client + RLS
  policies are in place to layer on next.
