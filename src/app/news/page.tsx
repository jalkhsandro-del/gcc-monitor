import { Suspense } from "react";
import { desc, eq, arrayContains, and, gte } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { articles } from "@/lib/db/schema";
import { ArticleCard } from "@/components/news/article-card";
import { NewsFilters } from "@/components/news/news-filters";
import type { CountryCode, SectorCode } from "@/types";

export const revalidate = 900; // ISR: 15 minutes

interface NewsPageProps {
  searchParams: Promise<{ sector?: string; country?: string }>;
}

export default async function NewsPage({ searchParams }: NewsPageProps) {
  const params = await searchParams;

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-2xl font-medium">News Feed</h1>

      <Suspense fallback={null}>
        <NewsFilters />
      </Suspense>

      <Suspense fallback={<ArticlesSkeleton />}>
        <ArticleList sector={params.sector} country={params.country} />
      </Suspense>
    </div>
  );
}

async function ArticleList({
  sector,
  country,
}: {
  sector?: string;
  country?: string;
}) {
  let rows: Awaited<ReturnType<typeof queryArticles>>;

  try {
    rows = await queryArticles(sector, country);
  } catch {
    // DB not available — show empty state
    rows = [];
  }

  if (rows.length === 0) {
    return (
      <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-8 text-center">
        <p className="text-sm text-[var(--color-text-secondary)]">
          No articles found. Run the news ingestion cron to populate articles.
        </p>
        <p className="mt-2 text-xs text-[var(--color-text-tertiary)]">
          POST /api/cron/news or run: npm run cron:news
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-[var(--color-text-tertiary)]">
        {rows.length} article{rows.length !== 1 ? "s" : ""}
      </p>
      {rows.map((article) => (
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
}

async function queryArticles(sector?: string, country?: string) {
  const db = getDb();

  const conditions = [gte(articles.signalScore, 2)];

  if (sector && sector !== "all") {
    conditions.push(arrayContains(articles.sectors, [sector]));
  }

  if (country && country !== "all") {
    conditions.push(eq(articles.country, country));
  }

  return db
    .select()
    .from(articles)
    .where(and(...conditions))
    .orderBy(desc(articles.publishedAt))
    .limit(50);
}

function ArticlesSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="h-32 animate-pulse rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]"
        />
      ))}
    </div>
  );
}
