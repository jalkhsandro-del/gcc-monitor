import { Suspense } from "react";
import { desc, eq, and } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { articles } from "@/lib/db/schema";
import { CountryTabs } from "@/components/shared/country-tabs";
import { countries } from "@/config/countries";
import type { CountryCode } from "@/types";
import { ExternalLink, Scale } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export const revalidate = 900;

interface RegulatoryPageProps {
  searchParams: Promise<{ country?: string }>;
}

export default async function RegulatoryPage({
  searchParams,
}: RegulatoryPageProps) {
  const params = await searchParams;

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-2xl font-medium">Regulatory Radar</h1>

      <Suspense fallback={null}>
        <CountryTabs basePath="/regulatory" />
      </Suspense>

      <Suspense fallback={<TimelineSkeleton />}>
        <RegulatoryTimeline country={params.country} />
      </Suspense>
    </div>
  );
}

async function RegulatoryTimeline({ country }: { country?: string }) {
  let events: Awaited<ReturnType<typeof queryRegulatory>>;

  try {
    events = await queryRegulatory(country);
  } catch {
    events = [];
  }

  if (events.length === 0) {
    return (
      <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-8 text-center">
        <Scale className="mx-auto mb-3 text-[var(--color-text-tertiary)]" size={32} />
        <p className="text-sm text-[var(--color-text-secondary)]">
          No regulatory events found. Articles tagged as regulatory are
          automatically extracted from the news feed.
        </p>
      </div>
    );
  }

  // Group by date
  const grouped = groupByDate(events);

  return (
    <div className="relative space-y-6 pl-5 sm:pl-6">
      {/* Timeline line */}
      <div className="absolute left-[7px] sm:left-2 top-2 bottom-2 w-px bg-[var(--color-border)]" />

      {Object.entries(grouped).map(([dateStr, items]) => (
        <div key={dateStr} className="relative">
          {/* Timeline dot */}
          <div className="absolute -left-5 sm:-left-6 top-1 h-3 w-3 rounded-full border-2 border-[var(--color-border)] bg-[var(--color-bg)]" />

          <div className="mb-2 text-xs font-medium text-[var(--color-text-tertiary)]">
            {formatDateLabel(dateStr)}
          </div>

          <div className="space-y-2">
            {items.map((event) => (
              <RegulatoryCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function RegulatoryCard({
  event,
}: {
  event: Awaited<ReturnType<typeof queryRegulatory>>[0];
}) {
  const countryInfo = countries[event.country as CountryCode];
  const timeAgo = formatDistanceToNow(event.publishedAt, { addSuffix: true });

  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-3 sm:p-4 transition-colors hover:bg-[var(--color-surface-elevated)]">
      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs">
        <span className="font-medium text-[var(--color-text-secondary)]">
          {event.sourceName}
        </span>
        <span className="text-[var(--color-text-tertiary)]">&middot;</span>
        <span className="text-[var(--color-text-tertiary)]">{timeAgo}</span>
        <span
          className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] font-medium"
          style={{
            backgroundColor: `${countryInfo.accentColor}20`,
            color: countryInfo.accentColor,
          }}
        >
          {countryInfo.flag} {countryInfo.name}
        </span>
        <span className="rounded bg-[var(--color-sector-regulation)]/20 px-1.5 py-0.5 text-[11px] font-medium text-[var(--color-sector-regulation)]">
          Regulation
        </span>
      </div>

      <h3 className="mt-2 line-clamp-2 text-[15px] font-medium leading-snug text-[var(--color-text-primary)]">
        {event.title}
      </h3>

      {(event.summary ?? event.description) && (
        <p className="mt-1.5 line-clamp-3 text-sm leading-relaxed text-[var(--color-text-secondary)]">
          {event.summary ?? event.description}
        </p>
      )}

      <a
        href={event.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-blue-400 transition-colors hover:text-blue-300"
      >
        <ExternalLink size={12} />
        Read original
      </a>
    </div>
  );
}

async function queryRegulatory(country?: string) {
  const db = getDb();
  const conditions = [eq(articles.isRegulatory, true)];

  if (country && country !== "all") {
    conditions.push(eq(articles.country, country));
  }

  return db
    .select()
    .from(articles)
    .where(and(...conditions))
    .orderBy(desc(articles.publishedAt))
    .limit(50);
}

function groupByDate(
  events: Awaited<ReturnType<typeof queryRegulatory>>
): Record<string, typeof events> {
  const groups: Record<string, typeof events> = {};
  for (const event of events) {
    const dateStr = event.publishedAt.toISOString().split("T")[0];
    if (!groups[dateStr]) groups[dateStr] = [];
    groups[dateStr].push(event);
  }
  return groups;
}

function formatDateLabel(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffDays = Math.floor(
    (today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";

  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

function TimelineSkeleton() {
  return (
    <div className="space-y-4 pl-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="h-28 animate-pulse rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]"
        />
      ))}
    </div>
  );
}
