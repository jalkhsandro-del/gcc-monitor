# Data Sources Reference

This document catalogs all data sources, RSS feeds, APIs, and their configurations for the GCC Monitor.

---

## 1. News RSS feeds

### Tier 1 — Daily essentials

| Source | RSS URL | Coverage | Frequency |
|--------|---------|----------|-----------|
| AGBI | `https://www.agbi.com/feed/` | GCC business analysis, SWF, energy, finance | ~10-15/day |
| Arabian Business | `https://www.arabianbusiness.com/rss` | Broad GCC business, rankings, leadership | ~20-30/day |
| Zawya | `https://www.zawya.com/sitemaps/en/rss` | Financial news, M&A, market data | ~30-50/day |
| Gulf Business | `https://gulfbusiness.com/feed/` | UAE-focused business, real estate, banking | ~15-20/day |
| Arab News | `https://www.arabnews.com/rss.xml` | Saudi-focused news, policy, economy | ~30-40/day |
| The National Business | `https://www.thenationalnews.com/rss/business.xml` | UAE quality reporting, analysis | ~15-20/day |

### Tier 2 — Sector-specific depth

| Source | RSS URL | Coverage | Frequency |
|--------|---------|----------|-----------|
| Argaam (English) | `https://www.argaam.com/en/rss/articles` | Saudi financial markets, stock analysis | ~10-15/day |
| TradeArabia | `https://www.tradearabia.com/rss/all.xml` | GCC trade, construction, tourism | ~20-30/day |
| Gulf News Business | `https://gulfnews.com/rss/business` | UAE daily business, banking, real estate | ~15-25/day |
| Reuters Middle East | `https://www.reuters.com/arc/outboundfeeds/v3/all/rss/?outputType=xml&_website=reuters` | International wire, filter for ME keywords | ~100+/day |
| Wamda | `https://www.wamda.com/rss` | MENA tech, startups, venture capital | ~3-5/day |
| Al-Monitor | `https://www.al-monitor.com/rss` | GCC geopolitics, policy, diplomacy | ~10-15/day |

### Tier 3 — Supplementary

| Source | RSS URL | Coverage | Notes |
|--------|---------|----------|-------|
| Construction Week | `https://www.constructionweekonline.com/rss` | GCC construction and infrastructure | Megaprojects |
| Hotelier Middle East | `https://www.hoteliermiddleeast.com/rss` | GCC hospitality and tourism | Vision tracker |
| Middle East Eye | `https://www.middleeasteye.net/rss` | Geopolitical analysis | Policy radar |
| Fintech News ME | `https://fintechnews.ae/feed/` | MENA fintech ecosystem | Tech sector |

### RSS ingestion notes
- Some feeds may return partial content (description only, not full article). Store what's available and link to the original.
- AGBI articles may be paywalled. Store the headline, description, and link — don't attempt to scrape full text.
- Zawya has both MENA and country-specific feeds. Start with the MENA feed and filter.
- Reuters is very high volume. Filter articles containing GCC country names, key company names, or sector keywords before storing.
- Test each feed URL before adding — some may require `Accept: application/rss+xml` header.
- Some feeds may use Atom format instead of RSS 2.0. The `rss-parser` npm package handles both.

---

## 2. Market data

### GCC stock exchange indices

| Country | Exchange | Index | Yahoo Finance Symbol | Trading Days | Trading Hours (local) |
|---------|----------|-------|---------------------|--------------|----------------------|
| UAE (Abu Dhabi) | ADX | FTSE ADX General | `FADGI.FGI` | Sun-Thu | 10:00-14:00 GST |
| UAE (Dubai) | DFM | DFM General Index | `DFMGI.AE` | Sun-Thu | 10:00-14:00 GST |
| Saudi Arabia | Tadawul | TASI | `^TASI.SR` | Sun-Thu | 10:00-15:00 AST |
| Qatar | QSE | QE General Index | `GNRI.QA` | Sun-Thu | 09:30-13:00 AST |
| Kuwait | Boursa Kuwait | Premier Market | `BKP.KW` | Sun-Thu | 09:00-12:40 AST |
| Bahrain | Bahrain Bourse | BAX | `BAX.BH` | Sun-Thu | 09:30-13:00 AST |
| Oman | MSM | MSM 30 | `MSI.OM` | Sun-Thu | 10:00-13:00 GST |
| Egypt | EGX | EGX 30 | `^EGX30.CA` | Sun-Thu | 10:00-14:30 EET |

### Oil & energy

| Instrument | Yahoo Finance Symbol | Notes |
|------------|---------------------|-------|
| Brent Crude | `BZ=F` | Primary GCC benchmark |
| WTI Crude | `CL=F` | US benchmark, reference |
| Natural Gas (Henry Hub) | `NG=F` | LNG exports (Qatar) |
| OPEC Basket | N/A — scrape from OPEC website | Manual or API |

### Commodities (CPG-relevant)

| Commodity | Yahoo Finance Symbol | Relevance |
|-----------|---------------------|-----------|
| Wheat | `ZW=F` | Food staple, import dependency |
| Sugar | `SB=F` | Beverages, confectionery |
| Palm Oil | `FCPO=F` (or via API) | Cooking oil, FMCG |
| Corn | `ZC=F` | Animal feed, food processing |
| Coffee (Arabica) | `KC=F` | F&B sector |
| Gold | `GC=F` | Safe haven, jewelry (UAE) |

### Currency pairs

