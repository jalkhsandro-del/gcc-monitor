"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { cn } from "@/lib/utils";
import { countries, gccCountryCodes } from "@/config/countries";
import type { DealType } from "@/types";

const dealTabs: { code: DealType | "all"; label: string }[] = [
  { code: "all", label: "All" },
  { code: "ma", label: "M&A" },
  { code: "ipo", label: "IPO" },
  { code: "pe_vc", label: "PE/VC" },
  { code: "swf", label: "SWF" },
];

export function DealFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeType = searchParams.get("type") ?? "all";
  const activeCountry = searchParams.get("country") ?? "all";

  const updateParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === "all") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
      router.push(`/deals?${params.toString()}`);
    },
    [router, searchParams]
  );

  return (
    <div className="space-y-3">
      <div className="hide-scrollbar flex gap-1 overflow-x-auto pb-1">
        {dealTabs.map((tab) => (
          <button
            key={tab.code}
            onClick={() => updateParams("type", tab.code)}
            className={cn(
              "relative shrink-0 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              activeType === tab.code
                ? "bg-[var(--color-surface-elevated)] text-[var(--color-text-primary)]"
                : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-elevated)]/60 hover:text-[var(--color-text-primary)]"
            )}
          >
            {tab.label}
            {activeType === tab.code && (
              <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-blue-500" />
            )}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <label className="text-xs text-[var(--color-text-tertiary)]">Country:</label>
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
