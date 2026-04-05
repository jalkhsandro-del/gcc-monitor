import { countries } from "@/config/countries";
import { gccIndices } from "@/lib/market/indices";
import type { QuoteData } from "@/lib/market/yahoo";
import type { CountryCode } from "@/types";

interface IndicesTableProps {
  quotes: QuoteData[];
}

export function IndicesTable({ quotes }: IndicesTableProps) {
  const rows = gccIndices.map((idx) => {
    const quote = quotes.find((q) => q.symbol === idx.symbol);
    const country = countries[idx.country as CountryCode];
    return { idx, quote, country };
  });

  return (
    <div className="overflow-x-auto rounded-lg border border-[var(--color-border)]">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
            <th className="px-3 sm:px-4 py-2.5 text-left text-xs font-medium text-[var(--color-text-tertiary)]">
              Exchange
            </th>
            <th className="hidden sm:table-cell px-4 py-2.5 text-left text-xs font-medium text-[var(--color-text-tertiary)]">
              Index
            </th>
            <th className="px-3 sm:px-4 py-2.5 text-right text-xs font-medium text-[var(--color-text-tertiary)]">
              Value
            </th>
            <th className="px-3 sm:px-4 py-2.5 text-right text-xs font-medium text-[var(--color-text-tertiary)]">
              Change
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ idx, quote, country }) => {
            const isPositive = (quote?.changePercent ?? 0) >= 0;
            return (
              <tr
                key={idx.symbol}
                className="h-10 border-b border-[var(--color-border)] last:border-b-0 odd:bg-transparent even:bg-[var(--color-surface)] hover:bg-[var(--color-surface-elevated)]"
              >
                <td className="px-3 sm:px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <span>{country.flag}</span>
                    <span className="font-medium text-[var(--color-text-primary)]">
                      {idx.exchange}
                    </span>
                  </div>
                </td>
                <td className="hidden sm:table-cell px-4 py-2.5 text-[var(--color-text-secondary)]">
                  {idx.name}
                </td>
                <td className="px-3 sm:px-4 py-2.5 text-right font-mono font-medium text-[var(--color-text-primary)]">
                  {quote
                    ? quote.price.toLocaleString("en-US", {
                        maximumFractionDigits: 2,
                      })
                    : "—"}
                </td>
                <td className="px-3 sm:px-4 py-2.5 text-right">
                  {quote ? (
                    <span
                      className="font-mono font-medium"
                      style={{
                        color: isPositive
                          ? "var(--color-positive)"
                          : "var(--color-negative)",
                      }}
                    >
                      {isPositive ? "+" : ""}
                      {quote.changePercent.toFixed(2)}%
                    </span>
                  ) : (
                    <span className="text-[var(--color-text-tertiary)]">—</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
