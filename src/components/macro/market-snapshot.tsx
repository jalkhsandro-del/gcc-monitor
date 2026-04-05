import type { QuoteData } from "@/lib/market/yahoo";
import Link from "next/link";

interface MarketSnapshotProps {
  items: QuoteData[];
}

export function MarketSnapshot({ items }: MarketSnapshotProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-3">
        <p className="text-xs text-[var(--color-text-tertiary)]">
          Market data not available — run /api/cron/markets
        </p>
      </div>
    );
  }

  return (
    <Link href="/macro">
      <div className="flex items-center gap-4 overflow-x-auto rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 transition-colors hover:bg-[var(--color-surface-elevated)]">
        {items.map((item, i) => {
          const isPositive = item.changePercent >= 0;
          return (
            <div
              key={item.symbol}
              className="flex shrink-0 items-center gap-2"
            >
              <span className="text-xs font-medium text-[var(--color-text-tertiary)]">
                {item.name}
              </span>
              <span className="font-mono text-sm font-semibold text-[var(--color-text-primary)]">
                {formatSnap(item.price)}
              </span>
              <span
                className="font-mono text-xs font-medium"
                style={{
                  color: isPositive
                    ? "var(--color-positive)"
                    : "var(--color-negative)",
                }}
              >
                {isPositive ? "+" : ""}
                {item.changePercent.toFixed(2)}%
              </span>
              {/* separator — hide on last item */}
              {i < items.length - 1 && (
                <span className="text-[var(--color-border)]">|</span>
              )}
            </div>
          );
        })}
      </div>
    </Link>
  );
}

function formatSnap(n: number): string {
  if (n >= 1000) return n.toLocaleString("en-US", { maximumFractionDigits: 0 });
  return n.toFixed(n < 10 ? 4 : 2);
}
