import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { marketDaily } from "@/lib/db/schema";
import { getAllIndexQuotes, getCommodityQuotes, getFxQuotes } from "@/lib/market/yahoo";
import { gccIndices } from "@/lib/market/indices";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (
    process.env.CRON_SECRET &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [indices, commodities, fx] = await Promise.allSettled([
      getAllIndexQuotes(),
      getCommodityQuotes(),
      getFxQuotes(),
    ]);

    const indexResults =
      indices.status === "fulfilled" ? indices.value : [];
    const commodityResults =
      commodities.status === "fulfilled" ? commodities.value : [];
    const fxResults =
      fx.status === "fulfilled" ? fx.value : [];

    // Archive daily closes to market_daily if near market close
    const now = new Date();
    const utcHour = now.getUTCHours();
    // GCC markets close between 09:00-12:00 UTC — archive around 13:00 UTC
    if (utcHour >= 12 && utcHour <= 14) {
      await archiveDailyCloses(indexResults);
    }

    return NextResponse.json({
      success: true,
      indices: indexResults.length,
      commodities: commodityResults.length,
      fx: fxResults.length,
    });
  } catch (error) {
    console.error("Markets cron failed:", error);
    return NextResponse.json(
      { error: "Market data refresh failed", details: String(error) },
      { status: 500 }
    );
  }
}

async function archiveDailyCloses(
  quotes: Awaited<ReturnType<typeof getAllIndexQuotes>>
) {
  if (quotes.length === 0) return;

  const db = getDb();
  const today = new Date().toISOString().split("T")[0];

  for (const quote of quotes) {
    const idx = gccIndices.find((i) => i.symbol === quote.symbol);
    if (!idx) continue;

    try {
      await db
        .insert(marketDaily)
        .values({
          symbol: quote.symbol,
          date: today,
          close: String(quote.price),
          changePct: String(quote.changePercent),
        })
        .onConflictDoNothing();
    } catch (error) {
      console.error(`Failed to archive ${quote.symbol}:`, error);
    }
  }
}
