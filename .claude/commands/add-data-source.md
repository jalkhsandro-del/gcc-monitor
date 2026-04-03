# Add data source workflow

When adding a new RSS feed or API data source:

1. Read `docs/data-sources.md` for the full source catalog and conventions
2. Test the feed URL locally: `curl -s "FEED_URL" | head -50`
3. Add the source config to `src/config/sources.ts`
4. If RSS: add parsing logic in `src/lib/feeds/rss.ts`, handle both RSS 2.0 and Atom
5. If API: create a new file in `src/lib/market/` or relevant directory
6. Add Zod validation schema for the response shape
7. Add error handling with fallback to cached data
8. Update the cron job route if this source needs scheduled fetching
9. Update `docs/data-sources.md` with the new source entry
10. Test the ingestion: `npm run cron:news` or `npm run cron:markets`

Important:
- Always wrap external API calls in try/catch
- Set appropriate cache TTLs in Vercel KV
- Respect rate limits — add delays between requests if needed
- Store raw data before transformation for debugging
