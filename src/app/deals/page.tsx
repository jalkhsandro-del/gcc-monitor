import { Suspense } from "react";
import { desc, eq, and, isNotNull } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { articles } from "@/lib/db/schema";
import { ArticleCard } from "@/components/news/article-card";
import { DealFilters } from "@/components/deals/deal-filters";
import { DealStats } from "@/components/deals/deal-stats";
import type { CountryCode, SectorCode } from "@/types";

export const revalidate = 900;

interface DealsPageProps {
  searchParams: Promise<{ type?: string; country?: string }>;
}

export default async function DealsPage({ searchParams }: DealsPageProps) {
  const params = await searchParams;

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-2xl font-medium">Deal Flow</h1>

      <Suspense fallback={null}>
        <DealFilters />
      </Suspense>

      <Suspense fallback={<DealsSkeleton />}>
        <DealsContent type={params.type} country={params.country} />
      </Suspense>
    </div>
  );
}

async function DealsContent({
  type,
  country,
}: {
  type?: string;
  country?: string;
}) {
  let deals: Awaited<ReturnType<typeof queryDeals>>;
  let stats: { total: number; byType: Record<string, number> };

  try {
    [deals, stats] = await Promise.all([
      queryDeals(type, country),
      getDealStats(),
    ]);
  } catch {
    deals = [];
    stats = { total: 0, byType: {} };
  }

  return (
    <div className="space-y-6">
      <DealStats total={stats.total} byType={stats.byType} />

      {deals.length === 0 ? (
        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-8 text-center">
          <p className="text-sm text-[var(--color-text-secondary)]">
            No deals found. Deal articles are automatically tagged during news
            ingestion when they mention acquisitions, IPOs, funding rounds, or
            SWF investments.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-xs text-[var(--color-text-tertiary)]">
            {deals.length} deal{deals.length !== 1 ? "s" : ""}
          </p>
          {deals.map((deal) => (
            <ArticleCard
              key={deal.id}
              title={deal.title}
              description={deal.description}
              summary={deal.summary}
              url={deal.url}
              sourceName={deal.sourceName}
              country={deal.country as CountryCode}
              articleSectors={deal.sectors as SectorCode[]}
              publishedAt={deal.publishedAt}
              signalScore={deal.signalScore}
              dealType={deal.dealType}
            />
          ))}
        </div>
      )}
    </div>
  );
}

async function queryDeals(type?: string, country?: string) {
  const db = getDb();
  const conditions = [isNotNull(articles.dealType)];

  if (type && type !== "all") {
    conditions.push(eq(articles.dealType, type));
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

async function getDealStats() {
  const db = getDb();
  const allDeals = await db
    .select({ dealType: articles.dealType })
    .from(articles)
    .where(isNotNull(articles.dealType));

  const byType: Record<string, number> = {};
  for (const deal of allDeals) {
    if (deal.dealType) {
      byType[deal.dealType] = (byType[deal.dealType] || 0) + 1;
    }
  }

  return { total: allDeals.length, byType };
}

function DealsSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="h-28 animate-pulse rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]"
        />
      ))}
    </div>
  );
}
