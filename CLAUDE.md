# GCC Monitor — Personal Intelligence Dashboard

A Next.js 15 app deployed on Vercel that gives a McKinsey consultant based in Dubai a daily intelligence edge across the GCC (UAE, KSA, Qatar, Kuwait, Bahrain, Oman, Egypt).

## Project purpose

This is a personal-use dashboard — not a SaaS product. Optimize for information density, fast load times, and glanceability. The user checks this every morning before client meetings and weekly for strategic signals.

## Tech stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4 + shadcn/ui components
- **Data fetching**: Server components + Vercel Cron Jobs for scheduled ingestion
- **Database**: Vercel Postgres (via Drizzle ORM) for article storage and caching
- **Cache**: Vercel KV (Redis) for API response caching
- **AI**: Anthropic Claude API (claude-sonnet-4-20250514) for news summarization
- **Deployment**: Vercel (automatic via GitHub push)
- **Charts**: Recharts for financial data visualization
- **RSS**: rss-parser for news feed ingestion

## Commands

- `npm run dev` — start local dev server
- `npm run build` — production build
- `npm run lint` — run ESLint
- `npm run typecheck` — run TypeScript compiler check
- `npm run db:push` — push Drizzle schema to database
- `npm run db:generate` — generate Drizzle migrations
- `npm run cron:news` — manually trigger news ingestion
- `npm run cron:markets` — manually trigger market data refresh

## Project structure

```
src/
├── app/
│   ├── layout.tsx                  # Root layout with nav
│   ├── page.tsx                    # Home / morning brief
│   ├── macro/
│   │   └── page.tsx                # Macro dashboard with country tabs
│   ├── news/
│   │   └── page.tsx                # News feed with sector tabs
│   ├── deals/
│   │   └── page.tsx                # Deal flow & M&A tracker
│   ├── regulatory/
│   │   └── page.tsx                # Regulatory radar
│   ├── vision/
│   │   └── page.tsx                # National vision tracker
│   └── api/
│       ├── cron/
│       │   ├── news/route.ts       # Scheduled news ingestion
│       │   └── markets/route.ts    # Scheduled market data refresh
│       └── ai/
│           └── summarize/route.ts  # AI summarization endpoint
├── components/
│   ├── layout/                     # Shell, nav, sidebar
│   ├── macro/                      # Market cards, charts, country tabs
│   ├── news/                       # Article cards, sector filters
│   ├── deals/                      # Deal cards, pipeline view
│   └── shared/                     # Reusable: tabs, cards, badges
├── lib/
│   ├── db/
│   │   ├── schema.ts               # Drizzle schema
│   │   └── index.ts                # DB client
│   ├── feeds/
│   │   ├── rss.ts                  # RSS parser utilities
│   │   ├── sources.ts              # Feed source registry
│   │   └── classifier.ts           # Article sector/country classifier
│   ├── market/
│   │   ├── yahoo.ts                # Yahoo Finance API wrapper
│   │   └── indices.ts              # GCC index definitions
│   ├── ai/
│   │   └── summarize.ts            # Claude summarization logic
│   └── utils.ts                    # Shared utilities
├── config/
│   ├── countries.ts                # GCC country definitions
│   ├── sectors.ts                  # Industry/sector definitions
│   └── sources.ts                  # News source configurations
└── types/
    └── index.ts                    # Shared TypeScript types
```

## Architecture decisions

- Read @docs/architecture.md before making structural changes.
- Server Components are the default. Only use `"use client"` for interactive elements (tabs, charts, filters).
- All external API calls go through server-side route handlers or server components — never call external APIs from the client.
- News articles are stored in Postgres after ingestion. The frontend reads from the DB, not from RSS directly.
- Market data is cached in Vercel KV with a 15-minute TTL during market hours, 6-hour TTL outside.
- AI summarization happens at ingestion time, not at render time.

## Coding conventions

- Use named exports, not default exports (except for Next.js pages).
- Prefer `async/await` over `.then()` chains.
- Use Zod for all external data validation (API responses, RSS feeds).
- All API route handlers must have try/catch with proper error responses.
- Use `cn()` utility (from shadcn) for conditional class merging.
- Date/time handling: use `date-fns` with explicit timezone handling (Gulf Standard Time = UTC+4 for UAE, UTC+3 for KSA).
- Environment variables: prefix with `NEXT_PUBLIC_` only if needed client-side. All API keys stay server-side only.

## Design direction

- Read @docs/ui-design.md for the full design spec.
- Dark mode by default (professional, easy on eyes for morning reading).
- Dense but scannable — inspired by Bloomberg Terminal meets modern editorial.
- Use tabbed interfaces for country and sector switching — no page reloads.
- Color-code by country: UAE blue, KSA green, Qatar maroon, Kuwait blue-green, Bahrain red, Oman red-white, Egypt gold.
- Financial data uses green/red for positive/negative changes.

## Data sources

- Read @docs/data-sources.md for the full list of RSS feeds, APIs, and data sources.
- IMPORTANT: Respect rate limits. Cache aggressively. Never call Yahoo Finance more than once per 15 minutes per symbol.
- RSS feeds should be polled every 30 minutes via Vercel Cron.

## Key gotchas

- Yahoo Finance has no official API — use the `yahoo-finance2` npm package which scrapes their endpoints. It may break. Always wrap in try/catch with fallback to cached data.
- Some RSS feeds (e.g., AGBI) may not have full-text in the feed — store the summary from the feed and link to the original article.
- GCC stock markets have different trading hours and days (Sun-Thu for most, different hours). See @docs/data-sources.md for details.
- Vercel Cron jobs have a 10-second timeout on the Hobby plan. For news ingestion, batch process feeds and use edge runtime if needed.

## Progressive disclosure for Claude

Before starting work on specific areas, read the relevant doc:
- New data source or feed: @docs/data-sources.md
- UI/UX changes: @docs/ui-design.md
- Architecture questions: @docs/architecture.md
- Product decisions: @docs/PRD.md
