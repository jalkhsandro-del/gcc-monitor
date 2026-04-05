import { Suspense } from "react";
import { desc, eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { articles } from "@/lib/db/schema";
import { countries } from "@/config/countries";
import {
  nationalVisions,
  megaprojectsData,
  visionKpis,
} from "@/config/visions";
import type { CountryCode } from "@/types";
import {
  ExternalLink,
  TrendingUp,
  TrendingDown,
  Minus,
  Building2,
  Target,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export const revalidate = 3600; // 1 hour — slow-changing data

export default function VisionPage() {
  return (
    <div className="space-y-8">
      <h1 className="font-serif text-2xl font-medium">Vision Tracker</h1>

      {/* National vision cards */}
      <section>
        <h2 className="mb-3 text-lg font-semibold">National Transformation Programs</h2>
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {nationalVisions.map((vision) => (
            <VisionCard key={vision.code} vision={vision} />
          ))}
        </div>
      </section>

      {/* KPI dashboard */}
      <section>
        <h2 className="mb-3 text-lg font-semibold">Key Metrics</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {visionKpis.map((kpi) => (
            <KpiCard key={kpi.country} kpi={kpi} />
          ))}
        </div>
      </section>

      {/* Megaproject tracker */}
      <section>
        <h2 className="mb-3 text-lg font-semibold">Megaproject Tracker</h2>
        <MegaprojectsTable />
      </section>

      {/* Related news */}
      <section>
        <h2 className="mb-3 text-lg font-semibold">Latest Vision News</h2>
        <Suspense
          fallback={
            <div className="h-32 animate-pulse rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]" />
          }
        >
          <VisionNews />
        </Suspense>
      </section>
    </div>
  );
}

function VisionCard({
  vision,
}: {
  vision: (typeof nationalVisions)[0];
}) {
  const country = countries[vision.country];
  const now = new Date().getFullYear();
  const start = vision.targetYear - 15; // approximate start year
  const progressPct = Math.min(
    100,
    Math.max(0, ((now - start) / (vision.targetYear - start)) * 100)
  );

  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
      <div className="mb-2 flex items-center gap-2">
        <span className="text-lg">{country.flag}</span>
        <div>
          <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">
            {vision.name}
          </h3>
          <span className="text-xs text-[var(--color-text-tertiary)]">
            Target: {vision.targetYear}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-[10px] text-[var(--color-text-tertiary)]">
          <span>Timeline progress</span>
          <span>{Math.round(progressPct)}%</span>
        </div>
        <div className="mt-1 h-1.5 rounded-full bg-[var(--color-border)]">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${progressPct}%`,
              backgroundColor: country.accentColor,
            }}
          />
        </div>
      </div>

      <ul className="space-y-1">
        {vision.keyTargets.slice(0, 3).map((target, i) => (
          <li
            key={i}
            className="flex items-start gap-1.5 text-xs text-[var(--color-text-secondary)]"
          >
            <Target size={10} className="mt-0.5 shrink-0 text-[var(--color-text-tertiary)]" />
            {target}
          </li>
        ))}
      </ul>
    </div>
  );
}

function KpiCard({ kpi }: { kpi: (typeof visionKpis)[0] }) {
  const country = countries[kpi.country];

  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
      <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-[var(--color-text-primary)]">
        <span>{country.flag}</span>
        {country.name}
      </h3>
      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        {kpi.metrics.map((m) => (
          <div key={m.label}>
            <p className="text-xs text-[var(--color-text-tertiary)]">{m.label}</p>
            <div className="flex items-center gap-1">
              <span className="text-2xl font-semibold text-[var(--color-text-primary)]">
                {m.value}
              </span>
              {m.trend === "up" && (
                <TrendingUp size={14} className="text-[var(--color-positive)]" />
              )}
              {m.trend === "down" && (
                <TrendingDown size={14} className="text-[var(--color-negative)]" />
              )}
              {m.trend === "flat" && (
                <Minus size={14} className="text-[var(--color-neutral)]" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MegaprojectsTable() {
  const statusColors: Record<string, string> = {
    announced: "text-amber-400 bg-amber-400/15",
    under_construction: "text-blue-400 bg-blue-400/15",
    completed: "text-[var(--color-positive)] bg-[var(--color-positive)]/15",
  };
  const statusLabels: Record<string, string> = {
    announced: "Announced",
    under_construction: "Under Construction",
    completed: "Completed",
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-[var(--color-border)]">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
            <th className="px-3 sm:px-4 py-2.5 text-left text-xs font-medium text-[var(--color-text-tertiary)]">
              Project
            </th>
            <th className="hidden sm:table-cell px-4 py-2.5 text-left text-xs font-medium text-[var(--color-text-tertiary)]">
              Country
            </th>
            <th className="px-3 sm:px-4 py-2.5 text-right text-xs font-medium text-[var(--color-text-tertiary)]">
              Value ($B)
            </th>
            <th className="px-3 sm:px-4 py-2.5 text-left text-xs font-medium text-[var(--color-text-tertiary)]">
              Status
            </th>
            <th className="hidden sm:table-cell px-4 py-2.5 text-right text-xs font-medium text-[var(--color-text-tertiary)]">
              Completion
            </th>
          </tr>
        </thead>
        <tbody>
          {megaprojectsData.map((project) => {
            const country = countries[project.country];
            return (
              <tr
                key={project.name}
                className="h-10 border-b border-[var(--color-border)] last:border-b-0 odd:bg-transparent even:bg-[var(--color-surface)] hover:bg-[var(--color-surface-elevated)]"
              >
                <td className="px-3 sm:px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <Building2
                      size={14}
                      className="hidden sm:block text-[var(--color-text-tertiary)]"
                    />
                    <div>
                      <div className="font-medium text-[var(--color-text-primary)]">
                        {project.name}
                      </div>
                      <div className="line-clamp-1 text-xs text-[var(--color-text-tertiary)]">
                        {project.description}
                      </div>
                      {/* Show country inline on mobile */}
                      <div className="text-xs text-[var(--color-text-tertiary)] sm:hidden">
                        {country.flag} {country.name} {project.completionYear ? `· ${project.completionYear}` : ""}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="hidden sm:table-cell px-4 py-2.5 text-[var(--color-text-secondary)]">
                  {country.flag} {country.name}
                </td>
                <td className="px-3 sm:px-4 py-2.5 text-right font-mono text-[var(--color-text-primary)]">
                  {project.valueUsdBn != null ? `$${project.valueUsdBn}B` : "—"}
                </td>
                <td className="px-3 sm:px-4 py-2.5">
                  <span
                    className={`rounded px-1.5 py-0.5 text-[11px] font-medium ${statusColors[project.status] ?? ""}`}
                  >
                    {statusLabels[project.status] ?? project.status}
                  </span>
                </td>
                <td className="hidden sm:table-cell px-4 py-2.5 text-right text-[var(--color-text-secondary)]">
                  {project.completionYear ?? "TBD"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

async function VisionNews() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let visionArticles: any[] = [];

  try {
    const db = getDb();
    visionArticles = await db
      .select({
        id: articles.id,
        title: articles.title,
        url: articles.url,
        sourceName: articles.sourceName,
        country: articles.country,
        publishedAt: articles.publishedAt,
      })
      .from(articles)
      .where(eq(articles.isVision, true))
      .orderBy(desc(articles.publishedAt))
      .limit(5);
  } catch {
    // DB unavailable
  }

  if (visionArticles.length === 0) {
    return (
      <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-center">
        <p className="text-xs text-[var(--color-text-tertiary)]">
          No vision-tagged articles yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {visionArticles.map((article) => {
        const country = countries[article.country as CountryCode];
        return (
          <a
            key={article.id}
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 transition-colors hover:bg-[var(--color-surface-elevated)]"
          >
            <div className="flex items-center gap-3">
              <span className="text-sm">{country.flag}</span>
              <div>
                <p className="line-clamp-1 text-sm font-medium text-[var(--color-text-primary)]">
                  {article.title}
                </p>
                <p className="text-xs text-[var(--color-text-tertiary)]">
                  {article.sourceName} &middot;{" "}
                  {formatDistanceToNow(article.publishedAt, {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </div>
            <ExternalLink
              size={14}
              className="shrink-0 text-[var(--color-text-tertiary)]"
            />
          </a>
        );
      })}
    </div>
  );
}
