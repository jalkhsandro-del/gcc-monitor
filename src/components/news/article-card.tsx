import { formatDistanceToNow } from "date-fns";
import { countries } from "@/config/countries";
import { sectors } from "@/config/sectors";
import type { CountryCode, SectorCode } from "@/types";
import { ExternalLink } from "lucide-react";

interface ArticleCardProps {
  title: string;
  description: string | null;
  summary: string | null;
  url: string;
  sourceName: string;
  country: CountryCode;
  articleSectors: SectorCode[];
  publishedAt: Date;
  signalScore: number;
  dealType: string | null;
}

export function ArticleCard({
  title,
  description,
  summary,
  url,
  sourceName,
  country,
  articleSectors,
  publishedAt,
  signalScore,
  dealType,
}: ArticleCardProps) {
  const countryInfo = countries[country];
  const displayText = summary ?? description;
  const timeAgo = formatDistanceToNow(publishedAt, { addSuffix: true });

  return (
    <article className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-3 sm:p-4 transition-colors hover:bg-[var(--color-surface-elevated)]">
      {/* Meta row */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="font-medium text-[var(--color-text-secondary)]">
          {sourceName}
        </span>
        <span className="text-[var(--color-text-tertiary)]">&middot;</span>
        <span className="text-[var(--color-text-tertiary)]">{timeAgo}</span>
        <span className="text-[var(--color-text-tertiary)]">&middot;</span>
        <CountryBadge code={country} name={countryInfo.name} flag={countryInfo.flag} color={countryInfo.accentColor} />
        {articleSectors.slice(0, 2).map((s) => (
          <SectorBadge key={s} code={s} />
        ))}
        {dealType && <DealBadge type={dealType} />}
        {signalScore >= 4 && (
          <span className="ml-auto rounded-full bg-[var(--color-positive)]/15 px-2 py-0.5 text-[10px] font-medium text-[var(--color-positive)]">
            High signal
          </span>
        )}
      </div>

      {/* Headline */}
      <h3 className="mt-2 line-clamp-2 text-[15px] font-medium leading-snug text-[var(--color-text-primary)]">
        {title}
      </h3>

      {/* Summary */}
      {displayText && (
        <p className="mt-1.5 line-clamp-3 text-sm leading-relaxed text-[var(--color-text-secondary)]">
          {displayText}
        </p>
      )}

      {/* Read original */}
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-blue-400 transition-colors hover:text-blue-300"
      >
        <ExternalLink size={12} />
        Read original
      </a>
    </article>
  );
}

function CountryBadge({
  name,
  flag,
  color,
}: {
  code: string;
  name: string;
  flag: string;
  color: string;
}) {
  return (
    <span
      className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] font-medium"
      style={{ backgroundColor: `${color}20`, color }}
    >
      {flag} {name}
    </span>
  );
}

function SectorBadge({ code }: { code: SectorCode }) {
  const sector = sectors[code];
  if (!sector) return null;

  return (
    <span
      className="rounded px-1.5 py-0.5 text-[11px] font-medium"
      style={{ backgroundColor: `${sector.accentColor}20`, color: sector.accentColor }}
    >
      {sector.name}
    </span>
  );
}

function DealBadge({ type }: { type: string }) {
  const labels: Record<string, string> = {
    ma: "M&A",
    ipo: "IPO",
    pe_vc: "PE/VC",
    swf: "SWF",
  };

  return (
    <span className="rounded bg-[var(--color-positive)]/15 px-1.5 py-0.5 text-[11px] font-medium text-[var(--color-positive)]">
      {labels[type] ?? type}
    </span>
  );
}
