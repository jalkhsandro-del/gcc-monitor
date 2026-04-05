import type { QuoteData } from "@/lib/market/yahoo";

interface DataStripProps {
  title: string;
  items: QuoteData[];
}

export function DataStrip({ title, items }: DataStripProps) {
  if (items.length === 0) {
    return (
      <section>
        <h3 className="mb-2 text-sm font-semibold text-[var(--color-text-secondary)]">
          {title}
        </h3>
        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-3">
          <p className="text-xs text-[var(--color-text-tertiary)]">
            Data unavailable
          </p>
        </div>
      </section>
    );
  }

  return (
    <section>
      <h3 className="mb-2 text-sm font-semibold text-[var(--color-text-secondary)]">
        {title}
      </h3>
      <div className="flex gap-3 overflow-x-auto pb-1">
        {items.map((item) => {
          const isPositive = item.changePercent >= 0;
          return (
            <div
              key={item.symbol}
              className="flex shrink-0 items-center gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5"
            >
              <span className="text-xs font-medium text-[var(--color-text-secondary)]">
                {item.name}
              </span>
              <span className="font-mono text-sm font-semibold text-[var(--color-text-primary)]">
                {formatStripValue(item.price)}
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
            </div>
          );
        })}
      </div>
    </section>
  );
}

function formatStripValue(n: number): string {
  if (n >= 1000) return n.toLocaleString("en-US", { maximumFractionDigits: 2 });
  return n.toFixed(n < 10 ? 4 : 2);
}
