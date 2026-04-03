export default function MacroPage() {
  return (
    <div className="space-y-6">
      <h1 className="font-serif text-2xl font-medium">Macro Dashboard</h1>
      <p className="text-sm text-[var(--color-text-secondary)]">
        GCC market indices, oil prices, currencies, and economic indicators.
      </p>

      <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
        <p className="text-sm text-[var(--color-text-tertiary)]">
          Country tabs and market data will appear here.
        </p>
      </div>
    </div>
  );
}
