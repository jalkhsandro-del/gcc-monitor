import YahooFinance from "yahoo-finance2";
import { cacheGet, cacheSet } from "@/lib/db/cache";
import { gccIndices, commoditySymbols, fxSymbols } from "./indices";
import type { MarketIndex } from "./indices";

// yahoo-finance2 v2.14+ exports a class, not an instance
const yf = new YahooFinance();

// --- Types ---

export interface QuoteData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  previousClose: number;
  timestamp: string;
}

export interface HistoricalPoint {
  date: string;
  close: number;
}

// --- TTL logic ---

function isMarketHours(): boolean {
  const now = new Date();
  const day = now.getUTCDay(); // 0=Sun
  const hour = now.getUTCHours();
  // GCC markets trade Sun-Thu, roughly 06:00-15:00 UTC
  const isTradingDay = day >= 0 && day <= 4;
  const isTradingHour = hour >= 5 && hour <= 13;
  return isTradingDay && isTradingHour;
}

function getQuoteTtl(): number {
  if (isMarketHours()) return 900; // 15 min
  const now = new Date();
  const day = now.getUTCDay();
  if (day === 5 || day === 6) return 43200; // 12h on Fri/Sat
  return 21600; // 6h off-hours
}

// --- Quote fetching ---

export async function getQuote(symbol: string, name: string): Promise<QuoteData | null> {
  const cacheKey = `market:${symbol}`;
  const cached = await cacheGet<QuoteData>(cacheKey);
  if (cached) return cached;

  try {
    const result = await yf.quote(symbol);
    if (!result || !result.regularMarketPrice) return null;

    const data: QuoteData = {
      symbol,
      name,
      price: result.regularMarketPrice,
      change: result.regularMarketChange ?? 0,
      changePercent: result.regularMarketChangePercent ?? 0,
      previousClose: result.regularMarketPreviousClose ?? result.regularMarketPrice,
      timestamp: new Date().toISOString(),
    };

    await cacheSet(cacheKey, data, getQuoteTtl());
    return data;
  } catch (error) {
    console.error(`Yahoo Finance quote failed for ${symbol}:`, error);
    // Return stale cached data if available (cacheGet already checked, but try expired)
    return null;
  }
}

export async function getAllIndexQuotes(): Promise<QuoteData[]> {
  const results = await Promise.allSettled(
    gccIndices.map((idx) => getQuote(idx.symbol, idx.name))
  );

  return results
    .filter(
      (r): r is PromiseFulfilledResult<QuoteData> =>
        r.status === "fulfilled" && r.value !== null
    )
    .map((r) => r.value);
}

export async function getCommodityQuotes(): Promise<QuoteData[]> {
  const entries = Object.entries(commoditySymbols) as [string, string][];
  const names: Record<string, string> = {
    brentCrude: "Brent Crude",
    wtiCrude: "WTI Crude",
    naturalGas: "Natural Gas",
    wheat: "Wheat",
    sugar: "Sugar",
    corn: "Corn",
    coffee: "Coffee",
    gold: "Gold",
  };

  const results = await Promise.allSettled(
    entries.map(([key, symbol]) => getQuote(symbol, names[key] ?? key))
  );

  return results
    .filter(
      (r): r is PromiseFulfilledResult<QuoteData> =>
        r.status === "fulfilled" && r.value !== null
    )
    .map((r) => r.value);
}

export async function getFxQuotes(): Promise<QuoteData[]> {
  const entries = Object.entries(fxSymbols) as [string, string][];
  const names: Record<string, string> = {
    usdAed: "USD/AED",
    usdSar: "USD/SAR",
    usdQar: "USD/QAR",
    usdKwd: "USD/KWD",
    usdBhd: "USD/BHD",
    usdOmr: "USD/OMR",
    usdEgp: "USD/EGP",
    eurUsd: "EUR/USD",
  };

  const results = await Promise.allSettled(
    entries.map(([key, symbol]) => getQuote(symbol, names[key] ?? key))
  );

  return results
    .filter(
      (r): r is PromiseFulfilledResult<QuoteData> =>
        r.status === "fulfilled" && r.value !== null
    )
    .map((r) => r.value);
}

// --- Historical data (from market_daily table) ---

export async function getHistorical(
  symbol: string,
  days: number = 30
): Promise<HistoricalPoint[]> {
  try {
    const { getDb } = await import("@/lib/db");
    const { marketDaily } = await import("@/lib/db/schema");
    const { desc, eq } = await import("drizzle-orm");

    const db = getDb();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const startStr = startDate.toISOString().split("T")[0];

    const rows = await db
      .select({ date: marketDaily.date, close: marketDaily.close })
      .from(marketDaily)
      .where(
        eq(marketDaily.symbol, symbol)
      )
      .orderBy(desc(marketDaily.date))
      .limit(days);

    return rows
      .filter((r) => r.date >= startStr)
      .reverse()
      .map((r) => ({
        date: r.date,
        close: Number(r.close),
      }));
  } catch (error) {
    console.error(`Historical data fetch failed for ${symbol}:`, error);
    return [];
  }
}

export function getIndexForCountry(country: string): MarketIndex | undefined {
  return gccIndices.find((idx) => idx.country === country);
}
