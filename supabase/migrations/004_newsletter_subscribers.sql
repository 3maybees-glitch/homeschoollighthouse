-- Newsletter subscribers

create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  created_at timestamptz not null default now()
);

create index if not exists newsletter_subscribers_email_idx on public.newsletter_subscribers (email);
