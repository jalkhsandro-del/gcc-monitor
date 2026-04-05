import { Suspense } from "react";
import { desc, or, ilike } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { articles } from "@/lib/db/schema";
import { ArticleCard } from "@/components/news/article-card";
import { SearchInput } from "@/components/shared/search-input";
import type { CountryCode, SectorCode } from "@/types";
import { Search } from "lucide-react";

export const revalidate = 0; // always dynamic for search

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q?.trim() ?? "";

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-2xl font-medium">Search</h1>

      <Suspense fallback={null}>
        <SearchInput initialQuery={query} />
      </Suspense>

      {query ? (
        <Suspense fallback={<SearchSkeleton />}>
          <SearchResults query={query} />
        </Suspense>
      ) : (
        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-8 text-center">
          <Search className="mx-auto mb-3 text-[var(--color-text-tertiary)]" size={32} />
          <p className="text-sm text-[var(--color-text-secondary)]">
            Search across all articles by keyword, company name, or topic.
          </p>
        </div>
      )}
    </div>
  );
}

async function SearchResults({ query }: { query: string }) {
  let results: Awaited<ReturnType<typeof searchArticles>>;

  try {
    results = await searchArticles(query);
  } catch {
    results = [];
  }

  if (results.length === 0) {
    return (
      <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-8 text-center">
        <p className="text-sm text-[var(--color-text-secondary)]">
          No results found for &ldquo;{query}&rdquo;
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-[var(--color-text-tertiary)]">
        {results.length} result{results.length !== 1 ? "s" : ""} for &ldquo;{query}&rdquo;
      </p>
      {results.map((article) => (
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

async function searchArticles(query: string) {
  const db = getDb();
  const pattern = `%${query}%`;

  return db
    .select()
    .from(articles)
    .where(
      or(
        ilike(articles.title, pattern),
        ilike(articles.description, pattern),
        ilike(articles.summary, pattern)
      )
    )
    .orderBy(desc(articles.signalScore), desc(articles.publishedAt))
    .limit(30);
}

function SearchSkeleton() {
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
