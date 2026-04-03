export default function NewsPage() {
  return (
    <div className="space-y-6">
      <h1 className="font-serif text-2xl font-medium">News Feed</h1>
      <p className="text-sm text-[var(--color-text-secondary)]">
        AI-curated news from 20+ GCC business sources, filterable by sector and
        country.
      </p>

      <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
        <p className="text-sm text-[var(--color-text-tertiary)]">
          Sector tabs and article cards will appear here.
        </p>
      </div>
    </div>
  );
}
