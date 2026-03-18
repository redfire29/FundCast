create extension if not exists pgcrypto;

create table if not exists campaigns (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid references auth.users(id) on delete set null,
  slug text not null unique,
  overlay_token text not null unique,
  name text not null,
  headline text not null,
  description text not null,
  currency text not null default 'TWD',
  goal_amount integer not null check (goal_amount >= 0),
  status text not null default 'draft' check (status in ('draft', 'active', 'paused', 'completed')),
  embed_enabled boolean not null default true,
  overlay_enabled boolean not null default true,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists donation_events (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references campaigns(id) on delete cascade,
  source text not null check (source in ('youtube', 'ecpay', 'manual')),
  external_id text not null,
  donor_name text,
  original_amount numeric(12, 2) not null,
  original_currency text not null default 'TWD',
  amount_twd integer not null,
  status text not null default 'confirmed' check (status in ('pending', 'confirmed', 'refunded', 'failed')),
  donated_at timestamptz not null default now(),
  raw_payload jsonb,
  created_at timestamptz not null default now(),
  unique (source, external_id)
);

create table if not exists integrations (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references campaigns(id) on delete cascade,
  provider text not null check (provider in ('youtube', 'ecpay')),
  status text not null default 'disconnected' check (status in ('disconnected', 'connected', 'error')),
  config_json jsonb not null default '{}'::jsonb,
  last_synced_at timestamptz,
  last_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (campaign_id, provider)
);

insert into campaigns (
  slug,
  overlay_token,
  name,
  headline,
  description,
  goal_amount,
  status
)
values (
  'shelter-paws-2026',
  'ovl_demo_shelter',
  '浪浪春季醫療基金',
  '把 YouTube 與綠界抖內，合併成一條能直接上直播的募資進度條。',
  '這是一筆示範 campaign，你可以刪掉後換成正式資料。',
  200000,
  'active'
)
on conflict (slug) do nothing;

alter table campaigns add column if not exists owner_user_id uuid references auth.users(id) on delete set null;
