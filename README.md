# GCC Monitor

Personal intelligence dashboard for GCC consulting. Aggregates macro-economic data, curated news, deal flow, and regulatory signals across UAE, KSA, Qatar, Kuwait, Bahrain, Oman, and Egypt.

## Quick start

```bash
# Clone and install
git clone <your-repo-url>
cd gcc-monitor
npm install

# Set up environment variables
cp .env.example .env.local
# Fill in your keys (see below)

# Push database schema
npm run db:push

# Start development server
npm run dev
```

Open [localhost:3000](http://localhost:3000).

## Required services

1. **Vercel Postgres** — create via Vercel dashboard → Storage → Create Database
2. **Vercel KV** — create via Vercel dashboard → Storage → Create KV Store
3. **Anthropic API key** — get from [console.anthropic.com](https://console.anthropic.com)

## Project structure

See `CLAUDE.md` for the full project structure and conventions.

## Deployment

Push to GitHub and connect to Vercel. Cron jobs are configured in `vercel.json`.

## Docs

- `docs/PRD.md` — Product requirements
- `docs/architecture.md` — Technical architecture
- `docs/data-sources.md` — RSS feeds, APIs, market data symbols
- `docs/ui-design.md` — Design system and component patterns
