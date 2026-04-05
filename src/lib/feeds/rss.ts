import Parser from "rss-parser";
import type { NewsSource } from "@/config/sources";

const parser = new Parser({
  timeout: 10_000,
  headers: {
    Accept: "application/rss+xml, application/xml, text/xml",
  },
});

export interface RawFeedItem {
  title: string;
  link: string;
  description: string | null;
  pubDate: Date;
  source: NewsSource;
}

export async function fetchFeed(source: NewsSource): Promise<RawFeedItem[]> {
  try {
    const feed = await parser.parseURL(source.rssUrl);

    return (feed.items ?? [])
      .filter((item) => item.title && item.link)
      .map((item) => ({
        title: stripHtml(item.title!),
        link: item.link!,
        description: item.contentSnippet
          ? stripHtml(item.contentSnippet)
          : item.content
            ? stripHtml(item.content)
            : null,
        pubDate: item.pubDate ? new Date(item.pubDate) : new Date(),
        source,
      }));
  } catch (error) {
    console.error(`Failed to fetch feed ${source.id}:`, error);
    return [];
  }
}

export async function fetchAllFeeds(
  sources: NewsSource[]
): Promise<RawFeedItem[]> {
  const results = await Promise.allSettled(sources.map(fetchFeed));

  return results.flatMap((result) =>
    result.status === "fulfilled" ? result.value : []
  );
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
