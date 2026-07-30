-- The Navigator: standalone academic matching product (separate from Full Beam)

alter table public.profiles
  add column if not exists navigator_purchased_at timestamptz,
  add column if not exists navigator_stripe_payment_id text;

create table if not exists public.navigator_charts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  answers jsonb not null default '{}'::jsonb,
  subject_plans jsonb not null default '[]'::jsonb,
  completion_percent int not null default 0,
  encouragement text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists navigator_charts_user_id_idx
  on public.navigator_charts (user_id, updated_at desc);

alter table public.navigator_charts enable row level security;

create policy "Users can read own navigator charts"
  on public.navigator_charts for select
  using (auth.uid() = user_id);

create policy "Users can insert own navigator charts"
  on public.navigator_charts for insert
  with check (auth.uid() = user_id);

create policy "Users can update own navigator charts"
  on public.navigator_charts for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own navigator charts"
  on public.navigator_charts for delete
  using (auth.uid() = user_id);
