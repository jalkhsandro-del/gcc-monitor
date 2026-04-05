interface MorningBriefProps {
  content: string | null;
  date: string | null;
  generated: boolean;
}

export function MorningBrief({ content, date, generated }: MorningBriefProps) {
  if (!content) {
    return (
      <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:p-6">
        <p className="text-sm text-[var(--color-text-secondary)]">
          No morning brief available yet. The brief is generated daily at 6 AM
          GST from the top stories.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:p-6">
      {date && (
        <div className="mb-3 flex items-center gap-2">
          <span className="text-xs text-[var(--color-text-tertiary)]">
            {new Date(date + "T00:00:00").toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </span>
          {!generated && (
            <span className="rounded bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-medium text-amber-400">
              Auto-assembled
            </span>
          )}
        </div>
      )}
      <div className="prose prose-sm prose-invert max-w-none">
        {content.split("\n\n").map((paragraph, i) => (
          <p
            key={i}
            className="mb-3 text-sm leading-relaxed text-[var(--color-text-secondary)] last:mb-0"
            dangerouslySetInnerHTML={{
              __html: paragraph
                .replace(/\*\*(.*?)\*\*/g, '<strong class="text-[var(--color-text-primary)]">$1</strong>')
                .replace(/\n/g, "<br />"),
            }}
          />
        ))}
      </div>
    </div>
  );
}
