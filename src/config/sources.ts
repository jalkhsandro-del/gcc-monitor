export interface NewsSource {
  id: string;
  name: string;
  rssUrl: string;
  tier: 1 | 2 | 3;
  coverage: string;
}

export const newsSources: NewsSource[] = [
  // Tier 1
  {
    id: "agbi",
    name: "AGBI",
    rssUrl: "https://www.agbi.com/feed/",
    tier: 1,
    coverage: "GCC business analysis, SWF, energy, finance",
  },
  {
    id: "arabian_business",
    name: "Arabian Business",
    rssUrl: "https://www.arabianbusiness.com/rss",
    tier: 1,
    coverage: "Broad GCC business, rankings, leadership",
  },
  {
    id: "zawya",
    name: "Zawya",
    rssUrl: "https://www.zawya.com/sitemaps/en/rss",
    tier: 1,
    coverage: "Financial news, M&A, market data",
  },
  {
    id: "gulf_business",
    name: "Gulf Business",
    rssUrl: "https://gulfbusiness.com/feed/",
    tier: 1,
    coverage: "UAE-focused business, real estate, banking",
  },
  {
    id: "arab_news",
    name: "Arab News",
    rssUrl: "https://www.arabnews.com/rss.xml",
    tier: 1,
    coverage: "Saudi-focused news, policy, economy",
  },
  {
    id: "the_national",
    name: "The National",
    rssUrl: "https://www.thenationalnews.com/rss/business.xml",
    tier: 1,
    coverage: "UAE quality reporting, analysis",
  },
  // Tier 2
  {
    id: "argaam",
    name: "Argaam",
    rssUrl: "https://www.argaam.com/en/rss/articles",
    tier: 2,
    coverage: "Saudi financial markets, stock analysis",
  },
  {
    id: "trade_arabia",
    name: "TradeArabia",
    rssUrl: "https://www.tradearabia.com/rss/all.xml",
    tier: 2,
    coverage: "GCC trade, construction, tourism",
  },
  {
    id: "gulf_news",
    name: "Gulf News",
    rssUrl: "https://gulfnews.com/rss/business",
    tier: 2,
    coverage: "UAE daily business, banking, real estate",
  },
  {
    id: "wamda",
    name: "Wamda",
    rssUrl: "https://www.wamda.com/rss",
    tier: 2,
    coverage: "MENA tech, startups, venture capital",
  },
  {
    id: "al_monitor",
    name: "Al-Monitor",
    rssUrl: "https://www.al-monitor.com/rss",
    tier: 2,
    coverage: "GCC geopolitics, policy, diplomacy",
  },
  // Tier 3
  {
    id: "construction_week",
    name: "Construction Week",
    rssUrl: "https://www.constructionweekonline.com/rss",
    tier: 3,
    coverage: "GCC construction and infrastructure",
  },
  {
    id: "middle_east_eye",
    name: "Middle East Eye",
    rssUrl: "https://www.middleeasteye.net/rss",
    tier: 3,
    coverage: "Geopolitical analysis",
  },
];
