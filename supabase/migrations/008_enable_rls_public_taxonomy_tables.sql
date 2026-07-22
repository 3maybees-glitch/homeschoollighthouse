-- Fix Supabase security advisor: rls_disabled_in_public
-- Taxonomy + listing junction tables were created without RLS, so anyone
-- with the project URL + anon key could read/edit/delete their rows.

-- Reference taxonomies (public read; writes stay service-role only)
alter table public.philosophies enable row level security;
alter table public.values_tags enable row level security;
alter table public.religions enable row level security;
alter table public.subjects enable row level security;

-- Listing junction tables (public read; writes stay service-role only)
alter table public.listing_philosophies enable row level security;
alter table public.listing_values enable row level security;
alter table public.listing_religions enable row level security;
alter table public.listing_subjects enable row level security;

-- Idempotent public SELECT policies for catalog reference data
drop policy if exists "Anyone can read philosophies" on public.philosophies;
create policy "Anyone can read philosophies"
  on public.philosophies for select
  using (true);

drop policy if exists "Anyone can read values tags" on public.values_tags;
create policy "Anyone can read values tags"
  on public.values_tags for select
  using (true);

drop policy if exists "Anyone can read religions" on public.religions;
create policy "Anyone can read religions"
  on public.religions for select
  using (true);

drop policy if exists "Anyone can read subjects" on public.subjects;
create policy "Anyone can read subjects"
  on public.subjects for select
  using (true);

drop policy if exists "Anyone can read listing philosophies" on public.listing_philosophies;
create policy "Anyone can read listing philosophies"
  on public.listing_philosophies for select
  using (true);

drop policy if exists "Anyone can read listing values" on public.listing_values;
create policy "Anyone can read listing values"
  on public.listing_values for select
  using (true);

drop policy if exists "Anyone can read listing religions" on public.listing_religions;
create policy "Anyone can read listing religions"
  on public.listing_religions for select
  using (true);

drop policy if exists "Anyone can read listing subjects" on public.listing_subjects;
create policy "Anyone can read listing subjects"
  on public.listing_subjects for select
  using (true);
