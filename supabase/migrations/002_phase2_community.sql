-- Phase 2: reviews, favorites, saved searches, submissions

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  listing_id text not null,
  listing_slug text not null,
  user_id text,
  author_name text not null,
  rating int not null check (rating between 1 and 5),
  title text not null,
  body text not null,
  helpful_count int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  website_url text not null,
  listing_type text not null,
  description text not null,
  submitter_email text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now()
);

create table if not exists public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  listing_id text not null,
  listing_slug text not null,
  created_at timestamptz not null default now(),
  unique (user_id, listing_slug)
);

create table if not exists public.saved_searches (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  name text not null,
  query_string text not null,
  created_at timestamptz not null default now()
);

create index if not exists reviews_listing_slug_idx on public.reviews (listing_slug);
create index if not exists submissions_status_idx on public.submissions (status);
create index if not exists favorites_user_idx on public.favorites (user_id);

alter table public.reviews enable row level security;
alter table public.submissions enable row level security;
alter table public.favorites enable row level security;
alter table public.saved_searches enable row level security;

create policy "Anyone can read reviews"
  on public.reviews for select using (true);

create policy "Anyone can create submissions"
  on public.submissions for insert with check (true);
