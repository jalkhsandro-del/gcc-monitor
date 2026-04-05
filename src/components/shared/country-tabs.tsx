"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { countries, gccCountryCodes } from "@/config/countries";

interface CountryTabsProps {
  basePath: string;
}

export function CountryTabs({ basePath }: CountryTabsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const active = searchParams.get("country") ?? "all";

  return (
    <div className="hide-scrollbar flex gap-1 overflow-x-auto pb-1">
      <TabButton
        label="All"
        active={active === "all"}
        onClick={() => router.push(basePath)}
      />
      {gccCountryCodes.map((code) => (
        <TabButton
          key={code}
          label={`${countries[code].flag} ${countries[code].name}`}
          active={active === code}
          onClick={() => router.push(`${basePath}?country=${code}`)}
        />
      ))}
    </div>
  );
}

function TabButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative shrink-0 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
        active
          ? "bg-[var(--color-surface-elevated)] text-[var(--color-text-primary)]"
          : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-elevated)]/60 hover:text-[var(--color-text-primary)]"
      )}
    >
      {label}
      {active && (
        <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-blue-500" />
      )}
    </button>
  );
}
