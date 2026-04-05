"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

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
    <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-bg)]/95 backdrop-blur-sm">
      {/* Top row: logo + search */}
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="font-serif text-lg font-medium tracking-tight text-[var(--color-text-primary)]"
        >
          GCC Monitor
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
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
                  "relative rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "text-[var(--color-text-primary)]"
                    : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-elevated)] hover:text-[var(--color-text-primary)]"
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

        <div className="flex items-center gap-3">
          <Link
            href="/search"
            className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-[var(--color-text-tertiary)] transition-colors hover:bg-[var(--color-surface-elevated)] hover:text-[var(--color-text-secondary)]"
            aria-label="Search"
          >
            <Search size={16} />
            <kbd className="hidden rounded border border-[var(--color-border)] px-1.5 py-0.5 text-[10px] font-mono sm:inline">
              /
            </kbd>
          </Link>
          <span className="hidden text-xs text-[var(--color-text-tertiary)] sm:inline">
            Last updated: —
          </span>
        </div>
      </div>

      {/* Mobile nav — horizontal scroll */}
      <nav className="hide-scrollbar flex gap-1 overflow-x-auto border-t border-[var(--color-border)] px-4 md:hidden">
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
                "relative shrink-0 px-3 py-2.5 text-xs font-medium transition-colors",
                isActive
                  ? "text-[var(--color-text-primary)]"
                  : "text-[var(--color-text-secondary)]"
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
    </header>
  );
}
