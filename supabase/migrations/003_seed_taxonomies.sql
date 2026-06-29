-- Seed taxonomy tables and auth profile bootstrap

insert into public.philosophies (slug, label) values
  ('classical', 'Classical'),
  ('charlotte_mason', 'Charlotte Mason'),
  ('unschooling', 'Unschooling'),
  ('eclectic', 'Eclectic'),
  ('montessori', 'Montessori'),
  ('waldorf', 'Waldorf'),
  ('unit_studies', 'Unit Studies'),
  ('project_based', 'Project Based'),
  ('secular', 'Secular'),
  ('religious', 'Religious')
on conflict (slug) do nothing;

insert into public.values_tags (slug, label) values
  ('screen_free', 'Screen-Free'),
  ('tech_friendly', 'Tech-Friendly'),
  ('parent_led', 'Parent-Led'),
  ('self_paced', 'Self-Paced'),
  ('neurodivergent_friendly', 'Neurodivergent-Friendly'),
  ('special_needs', 'Special Needs'),
  ('gifted', 'Gifted')
on conflict (slug) do nothing;

insert into public.religions (slug, label) values
  ('secular', 'Secular'),
  ('christian', 'Christian'),
  ('catholic', 'Catholic'),
  ('jewish', 'Jewish'),
  ('muslim', 'Muslim')
on conflict (slug) do nothing;

insert into public.subjects (slug, label) values
  ('math', 'Math'),
  ('science', 'Science'),
  ('history', 'History'),
  ('language_arts', 'Language Arts'),
  ('reading', 'Reading'),
  ('writing', 'Writing'),
  ('art', 'Art'),
  ('music', 'Music'),
  ('foreign_language', 'Foreign Language'),
  ('electives', 'Electives')
on conflict (slug) do nothing;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do update set email = excluded.email, updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);
