import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { articles, briefs } from "@/lib/db/schema";
import { generateMorningBrief } from "@/lib/ai/summarize";
import { desc, gte } from "drizzle-orm";

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
    const db = getDb();
    const today = new Date().toISOString().split("T")[0];

    // Get top 20 articles from last 24 hours by signal_score
    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const topArticles = await db
      .select({
        id: articles.id,
        title: articles.title,
        summary: articles.summary,
        description: articles.description,
        sourceName: articles.sourceName,
        country: articles.country,
        sectors: articles.sectors,
        signalScore: articles.signalScore,
      })
      .from(articles)
      .where(gte(articles.publishedAt, cutoff))
      .orderBy(desc(articles.signalScore), desc(articles.publishedAt))
      .limit(20);

    if (topArticles.length === 0) {
      return NextResponse.json({
        success: false,
        reason: "No articles from last 24 hours",
      });
    }

    let content: string;
    let generated = true;

    if (!process.env.ANTHROPIC_API_KEY) {
      // Fallback: assemble from top article summaries
      content = topArticles
        .slice(0, 5)
        .map(
          (a) =>
            `**${a.title}** (${a.sourceName})\n${a.summary ?? a.description ?? ""}`
        )
        .join("\n\n");
      generated = false;
    } else {
      try {
        content = await generateMorningBrief(
          topArticles.map((a) => ({
            title: a.title,
            summary: a.summary,
            description: a.description,
            source: a.sourceName,
            country: a.country,
            sectors: a.sectors as string[],
            signalScore: a.signalScore,
          }))
        );
      } catch (error) {
        console.error("Morning brief generation failed:", error);
        // Fallback
        content = topArticles
          .slice(0, 5)
          .map(
            (a) =>
              `**${a.title}** (${a.sourceName})\n${a.summary ?? a.description ?? ""}`
          )
          .join("\n\n");
        generated = false;
      }
    }

    // Upsert brief for today
    await db
      .insert(briefs)
      .values({
        date: today,
        content,
        generated,
        articleIds: topArticles.map((a) => a.id),
      })
      .onConflictDoUpdate({
        target: briefs.date,
        set: {
          content,
          generated,
          articleIds: topArticles.map((a) => a.id),
        },
      });

    return NextResponse.json({
      success: true,
      date: today,
      generated,
      articlesUsed: topArticles.length,
    });
  } catch (error) {
    console.error("Brief cron failed:", error);
    return NextResponse.json(
      { error: "Brief generation failed", details: String(error) },
      { status: 500 }
    );
  }
}
