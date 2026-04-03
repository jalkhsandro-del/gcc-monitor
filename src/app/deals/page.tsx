export default function DealsPage() {
  return (
    <div className="space-y-6">
      <h1 className="font-serif text-2xl font-medium">Deal Flow</h1>
      <p className="text-sm text-[var(--color-text-secondary)]">
        M&A, IPOs, PE/VC investments, and SWF deployments across the GCC.
      </p>

      <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
        <p className="text-sm text-[var(--color-text-tertiary)]">
          Deal type filters and deal cards will appear here.
        </p>
      </div>
    </div>
  );
}
