# Homeschool Lighthouse

AI homeschool resource directory. Next.js 15 (App Router, Turbopack) + TypeScript + Tailwind v4, with optional Supabase (Postgres + Auth), Stripe, Resend, and OpenAI integrations. PWA via `@serwist/next`, deployed on Vercel.

## Cursor Cloud specific instructions

### Services and how to run them

Single Next.js app. Standard commands live in `package.json` (`scripts`):

- Dev server: `npm run dev` — Next.js + Turbopack on http://localhost:3000. This is the supported way to run locally.
- Lint: `npm run lint` (currently emits one `no-img-element` warning, no errors).
- Build: `npm run build`.
- No automated test suite exists (CI in `.github/workflows` only runs `npm run build` plus the scheduled scrape/blog scripts).

### Runs with no credentials (graceful degradation)

Copy `.env.example` to `.env.local` and the app boots and serves every page with **no external credentials**. All external clients are created lazily and fall back when their env vars are unset:

- Supabase, Stripe, Resend, OpenAI, and Firecrawl are all OPTIONAL for local dev. Without them, auth-gated redirects are skipped, community data (reviews, submissions, favorites, newsletter subscribers, navigator charts, etc.) is stored in an in-process memory store (`src/lib/store/memory-store.ts`, lost on restart), the directory is served from local seed JSON in `src/data/*-imported.json`, `/api/checkout` returns 503, emails are not sent, and the AI recommender falls back to local keyword matching.
- Set `DEV_PREMIUM_TIER=true` and/or `DEV_NAVIGATOR_ACCESS=true` in `.env.local` to unlock premium / The Navigator locally without Stripe.

### Non-obvious gotchas

- The unfiltered `/browse` page (and large category pages such as `/browse/curriculum`) render **all** matching listings server-side with no pagination — the seed catalog is ~17,000 listings. In dev this render is pathologically slow and can appear to hang; because Turbopack uses a single render worker, one such request blocks all other requests until it finishes. When exercising the directory, use narrow/filtered queries instead (e.g. `/browse?types=coop`, `/browse/coop`, `/browse?featured=1`, or a search `?q=`). The homepage, individual `/listing/[slug]` detail pages, and all other routes render quickly.
- `npm run start` (production `next start`) currently fails with `TypeError: routesManifest.dataRoutes is not iterable` even after a successful `npm run build` (a `@serwist/next` + Next 15.5 interaction). Use `npm run dev` to run locally; production hosting is handled by Vercel.
- `data/` (repo root) holds raw scraped source data consumed only by the offline `scripts/scrape-*.py` + import scripts; the runtime catalog comes from `src/data/`.
