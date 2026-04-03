export default function HomePage() {
  return (
    <div className="space-y-8">
      <section>
        <h1 className="font-serif text-2xl font-medium">Morning Brief</h1>
        <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
          Your daily intelligence summary will appear here.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold">Market Snapshot</h2>
        <div className="mt-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
          <p className="text-sm text-[var(--color-text-tertiary)]">
            Market data loading...
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold">Top Stories</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4"
            >
              <p className="text-sm text-[var(--color-text-tertiary)]">
                Article placeholder {i + 1}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
