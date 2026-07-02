-- Harbor Huddle: monthly pinned mega-threads for premium members

create table if not exists public.harbor_huddles (
  id uuid primary key default gen_random_uuid(),
  month_key text not null unique,
  title text not null,
  prompt text not null,
  author_name text not null default 'Lighthouse Crew',
  is_pinned boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.huddle_replies (
  id uuid primary key default gen_random_uuid(),
  huddle_id uuid not null references public.harbor_huddles (id) on delete cascade,
  user_id text,
  author_name text not null,
  body text not null check (char_length(body) <= 4000),
  created_at timestamptz not null default now()
);

create index if not exists huddle_replies_huddle_id_idx on public.huddle_replies (huddle_id);
create index if not exists huddle_replies_created_at_idx on public.huddle_replies (created_at);

alter table public.harbor_huddles enable row level security;
alter table public.huddle_replies enable row level security;

create policy "Anyone can read harbor huddles"
  on public.harbor_huddles for select using (true);

create policy "Anyone can read huddle replies"
  on public.huddle_replies for select using (true);
