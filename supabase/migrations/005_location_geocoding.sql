-- Location and geocoding fields for submissions and listings

alter table public.submissions
  add column if not exists format text,
  add column if not exists city text,
  add column if not exists state text,
  add column if not exists country text default 'US',
  add column if not exists latitude numeric,
  add column if not exists longitude numeric,
  add column if not exists geocode_precision text;

alter table public.listings
  add column if not exists latitude numeric,
  add column if not exists longitude numeric,
  add column if not exists geocode_precision text;

create index if not exists listings_lat_lng_idx on public.listings (latitude, longitude)
  where latitude is not null and longitude is not null;
