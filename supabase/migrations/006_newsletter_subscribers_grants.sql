-- Ensure newsletter subscribers is writable via the service role API

grant all on table public.newsletter_subscribers to service_role;
grant all on table public.newsletter_subscribers to postgres;