| Pair | Yahoo Finance Symbol | Notes |
|------|---------------------|-------|
| USD/AED | `USDAED=X` | Pegged at 3.6725 — tiny moves matter |
| USD/SAR | `USDSAR=X` | Pegged at 3.75 |
| USD/QAR | `USDQAR=X` | Pegged at 3.64 |
| USD/KWD | `USDKWD=X` | Managed float, strongest currency |
| USD/BHD | `USDBHD=X` | Pegged at 0.376 |
| USD/OMR | `USDOMR=X` | Pegged at 0.385 |
| USD/EGP | `USDEGP=X` | Free float — volatile, watch closely |
| EUR/USD | `EURUSD=X` | Reference (European clients) |

### Market data implementation

Use the `yahoo-finance2` npm package:
```typescript
import yahooFinance from 'yahoo-finance2';

// Single quote
const quote = await yahooFinance.quote('^TASI.SR');

// Historical data for charts
const history = await yahooFinance.historical('^TASI.SR', {
  period1: '2024-01-01',
  interval: '1d',
});

// Multiple quotes (batch)
const quotes = await yahooFinance.quote(['^TASI.SR', 'DFMGI.AE', 'BZ=F']);
```

**Caching strategy:**
- During trading hours (Sun-Thu, 09:00-15:30 GST): cache for 15 minutes
- Outside trading hours: cache for 6 hours
- Weekend (Fri-Sat): cache for 12 hours
- Use Vercel KV with TTL: `await kv.set('market:TASI', data, { ex: 900 })`

**Fallback:**
- If Yahoo Finance fails, return cached data with a "delayed" badge
- Store last 30 days of daily closes in Postgres as permanent fallback

---

## 3. Macro-economic data

These are slower-moving datasets. Updated monthly or quarterly.

### Data points per country

| Metric | Source | Update frequency |
|--------|--------|-----------------|
| GDP growth (%) | IMF World Economic Outlook, Central banks | Quarterly |
| CPI / Inflation (%) | National statistics agencies | Monthly |
| PMI | S&P Global (formerly IHS Markit) | Monthly |
| Unemployment (%) | National statistics, ILO | Quarterly |
| Population | World Bank, national stats | Annual |
| Credit rating | S&P/Moody's/Fitch | Event-driven |
| Non-oil GDP (%) | Central banks, IMF | Quarterly |
| FDI inflows | UNCTAD, central banks | Annual |

### Approach for macro data
- **Phase 1**: Manually maintain a JSON file (`src/config/macro-data.json`) with the latest values. Update monthly.
- **Phase 2**: Scrape from central bank websites or IMF data API.
- **Phase 3**: Parse from news articles using AI extraction.

### IMF Data API
The IMF provides free JSON data:
```
https://www.imf.org/external/datamapper/api/v1/NGDP_RPCH/SAU/ARE/QAT/KWT/BHR/OMN/EGY
```
This returns GDP growth data for all 7 countries. Explore other indicators at `https://www.imf.org/external/datamapper/api/v1/`.

---

## 4. GCC stock exchange trading schedule

All GCC exchanges trade Sunday through Thursday and are closed Friday-Saturday.

| Exchange | Pre-market | Main session | Post-market |
|----------|-----------|-------------|-------------|
| Tadawul (KSA) | 09:30-10:00 | 10:00-15:00 | 15:00-15:10 |
| ADX (Abu Dhabi) | 09:30-10:00 | 10:00-14:00 | 14:00-14:15 |
| DFM (Dubai) | 09:30-10:00 | 10:00-14:00 | 14:00-14:15 |
| QSE (Qatar) | 09:00-09:30 | 09:30-13:00 | 13:00-13:15 |
| Boursa Kuwait | 08:30-09:00 | 09:00-12:40 | 12:40-13:00 |
| Bahrain Bourse | 09:15-09:30 | 09:30-13:00 | 13:00-13:15 |
| MSM (Oman) | 09:30-10:00 | 10:00-13:00 | 13:00-13:15 |
| EGX (Egypt) | 09:30-10:00 | 10:00-14:30 | 14:30-14:40 |

All times are local. Convert to UTC for cron scheduling:
- GST (UAE, Oman) = UTC+4
- AST (KSA, Qatar, Kuwait, Bahrain) = UTC+3
- EET (Egypt) = UTC+2 (UTC+3 during DST)

---

## 5. AI summarization

### Claude API configuration

Model: `claude-sonnet-4-20250514`
Max tokens: 300 per summary, 1500 for morning brief

### Prompts

**Article summary prompt:**
```
Summarize this news article in 2-3 sentences for a management consultant working in the GCC. Focus on: business impact, strategic implications, and relevance to CPG, family businesses, private capital, or tech sectors. Be specific about numbers and names.

Article title: {title}
Article text: {description}
Source: {source}
```

**Morning brief prompt:**
```
You are writing a daily intelligence brief for a senior McKinsey consultant based in Dubai. The consultant works with clients in CPG, family-owned businesses, private capital (SWFs, PE, VC), and tech across the GCC.

Here are today's top articles:
{articles_json}

Write a 3-4 paragraph morning brief that:
1. Opens with the single most important development and why it matters
2. Groups related stories into themes (don't just list articles)
3. Highlights specific implications for the consultant's four client sectors
4. Closes with 1-2 things to watch this week
5. Uses specific names, numbers, and facts — not vague summaries

Tone: crisp, confident, analytical. Like a senior partner's Monday morning email.
```

**Article classification prompt (Phase 2):**
```
Classify this article into one or more sectors and one country. Respond in JSON only.

Sectors: cpg_retail, family_business, private_capital, tech_digital, energy, real_estate_construction, regulation_policy
Countries: uae, ksa, qatar, kuwait, bahrain, oman, egypt, gcc_wide, international

Article: {title} — {description}

Respond: {"sectors": ["..."], "country": "...", "signal_score": 1-5}
```
