# Fundraising Overlay Starter

Nuxt 4 starter for a donation progress bar product that can later aggregate:

- YouTube donations
- ECPay donations
- OBS overlay pages
- website embeds
- public progress APIs

This version is intentionally optimized for a free-stack launch:

- Nuxt 4
- Vercel Hobby
- Supabase Free

## What is included

- public landing page with a campaign preview
- public API routes for campaign and overlay data
- login page at `/login`
- dashboard page at `/dashboard`
- overlay page at `/overlay/:token`
- Supabase-ready server data layer
- mock fallback data when Supabase env vars are not configured
- SQL starter schema in [`database/schema.sql`](./database/schema.sql)

## Local setup

Install dependencies:

```bash
npm install
```

Copy env values:

```bash
cp .env.example .env
```

Then start the dev server:

```bash
npm run dev
```

## Required environment variables

```bash
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
NUXT_PUBLIC_SUPABASE_URL=
NUXT_PUBLIC_SUPABASE_ANON_KEY=
NUXT_PUBLIC_APP_URL=http://localhost:3000
```

If `SUPABASE_URL` or `SUPABASE_SERVICE_ROLE_KEY` are missing, the app automatically uses built-in mock data so you can still demo the product.

## Supabase setup

1. Create a new Supabase project.
2. Open the SQL editor.
3. Run the SQL from [`database/schema.sql`](./database/schema.sql).
4. Add the generated project URL and service role key into your local `.env` and Vercel environment variables.
5. Add the browser auth values:
   - `NUXT_PUBLIC_SUPABASE_URL` = Supabase project URL
   - `NUXT_PUBLIC_SUPABASE_ANON_KEY` = Supabase publishable / anon key

## Supabase auth setup

1. Open `Authentication`.
2. Enable the `Email` provider.
3. Turn on email/password sign-in.
4. In `URL Configuration`, set:
   - `Site URL` = `https://fund-cast.vercel.app`
   - `Redirect URLs` should include `https://fund-cast.vercel.app/auth/callback`
5. Create your first user from the app at `/login`.

## Existing projects upgrade

If you already ran the first version of the schema before this dashboard update, rerun [`database/schema.sql`](./database/schema.sql) or at least execute:

```sql
alter table campaigns add column if not exists owner_user_id uuid references auth.users(id) on delete set null;
```

## Deploy to Vercel

1. Push this repository to GitHub.
2. Import the repo into Vercel.
3. Add these environment variables in Vercel:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NUXT_PUBLIC_SUPABASE_URL`
   - `NUXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NUXT_PUBLIC_APP_URL`
4. Redeploy.

After deployment, your overlay URL will look like:

```bash
https://your-project.vercel.app/overlay/ovl_demo_shelter
```

## Public routes

- `/` landing page with campaign preview
- `/login` sign in / sign up
- `/auth/callback` email confirmation callback
- `/dashboard` create and manage your own campaigns
- `/overlay/:token` overlay preview for OBS Browser Source
- `/api/public/campaigns` list campaigns
- `/api/public/campaigns/:slug` fetch one campaign
- `/api/public/overlay/:token` fetch one overlay payload

## Recommended next steps

1. Implement ECPay callback ingestion into `donation_events`.
2. Add YouTube OAuth connection and sync jobs.
3. Add campaign edit pages and integration settings.
4. Encrypt third-party credentials before storing them in `integrations`.
5. Add unique public embed pages for iframe use.

## Current manual test flow

1. Open `/login` and sign up with a new email.
2. Click the confirmation link in the email.
3. Confirm you land on `/auth/callback`, see a success state, and are redirected back to `/login` or `/dashboard`.
4. Sign in and open `/dashboard`.
5. Create a campaign.
6. Open the generated overlay and API links from the dashboard list.
