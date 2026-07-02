-- Fair Winds Weekly: public homeschool blog dispatches

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text not null,
  body jsonb not null default '[]'::jsonb,
  tags text[] not null default '{}',
  week_key text not null unique,
  author_name text not null default 'Lighthouse Crew',
  published_at timestamptz not null default now(),
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists blog_posts_published_at_idx on public.blog_posts (published_at desc);
create index if not exists blog_posts_tags_idx on public.blog_posts using gin (tags);

alter table public.blog_posts enable row level security;

create policy "Anyone can read published blog posts"
  on public.blog_posts for select
  using (is_published = true);
