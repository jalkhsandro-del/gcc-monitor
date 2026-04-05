import { Suspense } from "react";
import { desc, gte, and } from "drizzle-orm";
import { MarketSnapshot } from "@/components/macro/market-snapshot";
import { MorningBrief } from "@/components/layout/morning-brief";
import { SignalsStrip } from "@/components/layout/signals-strip";
import { ArticleCard } from "@/components/news/article-card";
import { getQuote } from "@/lib/market/yahoo";
import { getDb } from "@/lib/db";
import { articles, briefs } from "@/lib/db/schema";
import type { QuoteData } from "@/lib/market/yahoo";
import type { CountryCode, SectorCode } from "@/types";

export const revalidate = 900; // ISR: 15 minutes

export default function HomePage() {
  return (
    <div className="space-y-8">
      {/* Market Snapshot */}
      <section>
        <Suspense
          fallback={
            <div className="h-10 animate-pulse rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]" />
          }
        >
          <SnapshotStrip />
        </Suspense>
      </section>

      {/* Morning Brief */}
      <section>
        <h1 className="font-serif text-2xl font-medium">Morning Brief</h1>
        <div className="mt-3">
          <Suspense
            fallback={
              <div className="h-40 animate-pulse rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]" />
            }
          >
            <BriefSection />
          </Suspense>
        </div>
      </section>

      {/* Signals */}
      <Suspense fallback={null}>
        <SignalsSection />
      </Suspense>

      {/* Top Stories */}
      <section>
        <h2 className="text-lg font-semibold">Top Stories</h2>
        <div className="mt-3">
          <Suspense
            fallback={
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-28 animate-pulse rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]"
                  />
                ))}
              </div>
            }
          >
            <TopStories />
          </Suspense>
        </div>
      </section>
    </div>
  );
}

async function SnapshotStrip() {
  const snapSymbols = [
    { symbol: "BZ=F", name: "Brent" },
    { symbol: "^TASI.SR", name: "TASI" },
    { symbol: "DFMGI.AE", name: "DFM" },
    { symbol: "GC=F", name: "Gold" },
    { symbol: "USDEGP=X", name: "USD/EGP" },
  ];

  let items: QuoteData[] = [];

  try {
    const results = await Promise.allSettled(
      snapSymbols.map((s) => getQuote(s.symbol, s.name))
    );
    items = results
      .filter(
        (r): r is PromiseFulfilledResult<QuoteData> =>
          r.status === "fulfilled" && r.value !== null
      )
      .map((r) => r.value);
  } catch {
    // Yahoo/DB unavailable
  }

  return <MarketSnapshot items={items} />;
}

async function BriefSection() {
  try {
    const db = getDb();
    // Get today's brief, or the most recent one
    const [brief] = await db
      .select()
      .from(briefs)
      .orderBy(desc(briefs.date))
      .limit(1);

    if (!brief) {
      return <MorningBrief content={null} date={null} generated={false} />;
    }

    return (
      <MorningBrief
        content={brief.content}
        date={brief.date}
        generated={brief.generated}
      />
    );
  } catch {
    return <MorningBrief content={null} date={null} generated={false} />;
  }
}

async function SignalsSection() {
  try {
    const db = getDb();
    const cutoff = new Date(Date.now() - 48 * 60 * 60 * 1000);

    const signals = await db
      .select({
        id: articles.id,
        title: articles.title,
        country: articles.country,
        sectors: articles.sectors,
        isRegulatory: articles.isRegulatory,
        dealType: articles.dealType,
        url: articles.url,
      })
      .from(articles)
      .where(
        and(
          gte(articles.signalScore, 4),
          gte(articles.publishedAt, cutoff)
        )
      )
      .orderBy(desc(articles.signalScore), desc(articles.publishedAt))
      .limit(8);

    return (
      <SignalsStrip
        signals={signals.map((s) => ({
          ...s,
          country: s.country as CountryCode,
          sectors: s.sectors as SectorCode[],
        }))}
      />
    );
  } catch {
    return null;
  }
}

async function TopStories() {
  try {
    const db = getDb();
    const cutoff = new Date(Date.now() - 48 * 60 * 60 * 1000);

    const topArticles = await db
      .select()
      .from(articles)
      .where(
        and(
          gte(articles.signalScore, 2),
          gte(articles.publishedAt, cutoff)
        )
      )
      .orderBy(desc(articles.signalScore), desc(articles.publishedAt))
      .limit(6);

    if (topArticles.length === 0) {
      return (
        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-6 text-center">
          <p className="text-sm text-[var(--color-text-secondary)]">
            No recent stories. Run the news cron to ingest articles.
          </p>
        </div>
      );
    }

    return (
      <div className="grid gap-3 sm:grid-cols-2">
        {topArticles.map((article) => (
          <ArticleCard
            key={article.id}
            title={article.title}
            description={article.description}
            summary={article.summary}
            url={article.url}
            sourceName={article.sourceName}
            country={article.country as CountryCode}
            articleSectors={article.sectors as SectorCode[]}
            publishedAt={article.publishedAt}
            signalScore={article.signalScore}
            dealType={article.dealType}
          />
        ))}
      </div>
    );
  } catch {
    return (
      <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-6 text-center">
        <p className="text-sm text-[var(--color-text-secondary)]">
          No recent stories. Run the news cron to ingest articles.
        </p>
      </div>
    );
  }
}
