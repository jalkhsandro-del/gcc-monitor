import { Suspense } from "react";
import { MacroTabs } from "@/components/macro/macro-tabs";
import { IndicesTable } from "@/components/macro/indices-table";
import { DataStrip } from "@/components/macro/data-strip";
import { MarketCard } from "@/components/macro/market-card";
import { StockChart } from "@/components/macro/stock-chart";
import { CountryStats } from "@/components/macro/country-stats";
import {
  getQuote,
  getAllIndexQuotes,
  getCommodityQuotes,
  getFxQuotes,
  getHistorical,
  getIndexForCountry,
} from "@/lib/market/yahoo";
import { gccIndices } from "@/lib/market/indices";
import type { CountryCode } from "@/types";
import type { QuoteData, HistoricalPoint } from "@/lib/market/yahoo";

export const revalidate = 900; // ISR: 15 minutes

interface MacroPageProps {
  searchParams: Promise<{ country?: string }>;
}

export default async function MacroPage({ searchParams }: MacroPageProps) {
  const params = await searchParams;
  const selectedCountry = params.country as CountryCode | undefined;

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-2xl font-medium">Macro Dashboard</h1>

      <Suspense fallback={null}>
        <MacroTabs />
      </Suspense>

      <Suspense fallback={<MacroSkeleton />}>
        {selectedCountry ? (
          <CountryView country={selectedCountry} />
        ) : (
          <AllGccView />
        )}
      </Suspense>
    </div>
  );
}

async function AllGccView() {
  let indices: QuoteData[] = [];
  let commodities: QuoteData[] = [];
  let fx: QuoteData[] = [];

  try {
    [indices, commodities, fx] = await Promise.all([
      getAllIndexQuotes(),
      getCommodityQuotes(),
      getFxQuotes(),
    ]);
  } catch {
    // DB/Yahoo unavailable — render empty state
  }

  const oilItems = commodities.filter((c) =>
    ["Brent Crude", "WTI Crude", "Natural Gas"].includes(c.name)
  );
  const commodityItems = commodities.filter(
    (c) => !["Brent Crude", "WTI Crude", "Natural Gas"].includes(c.name)
  );

  if (indices.length === 0 && commodities.length === 0 && fx.length === 0) {
    return (
      <div className="space-y-6">
        <EmptyState />
        <IndicesTable quotes={[]} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DataStrip title="Oil & Energy" items={oilItems} />
      <IndicesTable quotes={indices} />
      <DataStrip title="Currencies" items={fx} />
      <DataStrip title="Commodities (CPG-relevant)" items={commodityItems} />
    </div>
  );
}

async function CountryView({ country }: { country: CountryCode }) {
  const idx = getIndexForCountry(country);
  let quote: QuoteData | null = null;
  let history: HistoricalPoint[] = [];
  let allQuotes: QuoteData[] = [];

  try {
    if (idx) {
      [quote, history, allQuotes] = await Promise.all([
        getQuote(idx.symbol, idx.name),
        getHistorical(idx.symbol, 90),
        getAllIndexQuotes(),
      ]);
    }
  } catch {
    // Yahoo/DB unavailable
  }

  // Find indices for this country
  const countryIndices = gccIndices.filter((i) => i.country === country);
  const countryQuotes = allQuotes.filter((q) =>
    countryIndices.some((ci) => ci.symbol === q.symbol)
  );

  return (
    <div className="space-y-6">
      {/* Market cards for this country's indices */}
      <div className="grid gap-3 sm:grid-cols-2">
        {countryQuotes.length > 0 ? (
          countryQuotes.map((q) => <MarketCard key={q.symbol} quote={q} />)
        ) : (
          <MarketCard
            quote={
              quote ?? {
                symbol: idx?.symbol ?? "",
                name: idx?.name ?? country,
                price: 0,
                change: 0,
                changePercent: 0,
                previousClose: 0,
                timestamp: new Date().toISOString(),
              }
            }
          />
        )}
      </div>

      {/* Stock chart */}
      <StockChart data={history} />

      {/* Key stats */}
      <CountryStats country={country} quote={quote} />
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-6 text-center">
      <p className="text-sm text-[var(--color-text-secondary)]">
        Market data not yet loaded. Run the markets cron to populate.
      </p>
      <p className="mt-1 text-xs text-[var(--color-text-tertiary)]">
        GET /api/cron/markets or run: npm run cron:markets
      </p>
    </div>
  );
}

function MacroSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-12 animate-pulse rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]" />
      <div className="h-64 animate-pulse rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]" />
      <div className="h-48 animate-pulse rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]" />
    </div>
  );
}
