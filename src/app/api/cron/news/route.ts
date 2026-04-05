import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { articles } from "@/lib/db/schema";
import { getActiveFeeds } from "@/config/sources";
import { fetchAllFeeds } from "@/lib/feeds/rss";
import { classifyArticle } from "@/lib/feeds/classifier";
import { summarizeArticles } from "@/lib/ai/summarize";
import { eq, isNull, desc } from "drizzle-orm";

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
    const sources = getActiveFeeds();
    const rawItems = await fetchAllFeeds(sources);

    let inserted = 0;
    let skipped = 0;
    const newArticleIds: string[] = [];

    for (const item of rawItems) {
      // Dedup by URL
      const existing = await db
        .select({ id: articles.id })
        .from(articles)
        .where(eq(articles.url, item.link))
        .limit(1);

      if (existing.length > 0) {
        skipped++;
        continue;
      }

      // Classify
      const classification = classifyArticle(
        item.title,
        item.description,
        item.source
      );

      // Store
      const [row] = await db
        .insert(articles)
        .values({
          url: item.link,
          title: item.title,
          description: item.description,
          source: item.source.id,
          sourceName: item.source.name,
          country: classification.country,
          sectors: classification.sectors,
          signalScore: classification.signalScore,
          dealType: classification.dealType,
          publishedAt: item.pubDate,
          isRegulatory: classification.isRegulatory,
          isVision: classification.isVision,
        })
        .returning({ id: articles.id });

      newArticleIds.push(row.id);
      inserted++;
    }

    // Batch summarize unsummarized articles (up to 10 at a time)
    let summarized = 0;
    if (process.env.ANTHROPIC_API_KEY) {
      summarized = await summarizeUnsummarized(db);
    }

    return NextResponse.json({
      success: true,
      fetched: rawItems.length,
      inserted,
      skipped,
      summarized,
      sources: sources.map((s) => s.id),
    });
  } catch (error) {
    console.error("News cron failed:", error);
    return NextResponse.json(
      { error: "News ingestion failed", details: String(error) },
      { status: 500 }
    );
  }
}

async function summarizeUnsummarized(
  db: ReturnType<typeof getDb>
): Promise<number> {
  // Get up to 10 articles without summaries
  const unsummarized = await db
    .select({
      id: articles.id,
      title: articles.title,
      description: articles.description,
      source: articles.sourceName,
    })
    .from(articles)
    .where(isNull(articles.summary))
    .orderBy(desc(articles.publishedAt))
    .limit(10);

  if (unsummarized.length === 0) return 0;

  try {
    const results = await summarizeArticles(
      unsummarized.map((a) => ({
        id: a.id,
        title: a.title,
        description: a.description,
        source: a.source,
      }))
    );

    for (const result of results) {
      await db
        .update(articles)
        .set({ summary: result.summary })
        .where(eq(articles.id, result.id));
    }

    return results.length;
  } catch (error) {
    console.error("Summarization failed:", error);
    return 0;
  }
}
