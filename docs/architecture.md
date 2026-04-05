# Architecture

## System overview

```
┌─────────────────────────────────────────────────┐
│                   Vercel Edge                    │
│  ┌──────────┐  ┌──────────┐  ┌───────────────┐  │
│  │ Next.js  │  │ Cron     │  │ API Routes    │  │
│  │ App      │  │ Jobs     │  │ (AI, data)    │  │
│  └────┬─────┘  └────┬─────┘  └───────┬───────┘  │
│       │              │                │          │
│  ┌────┴──────────────┴────────────────┴───────┐  │
│  │           Vercel Postgres (Neon)           │  │
│  │  articles, briefs, deals, macro data,     │  │
│  │  cache table (replaces Redis/KV)          │  │
│  └────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
         │                    │
    ┌────┴────┐          ┌────┴────┐
    │ RSS     │          │ Yahoo   │
    │ Feeds   │          │ Finance │
    │ (20+)   │          │         │
    └─────────┘          └─────────┘
         │
    ┌────┴────┐
    │ Claude  │
    │ API     │
    └─────────┘
```

## Data flow

### News pipeline (runs every 30 minutes)

1. **Fetch**: Vercel Cron triggers `/api/cron/news`
2. **Parse**: `rss-parser` fetches all feeds in parallel with a 10-second timeout per feed
3. **Dedup**: Check article URL against Postgres — skip if exists
4. **Classify**: Run keyword-based classifier (fast, no API cost)
   - If confidence < 0.7, queue for Claude classification (batched)
5. **Summarize**: Batch new articles (up to 10) into a single Claude API call
6. **Store**: Insert into `articles` table with all metadata
7. **Score**: Calculate signal_score based on sector relevance, source tier, keyword density

### Market data pipeline (runs every 15 minutes Sun-Thu)

1. **Fetch**: Vercel Cron triggers `/api/cron/markets`
2. **Check cache**: Read from Postgres `cache` table — if not expired, skip
3. **Batch quote**: Call Yahoo Finance for all symbols in one batch
4. **Store**: Upsert into Postgres `cache` table with appropriate `expires_at`
5. **Archive**: Write daily close to Postgres `market_daily` at 15:30 GST (for historical charts)

### Morning brief generation (runs daily at 6:00 AM GST)

1. **Gather**: Query top 20 articles from last 24 hours by signal_score
2. **Generate**: Send to Claude API with morning brief prompt
3. **Store**: Save in `briefs` table with date key
4. **Fallback**: If generation fails, set `generated: false` flag; frontend will assemble from top articles

## Database schema (Drizzle)

### Tables

**articles**
```
id              uuid        PK, default gen_random_uuid()
url             text        UNIQUE, NOT NULL
title           text        NOT NULL
description     text        raw RSS description
summary         text        AI-generated summary (nullable until processed)
source          text        e.g., "agbi", "arabian_business"
source_name     text        display name, e.g., "AGBI"
country         text        classified country code
sectors         text[]      array of sector codes
signal_score    integer     1-5 relevance score
deal_type       text        nullable — "ma", "ipo", "pe_vc", "swf" if it's a deal
published_at    timestamp   from RSS pubDate
created_at      timestamp   default now()
is_regulatory   boolean     default false
is_vision       boolean     default false — tagged for vision tracker
```

Indexes: `(country, created_at)`, `(sectors, created_at)`, `(signal_score DESC, created_at DESC)`, `(deal_type, created_at)` where deal_type is not null

**briefs**
```
id              uuid        PK
date            date        UNIQUE
content         text        AI-generated markdown
generated       boolean     default true
article_ids     uuid[]      references used
created_at      timestamp
```

**market_daily**
```
id              serial      PK
symbol          text        NOT NULL
date            date        NOT NULL
open            numeric
high            numeric
low             numeric
close           numeric     NOT NULL
volume          bigint
change_pct      numeric
UNIQUE(symbol, date)
```

**macro_stats**
```
id              serial      PK
country         text        NOT NULL
metric          text        e.g., "gdp_growth", "cpi", "pmi"
value           numeric
period          text        e.g., "2025-Q4", "2026-01"
source          text        e.g., "IMF", "Saudi GASTAT"
updated_at      timestamp
UNIQUE(country, metric, period)
```

**cache**
```
key             text        PK
value           jsonb       NOT NULL
expires_at      timestamp   NOT NULL
created_at      timestamp   default now()
```

**megaprojects**
```
id              serial      PK
name            text        NOT NULL
country         text        NOT NULL
value_usd_bn    numeric     estimated cost in billions
status          text        "announced" | "under_construction" | "completed"
vision          text        e.g., "vision_2030"
completion_year integer     expected
description     text
last_news_url   text
updated_at      timestamp
```

## Caching strategy

All caching uses the Postgres `cache` table with `key`, `value` (JSONB), and `expires_at` columns.

| Data type | Cache key pattern | TTL | Fallback |
|-----------|------------------|-----|----------|
| Market quotes (trading hours) | `market:{symbol}` | 15 min | Last cached value + "delayed" badge |
| Market quotes (off hours) | `market:{symbol}` | 6 hours | `market_daily` table |
| FX rates | `fx:{pair}` | 1 hour | Last cached value |
| Commodity prices | `commodity:{symbol}` | 30 min | Last cached value |
| Article list (page) | ISR | 15 min | Stale page |
| Morning brief | ISR | 60 min | Top articles fallback |
| Macro stats | Postgres `macro_stats` | N/A (manual update) | Previous period value |

## Error handling

Every external call follows this pattern:

```typescript
async function fetchWithFallback<T>(
  key: string,
  fetcher: () => Promise<T>,
  fallback: () => Promise<T | null>,
  ttlSeconds: number
): Promise<{ data: T | null; stale: boolean }> {
  try {
    // Check Postgres cache table
    const cached = await db
      .select()
      .from(cache)
      .where(eq(cache.key, key))
      .limit(1);
    if (cached[0] && new Date(cached[0].expiresAt) > new Date()) {
      return { data: cached[0].value as T, stale: false };
    }

    const fresh = await fetcher();
    const expiresAt = new Date(Date.now() + ttlSeconds * 1000);
    await db
      .insert(cache)
      .values({ key, value: fresh as any, expiresAt })
      .onConflictDoUpdate({
        target: cache.key,
        set: { value: fresh as any, expiresAt },
      });
    return { data: fresh, stale: false };
  } catch (error) {
    console.error(`Failed to fetch ${key}:`, error);
    const fallbackData = await fallback();
    return { data: fallbackData, stale: true };
  }
}
```

## Environment variables

```env
# Database
POSTGRES_URL=                    # Vercel Postgres connection string

# AI
ANTHROPIC_API_KEY=               # Claude API key

# Cron security
CRON_SECRET=                     # Shared secret for cron endpoints

# Optional
NEXT_PUBLIC_SITE_URL=            # For OG images, canonical URLs
```
