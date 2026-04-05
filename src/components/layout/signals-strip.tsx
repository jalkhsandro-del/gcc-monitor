import type { CountryCode, SectorCode } from "@/types";

interface Signal {
  id: string;
  title: string;
  country: CountryCode;
  sectors: SectorCode[];
  isRegulatory: boolean;
  dealType: string | null;
  url: string;
}

interface SignalsStripProps {
  signals: Signal[];
}

export function SignalsStrip({ signals }: SignalsStripProps) {
  if (signals.length === 0) return null;

  return (
    <section>
      <h2 className="mb-3 text-lg font-semibold">Signals</h2>
      <div className="hide-scrollbar flex gap-2 overflow-x-auto pb-1">
        {signals.map((signal) => (
          <SignalBadge key={signal.id} signal={signal} />
        ))}
      </div>
    </section>
  );
}

function SignalBadge({ signal }: { signal: Signal }) {
  const dotColor = getDotColor(signal);
  // Truncate title for the badge
  const label =
    signal.title.length > 55
      ? signal.title.slice(0, 52) + "..."
      : signal.title;

  return (
    <a
      href={signal.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex shrink-0 items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-xs transition-colors hover:bg-[var(--color-surface-elevated)]"
    >
      <span
        className="inline-block h-2 w-2 shrink-0 rounded-full"
        style={{ backgroundColor: dotColor }}
      />
      <span className="text-[var(--color-text-secondary)]">{label}</span>
    </a>
  );
}

function getDotColor(signal: Signal): string {
  if (signal.isRegulatory) return "#EF4444"; // red
  if (signal.dealType) return "#22C55E"; // green
  if (signal.sectors.includes("tech_digital")) return "#3B82F6"; // blue
  if (signal.sectors.includes("cpg_retail")) return "#F59E0B"; // amber
  if (signal.sectors.includes("energy")) return "#EF4444"; // red
  return "#8B5CF6"; // purple default
}
