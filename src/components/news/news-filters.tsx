"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { cn } from "@/lib/utils";
import { sectors } from "@/config/sectors";
import { gccCountryCodes } from "@/config/countries";
import { countries } from "@/config/countries";
import type { SectorCode, CountryCode } from "@/types";

const sectorTabs: { code: SectorCode | "all"; label: string }[] = [
  { code: "all", label: "All" },
  ...Object.values(sectors).map((s) => ({ code: s.code, label: s.name })),
];

export function NewsFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeSector = (searchParams.get("sector") as SectorCode) ?? "all";
  const activeCountry = (searchParams.get("country") as CountryCode) ?? "all";

  const updateParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === "all") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
      router.push(`/news?${params.toString()}`);
    },
    [router, searchParams]
  );

  return (
    <div className="space-y-3">
      {/* Sector tabs */}
      <div className="hide-scrollbar flex gap-1 overflow-x-auto pb-1">
        {sectorTabs.map((tab) => (
          <button
            key={tab.code}
            onClick={() => updateParams("sector", tab.code)}
            className={cn(
              "relative shrink-0 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              activeSector === tab.code
                ? "bg-[var(--color-surface-elevated)] text-[var(--color-text-primary)]"
                : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-elevated)]/60 hover:text-[var(--color-text-primary)]"
            )}
          >
            {tab.label}
            {activeSector === tab.code && (
              <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-blue-500" />
            )}
          </button>
        ))}
      </div>

      {/* Country filter + sort */}
      <div className="flex items-center gap-3">
        <label className="text-xs text-[var(--color-text-tertiary)]">
          Country:
        </label>
        <select
          value={activeCountry}
          onChange={(e) => updateParams("country", e.target.value)}
          className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-1 text-sm text-[var(--color-text-primary)] outline-none focus:border-blue-500"
        >
          <option value="all">All</option>
          {gccCountryCodes.map((code) => (
            <option key={code} value={code}>
              {countries[code].flag} {countries[code].name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
