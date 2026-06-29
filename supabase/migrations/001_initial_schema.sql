-- Homeschool Lighthouse initial schema

create extension if not exists pg_trgm;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  subscription_tier text not null default 'free' check (subscription_tier in ('free', 'premium')),
  stripe_customer_id text,
  stripe_subscription_id text,
  subscription_expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text not null,
  short_description text not null,
  listing_type text not null,
  format text not null,
  price_type text not null,
  price_min numeric,
  price_max numeric,
  currency text default 'USD',
  website_url text not null,
  cover_image_url text,
  city text,
  state text,
  country text default 'US',
  is_virtual boolean not null default true,
  age_min int,
  age_max int,
  status text not null default 'published',
  is_featured boolean not null default false,
  featured_until timestamptz,
  submitted_by uuid references public.profiles(id),
  rating_avg numeric not null default 0,
  rating_count int not null default 0,
  search_vector tsvector,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.philosophies (
  id serial primary key,
  slug text unique not null,
  label text not null
);

create table if not exists public.values_tags (
  id serial primary key,
  slug text unique not null,
  label text not null
);

create table if not exists public.religions (
  id serial primary key,
  slug text unique not null,
  label text not null
);

create table if not exists public.subjects (
  id serial primary key,
  slug text unique not null,
  label text not null
);

create table if not exists public.listing_philosophies (
  listing_id uuid references public.listings(id) on delete cascade,
  philosophy_id int references public.philosophies(id) on delete cascade,
  primary key (listing_id, philosophy_id)
);

create table if not exists public.listing_values (
  listing_id uuid references public.listings(id) on delete cascade,
  value_id int references public.values_tags(id) on delete cascade,
  primary key (listing_id, value_id)
);

create table if not exists public.listing_religions (
  listing_id uuid references public.listings(id) on delete cascade,
  religion_id int references public.religions(id) on delete cascade,
  primary key (listing_id, religion_id)
);

create table if not exists public.listing_subjects (
  listing_id uuid references public.listings(id) on delete cascade,
  subject_id int references public.subjects(id) on delete cascade,
  primary key (listing_id, subject_id)
);

create index if not exists listings_search_idx on public.listings using gin (search_vector);
create index if not exists listings_type_idx on public.listings (listing_type);
create index if not exists listings_state_idx on public.listings (state);

alter table public.profiles enable row level security;
alter table public.listings enable row level security;

create policy "Public can read published listings"
  on public.listings for select
  using (status = 'published');

create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);
