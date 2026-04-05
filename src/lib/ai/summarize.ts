import Anthropic from "@anthropic-ai/sdk";

const getClient = (() => {
  let client: Anthropic | null = null;
  return () => {
    if (!client) {
      const apiKey = process.env.ANTHROPIC_API_KEY;
      if (!apiKey) throw new Error("ANTHROPIC_API_KEY is not set");
      client = new Anthropic({ apiKey });
    }
    return client;
  };
})();

const MODEL = "claude-sonnet-4-20250514";

// --- Article summaries (batch up to 10) ---

interface ArticleForSummary {
  id: string;
  title: string;
  description: string | null;
  source: string;
}

interface SummaryResult {
  id: string;
  summary: string;
}

export async function summarizeArticles(
  articles: ArticleForSummary[]
): Promise<SummaryResult[]> {
  if (articles.length === 0) return [];

  const client = getClient();

  const articlesText = articles
    .map(
      (a, i) =>
        `[${i + 1}] Title: ${a.title}\nSource: ${a.source}\nText: ${a.description ?? "(no description)"}`
    )
    .join("\n\n---\n\n");

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 300 * articles.length,
    messages: [
      {
        role: "user",
        content: `Summarize each of the following news articles in 2-3 sentences for a management consultant working in the GCC. Focus on: business impact, strategic implications, and relevance to CPG, family businesses, private capital, or tech sectors. Be specific about numbers and names.

Return your response as a JSON array of objects with "index" (1-based) and "summary" fields. Return ONLY the JSON array, no other text.

${articlesText}`,
      },
    ],
  });

  try {
    const text =
      response.content[0].type === "text" ? response.content[0].text : "";
    // Extract JSON from the response (handle markdown code blocks)
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) return [];

    const parsed = JSON.parse(jsonMatch[0]) as { index: number; summary: string }[];

    return parsed
      .filter((p) => p.index >= 1 && p.index <= articles.length)
      .map((p) => ({
        id: articles[p.index - 1].id,
        summary: p.summary,
      }));
  } catch (error) {
    console.error("Failed to parse summary response:", error);
    return [];
  }
}

// --- Morning brief ---

interface ArticleForBrief {
  title: string;
  summary: string | null;
  description: string | null;
  source: string;
  country: string;
  sectors: string[];
  signalScore: number;
}

export async function generateMorningBrief(
  articles: ArticleForBrief[]
): Promise<string> {
  const client = getClient();

  const articlesJson = JSON.stringify(
    articles.map((a) => ({
      title: a.title,
      summary: a.summary ?? a.description,
      source: a.source,
      country: a.country,
      sectors: a.sectors,
      signal_score: a.signalScore,
    })),
    null,
    2
  );

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 1500,
    messages: [
      {
        role: "user",
        content: `You are writing a daily intelligence brief for a senior McKinsey consultant based in Dubai. The consultant works with clients in CPG, family-owned businesses, private capital (SWFs, PE, VC), and tech across the GCC.

Here are today's top articles:
${articlesJson}

Write a 3-4 paragraph morning brief that:
1. Opens with the single most important development and why it matters
2. Groups related stories into themes (don't just list articles)
3. Highlights specific implications for the consultant's four client sectors
4. Closes with 1-2 things to watch this week
5. Uses specific names, numbers, and facts — not vague summaries

Tone: crisp, confident, analytical. Like a senior partner's Monday morning email.`,
      },
    ],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";
  return text;
}
