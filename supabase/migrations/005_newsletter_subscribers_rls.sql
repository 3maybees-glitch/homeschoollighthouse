-- Lock down newsletter subscribers (writes happen via service role only)

alter table public.newsletter_subscribers enable row level security;
