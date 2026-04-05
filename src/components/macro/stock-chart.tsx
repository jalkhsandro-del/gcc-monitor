"use client";

import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils";
import type { HistoricalPoint } from "@/lib/market/yahoo";

interface StockChartProps {
  data: HistoricalPoint[];
}

const ranges = [
  { label: "7D", days: 7 },
  { label: "30D", days: 30 },
  { label: "90D", days: 90 },
] as const;

export function StockChart({ data }: StockChartProps) {
  const [range, setRange] = useState<number>(30);

  const filtered = data.slice(-range);
  const isPositive =
    filtered.length >= 2
      ? filtered[filtered.length - 1].close >= filtered[0].close
      : true;
  const color = isPositive ? "var(--color-positive)" : "var(--color-negative)";

  if (filtered.length < 2) {
    return (
      <div className="flex h-48 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]">
        <p className="text-sm text-[var(--color-text-tertiary)]">
          No chart data available
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs text-[var(--color-text-tertiary)]">
          Price History
        </span>
        <div className="flex gap-1">
          {ranges.map((r) => (
            <button
              key={r.label}
              onClick={() => setRange(r.days)}
              className={cn(
                "rounded px-2 py-0.5 text-xs font-medium transition-colors",
                range === r.days
                  ? "bg-[var(--color-surface-elevated)] text-[var(--color-text-primary)]"
                  : "text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)]"
              )}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={filtered}>
          <defs>
            <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.2} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: "var(--color-text-tertiary)" }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(d: string) => {
              const date = new Date(d);
              return `${date.getDate()}/${date.getMonth() + 1}`;
            }}
            minTickGap={40}
          />
          <YAxis
            domain={["auto", "auto"]}
            tick={{ fontSize: 10, fill: "var(--color-text-tertiary)" }}
            tickLine={false}
            axisLine={false}
            width={60}
            tickFormatter={(v: number) => v.toLocaleString()}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--color-surface-elevated)",
              border: "1px solid var(--color-border)",
              borderRadius: "6px",
              fontSize: "12px",
              color: "var(--color-text-primary)",
            }}
            formatter={(value: number) => [value.toLocaleString(), "Close"]}
            labelFormatter={(label: string) => label}
          />
          <Area
            type="monotone"
            dataKey="close"
            stroke={color}
            strokeWidth={2}
            fill="url(#chartGrad)"
            dot={false}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
