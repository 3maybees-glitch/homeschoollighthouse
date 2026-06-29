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

## Firecrawl (Cursor agent skill)

This project includes the official Firecrawl skill for web scraping, research, and bulk listing imports.

**Setup:**

1. Get a free API key at [firecrawl.dev](https://www.firecrawl.dev/app/api-keys)
2. In Cursor: **Settings → Tools & MCP** — enable `firecrawl-mcp` and set `FIRECRAWL_API_KEY`
3. Or install the CLI: `npx -y firecrawl-cli@latest init --all --browser`

Skill files: `.cursor/skills/firecrawl/SKILL.md` · MCP config: `.cursor/mcp.json`
