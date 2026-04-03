# Getting Started with Claude Code

This guide walks you through building GCC Monitor using Claude Code.

## Prerequisites

1. Install Claude Code: `npm install -g @anthropic-ai/claude-code`
2. Install Node.js 20+
3. Create a Vercel account at vercel.com
4. Get an Anthropic API key from console.anthropic.com

## Setup steps

### 1. Initialize the project

Open your terminal and navigate to this project folder:

```bash
cd gcc-monitor
claude
```

### 2. First prompt to Claude Code

Copy and paste this as your first prompt:

```
Read CLAUDE.md and all files in docs/ to understand the project. Then:

1. Initialize the Next.js 15 project with App Router, TypeScript, Tailwind CSS v4, and ESLint
2. Install all dependencies from package.json
3. Set up the project structure as defined in CLAUDE.md
4. Configure Tailwind with the dark mode color system from docs/ui-design.md
5. Set up Drizzle ORM with the schema from docs/architecture.md
6. Create the root layout with the navigation bar
7. Create placeholder pages for all routes: /, /macro, /news, /deals, /regulatory, /vision

Don't build the full features yet — just the skeleton with proper TypeScript types, the database schema, and a working nav. Make sure `npm run build` passes.
```

### 3. Vercel services setup

After the skeleton is working locally:

```bash
# Install Vercel CLI
npm i -g vercel

# Link project
vercel link

# Create Postgres database
vercel storage create postgres gcc-monitor-db

# Create KV store
vercel storage create kv gcc-monitor-cache

# Pull environment variables locally
vercel env pull .env.local
```

### 4. Build Phase 1 — News ingestion

Next prompt to Claude Code:

```
Now let's build the news ingestion pipeline. Read docs/data-sources.md and docs/architecture.md.

1. Create the RSS feed parser in src/lib/feeds/rss.ts using rss-parser
2. Create the source registry in src/config/sources.ts with all Tier 1 RSS feeds
3. Create the keyword-based classifier using the rules in .claude/skills/classification.md
4. Create the /api/cron/news route that fetches, dedupes, classifies, and stores articles
5. Create the News page (/news) with sector tabs and country filter
6. Create the ArticleCard component following docs/ui-design.md

Start with 3 RSS feeds (AGBI, Arabian Business, Gulf Business) and get the full pipeline working end-to-end before adding more.
```

### 5. Build Phase 1 — Macro dashboard

```
Now build the macro dashboard. Read docs/data-sources.md for symbols and docs/ui-design.md for components.

1. Create the Yahoo Finance wrapper in src/lib/market/yahoo.ts with caching via Vercel KV
2. Create the GCC index definitions in src/lib/market/indices.ts
3. Create the /api/cron/markets route for scheduled market data refresh
4. Build the Macro page (/macro) with:
   - "All GCC" tab showing the market indices table, oil strip, currency strip
   - Country-specific tabs with a stock chart (Recharts), key stats card, top movers
5. Create the MarketCard component with sparklines
6. Wire the home page market snapshot strip

Use the yahoo-finance2 package. Cache all data in Vercel KV.
```

### 6. Build Phase 2 — AI layer

```
Now add the AI intelligence layer. Read docs/data-sources.md for the prompt templates.

1. Create the Claude API client in src/lib/ai/summarize.ts using @anthropic-ai/sdk
2. Add article summarization to the news ingestion pipeline (batch 10 articles per API call)
3. Create the morning brief generator as /api/cron/brief
4. Build the Morning Brief component on the home page
5. Add the signals strip showing high-score articles from the last 48 hours
6. Update the home page to show the full morning brief + top stories layout
```

### 7. Continue through the phases

Refer to the Phase 3 and Phase 4 items in docs/PRD.md and tackle them one module at a time.

## Useful Claude Code tips for this project

- Use `/compact` after completing each major module to keep context fresh
- Use `Esc` to stop Claude if it's going in the wrong direction
- After each module, run `npm run build && npm run typecheck` to verify
- If a data source fails, tell Claude to add proper error handling with cached fallbacks
- For UI work, tell Claude to reference docs/ui-design.md explicitly

## Deploying

```bash
# Deploy to Vercel
vercel --prod

# Or push to GitHub and let Vercel auto-deploy
git add .
git commit -m "feat: initial GCC Monitor setup"
git push origin main
```
