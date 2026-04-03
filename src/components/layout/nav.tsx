"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/macro", label: "Macro" },
  { href: "/news", label: "News" },
  { href: "/deals", label: "Deals" },
  { href: "/regulatory", label: "Regulatory" },
  { href: "/vision", label: "Vision" },
] as const;

export function Nav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 h-14 border-b border-[var(--color-border)] bg-[var(--color-bg)]/95 backdrop-blur-sm">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="font-serif text-lg font-medium tracking-tight text-[var(--color-text-primary)]"
        >
          GCC Monitor
        </Link>

        <nav className="flex items-center gap-1">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "text-[var(--color-text-primary)]"
                    : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                )}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-blue-500" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="text-xs text-[var(--color-text-tertiary)]">
          <span className="hidden sm:inline">Last updated: —</span>
        </div>
      </div>
    </header>
  );
}
