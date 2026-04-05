import type { QuoteData } from "@/lib/market/yahoo";
import type { CountryCode } from "@/types";
import { countries } from "@/config/countries";

interface CountryStatsProps {
  country: CountryCode;
  quote: QuoteData | null;
}

// Static macro data — Phase 1 uses manual values, updated monthly
const macroData: Partial<
  Record<
    CountryCode,
    { gdp: string; cpi: string; pmi: string; population: string; rating: string }
  >
> = {
  uae: { gdp: "3.4%", cpi: "2.1%", pmi: "55.3", population: "9.4M", rating: "AA/Aa2" },
  ksa: { gdp: "4.2%", cpi: "1.6%", pmi: "56.4", population: "32.2M", rating: "A+/A1" },
  qatar: { gdp: "2.4%", cpi: "2.8%", pmi: "51.2", population: "2.7M", rating: "AA/Aa3" },
  kuwait: { gdp: "2.1%", cpi: "3.5%", pmi: "52.1", population: "4.3M", rating: "A+/A1" },
  bahrain: { gdp: "3.0%", cpi: "1.2%", pmi: "52.8", population: "1.5M", rating: "B+/B2" },
  oman: { gdp: "2.7%", cpi: "1.1%", pmi: "53.0", population: "4.6M", rating: "BB/Ba1" },
  egypt: { gdp: "4.2%", cpi: "33.7%", pmi: "48.5", population: "106M", rating: "B-/B3" },
};

export function CountryStats({ country, quote }: CountryStatsProps) {
  const info = countries[country];
  const macro = macroData[country];

  const stats = [
    {
      label: "Index",
      value: quote ? quote.price.toLocaleString("en-US", { maximumFractionDigits: 2 }) : "—",
      sub: quote
        ? `${quote.changePercent >= 0 ? "+" : ""}${quote.changePercent.toFixed(2)}%`
        : undefined,
      subColor: quote
        ? quote.changePercent >= 0
          ? "var(--color-positive)"
          : "var(--color-negative)"
        : undefined,
    },
    { label: "GDP Growth", value: macro?.gdp ?? "—" },
    { label: "CPI / Inflation", value: macro?.cpi ?? "—" },
    { label: "PMI", value: macro?.pmi ?? "—" },
    { label: "Population", value: macro?.population ?? "—" },
    { label: "Credit Rating", value: macro?.rating ?? "—" },
  ];

  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
      <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-[var(--color-text-primary)]">
        <span>{info.flag}</span>
        {info.name} — Key Stats
      </h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label}>
            <p className="text-xs text-[var(--color-text-tertiary)]">
              {stat.label}
            </p>
            <p className="text-2xl font-semibold text-[var(--color-text-primary)]">
              {stat.value}
            </p>
            {stat.sub && (
              <p className="text-xs font-medium" style={{ color: stat.subColor }}>
                {stat.sub}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
