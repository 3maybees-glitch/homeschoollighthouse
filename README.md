# Homeschool Lighthouse

Shining the light and guiding families to trusted homeschool resources through our AI homeschool resource online directory.

## Stack

- Next.js 15 + TypeScript + Tailwind CSS
- Supabase (Postgres + Auth)
- Stripe ($7.77/year or $14.99 lifetime premium)
- Vercel deployment

## Getting Started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

See `.env.example` for required configuration.

## Stripe paywall setup

Premium checkout is already wired (`/api/checkout`, `/api/webhooks/stripe`, `/pricing`). You only need Stripe + Supabase env vars in Vercel.

### 1. Create Stripe products and prices

In the [Stripe Dashboard](https://dashboard.stripe.com/) (start in **Test mode**):

1. **Product** → Add product: `Homeschool Lighthouse Premium`
2. Add **Annual Pass** price: **$7.77 USD**, recurring **yearly**
3. Add **Lifetime Beacon** price: **$14.99 USD**, one-time

Or run the helper script (prints env vars):

```bash
STRIPE_SECRET_KEY=sk_test_... node scripts/stripe-setup.mjs
```

### 2. Configure environment variables

Set these in `.env.local` for local dev and in **Vercel → Project → Settings → Environment Variables** for production:

| Variable | Where to get it |
|----------|-----------------|
| `STRIPE_SECRET_KEY` | Stripe → Developers → API keys |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Same page (`pk_test_...` or `pk_live_...`) |
| `STRIPE_PREMIUM_YEARLY_PRICE_ID` | Price ID for $7.77/year (`price_...`) |
| `STRIPE_PREMIUM_LIFETIME_PRICE_ID` | Price ID for $14.99 one-time (`price_...`) |
| `STRIPE_WEBHOOK_SECRET` | Webhook signing secret (step 3) |
| `NEXT_PUBLIC_SITE_URL` | `https://homeschoollighthouse.com` (production) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API (webhook grants premium) |

### 3. Add the Stripe webhook

**Production** (Stripe Dashboard → Developers → Webhooks → Add endpoint):

- URL: `https://homeschoollighthouse.com/api/webhooks/stripe`
- Events:
  - `checkout.session.completed`
  - `invoice.payment_succeeded`
  - `customer.subscription.deleted`

Copy the **Signing secret** into `STRIPE_WEBHOOK_SECRET`.

**Local testing** with [Stripe CLI](https://stripe.com/docs/stripe-cli):

```bash
stripe login
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Use the `whsec_...` value from `stripe listen` as `STRIPE_WEBHOOK_SECRET` in `.env.local`.

### 4. Test the flow

1. Sign up / sign in at `/signup` or `/login`
2. Open `/pricing` and click **Choose Annual Pass** or **Choose Lifetime Beacon**
3. Complete checkout with test card `4242 4242 4242 4242`
4. Confirm redirect to `/account` shows **premium** tier
5. Open a gated page (e.g. `/credit-logbook`) — full tool should load

Manual grant (without Stripe): `node scripts/grant-premium.mjs your@email.com`

### 5. Go live

1. Toggle Stripe to **Live mode**
2. Recreate or copy live prices; update Vercel env vars with `sk_live_...`, `pk_live_...`, and live `price_...` IDs
3. Add a **live** webhook endpoint with the same events
4. Redeploy Vercel after env changes

## Firecrawl (Cursor agent skill)

This project includes the official Firecrawl skill for web scraping, research, and bulk listing imports.

**Setup:**

1. Get a free API key at [firecrawl.dev](https://www.firecrawl.dev/app/api-keys)
2. In Cursor: **Settings → Tools & MCP** — enable `firecrawl-mcp` and set `FIRECRAWL_API_KEY`
3. Or install the CLI: `npx -y firecrawl-cli@latest init --all --browser`

Skill files: `.cursor/skills/firecrawl/SKILL.md` · MCP config: `.cursor/mcp.json`
