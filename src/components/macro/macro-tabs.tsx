"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { countries, gccCountryCodes } from "@/config/countries";

const tabs: { code: string; label: string }[] = [
  { code: "all", label: "All GCC" },
  ...gccCountryCodes.map((c) => ({
    code: c,
    label: `${countries[c].flag} ${countries[c].name}`,
  })),
];

export function MacroTabs() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const active = searchParams.get("country") ?? "all";

  return (
    <div className="hide-scrollbar flex gap-1 overflow-x-auto pb-1">
      {tabs.map((tab) => (
        <button
          key={tab.code}
          onClick={() => {
            const params = new URLSearchParams();
            if (tab.code !== "all") params.set("country", tab.code);
            router.push(`/macro?${params.toString()}`);
          }}
          className={cn(
            "relative shrink-0 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
            active === tab.code
              ? "bg-[var(--color-surface-elevated)] text-[var(--color-text-primary)]"
              : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-elevated)]/60 hover:text-[var(--color-text-primary)]"
          )}
        >
          {tab.label}
          {active === tab.code && (
            <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-blue-500" />
          )}
        </button>
      ))}
    </div>
  );
}
