interface DealStatsProps {
  total: number;
  byType: Record<string, number>;
}

const typeLabels: Record<string, string> = {
  ma: "M&A",
  ipo: "IPO",
  pe_vc: "PE/VC",
  swf: "SWF",
};

export function DealStats({ total, byType }: DealStatsProps) {
  return (
    <div className="hide-scrollbar flex gap-3 overflow-x-auto pb-1">
      <StatPill label="Total Deals" value={String(total)} />
      {Object.entries(byType).map(([type, count]) => (
        <StatPill key={type} label={typeLabels[type] ?? type} value={String(count)} />
      ))}
    </div>
  );
}

function StatPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex shrink-0 items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2">
      <span className="text-xs text-[var(--color-text-tertiary)]">{label}</span>
      <span className="text-2xl font-semibold text-[var(--color-text-primary)]">
        {value}
      </span>
    </div>
  );
}
