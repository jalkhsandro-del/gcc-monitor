import Link from "next/link";
import { countries } from "@/config/countries";
import { gccIndices } from "@/lib/market/indices";
import type { QuoteData, HistoricalPoint } from "@/lib/market/yahoo";
import type { CountryCode } from "@/types";
import { Sparkline } from "./sparkline";
import { TrendingUp, TrendingDown } from "lucide-react";

interface MarketCardProps {
  quote: QuoteData;
  history?: HistoricalPoint[];
}

export function MarketCard({ quote, history }: MarketCardProps) {
  const idx = gccIndices.find((i) => i.symbol === quote.symbol);
  const countryCode = idx?.country as CountryCode | undefined;
  const country = countryCode ? countries[countryCode] : null;
  const isPositive = quote.changePercent >= 0;

  const sparkData = (history ?? []).map((p) => ({ value: p.close }));

  const card = (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4 transition-colors hover:bg-[var(--color-surface-elevated)]">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-[var(--color-text-primary)]">
              {quote.name}
            </span>
            {country && (
              <span className="text-sm">
                {country.flag}
              </span>
            )}
          </div>
          {idx && (
            <span className="text-xs text-[var(--color-text-tertiary)]">
              {idx.exchange}
            </span>
          )}
        </div>
        <div className="text-right">
          <div className="text-2xl font-semibold text-[var(--color-text-primary)]">
            {formatNumber(quote.price)}
          </div>
          <div
            className="flex items-center justify-end gap-1 text-sm font-medium"
            style={{ color: isPositive ? "var(--color-positive)" : "var(--color-negative)" }}
          >
            {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {isPositive ? "+" : ""}
            {quote.changePercent.toFixed(2)}%
          </div>
        </div>
      </div>
      {sparkData.length > 1 && (
        <div className="mt-3">
          <Sparkline data={sparkData} positive={isPositive} />
        </div>
      )}
    </div>
  );

  // Per ui-design.md: "Click to navigate to country tab in Macro page"
  if (countryCode) {
    return <Link href={`/macro?country=${countryCode}`}>{card}</Link>;
  }

  return card;
}

function formatNumber(n: number): string {
  if (n >= 1000) return n.toLocaleString("en-US", { maximumFractionDigits: 2 });
  return n.toFixed(n < 10 ? 4 : 2);
}
