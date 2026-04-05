import type { CountryCode, SectorCode, DealType } from "@/types";
import type { NewsSource } from "@/config/sources";

export interface ClassificationResult {
  country: CountryCode;
  sectors: SectorCode[];
  signalScore: number;
  isRegulatory: boolean;
  isVision: boolean;
  dealType: DealType | null;
}

// --- Sector keyword dictionaries ---

const sectorKeywords: Record<SectorCode, { companies: string[]; keywords: string[] }> = {
  cpg_retail: {
    companies: [
      "agthia", "almarai", "danone", "pepsico", "nestle", "unilever",
      "p&g", "mars", "mondelez", "americana", "brf", "savola", "iffco",
      "al islami foods", "national food products", "lulu group", "carrefour",
      "spinneys", "choithrams",
    ],
    keywords: [
      "fmcg", "consumer goods", "retail", "supermarket", "grocery",
      "food & beverage", "food and beverage", "dairy", "snacks", "beverages",
      "packaging", "supply chain", "consumer spending", "retail sales",
      "e-commerce grocery", "quick commerce", "private label",
    ],
  },
  family_business: {
    companies: [
      "majid al futtaim", "dubai holding", "al futtaim group", "al shaya",
      "chalhoub group", "azadea", "al ghurair", "olayan group", "al rajhi",
      "binladin group", "al habtoor", "landmark group", "apparel group",
      "al tayer", "galadari", "kanoo", "al gosaibi", "zamil group",
      "al muhaidib", "sedco holding",
    ],
    keywords: [
      "family office", "succession", "next generation", "conglomerate",
      "diversification", "group restructuring", "family governance",
      "holding company", "family business", "generational transfer",
    ],
  },
  private_capital: {
    companies: [
      "pif", "public investment fund", "adia", "mubadala", "adq",
      "qia", "qatar investment authority", "kia", "kuwait investment authority",
      "oia", "oman investment authority", "mumtalakat", "investcorp",
      "gulf capital", "wamda capital", "stv", "beco capital",
      "500 global", "algebra ventures",
    ],
    keywords: [
      "sovereign wealth fund", "swf", "private equity", "venture capital",
      "asset management", "fund raise", "aum", "portfolio company",
      "co-invest", "exit", "ipo pipeline", "spac", "direct investment",
      "alternative assets", "pension fund", "endowment",
    ],
  },
  tech_digital: {
    companies: [
      "careem", "tabby", "tamara", "kitopi", "noon", "talabat",
      "anghami", "telfaz", "lean technologies", "foodics", "salla",
      "zid", "hala", "pure harvest", "iyris",
    ],
    keywords: [
      "startup", "fintech", "e-commerce", "saas", "cloud",
      "artificial intelligence", "digital transformation", "smart city",
      "proptech", "edtech", "healthtech", "blockchain", "crypto",
      "digital payments", "cybersecurity",
    ],
  },
  energy: {
    companies: [
      "adnoc", "saudi aramco", "aramco", "qatarenergy", "kpc", "bapco", "pdo",
    ],
    keywords: [
      "oil", "gas", "opec", "crude", "brent", "refinery", "petrochemical",
      "lng", "renewable", "solar", "hydrogen", "green energy",
      "carbon capture", "wind farm", "electric vehicle",
    ],
  },
  real_estate_construction: {
    companies: [
      "emaar", "damac", "aldar", "nakheel", "neom",
    ],
    keywords: [
      "real estate", "property", "construction", "megaproject",
      "master developer", "the line", "red sea", "lusail", "tower",
      "residential", "commercial", "hospitality", "hotel", "mixed-use",
      "infrastructure", "rail", "metro", "airport",
    ],
  },
  regulation_policy: {
    companies: [],
    keywords: [
      "regulation", "law", "decree", "policy", "tax", "vat",
      "corporate tax", "customs", "labor law", "nitaqat", "saudization",
      "emiratization", "free zone", "difc", "adgm", "qfc",
      "central bank", "cma", "sca", "monetary policy", "interest rate",
      "compliance", "governance", "data protection", "pdpl",
    ],
  },
};

// --- Country keyword dictionaries ---

const countryKeywords: Record<Exclude<CountryCode, "gcc_wide" | "international">, string[]> = {
  uae: [
    "dubai", "abu dhabi", "sharjah", "difc", "adgm", "dfm", "adx",
    "dewa", "etisalat", "du", "emirates airline", "uae",
  ],
  ksa: [
    "riyadh", "jeddah", "neom", "pif", "tadawul", "vision 2030",
    "saudi aramco", "stc", "acwa power", "saudi", "ksa",
  ],
  qatar: [
    "doha", "lusail", "qia", "qatarenergy", "qatar airways", "qse",
    "ooredoo", "qatar",
  ],
  kuwait: [
    "kuwait city", "kia", "kpc", "boursa kuwait", "zain", "nbk",
    "agility", "kuwait",
  ],
  bahrain: [
    "manama", "mumtalakat", "bapco", "bahrain bourse", "edb",
    "aluminium bahrain", "bahrain",
  ],
  oman: [
    "muscat", "oia", "pdo", "msm", "omantel", "bank muscat", "oman",
  ],
  egypt: [
    "cairo", "egx", "nbe", "banque misr", "cib", "orascom",
    "suez canal", "new administrative capital", "egypt",
  ],
};

// --- Deal type keywords ---

const dealKeywords: Record<DealType, string[]> = {
  ma: ["acquisition", "acquire", "merger", "takeover", "buyout", "merge"],
  ipo: ["ipo", "initial public offering", "listing", "public offering", "go public"],
  pe_vc: ["funding round", "series a", "series b", "series c", "seed round", "venture", "growth equity"],
  swf: ["sovereign wealth", "pif invest", "adia invest", "mubadala invest", "qia invest"],
};

// --- Vision keywords ---

const visionKeywords = [
  "vision 2030", "vision 2040", "we the uae", "new kuwait",
  "bahrain 2030", "qatar 2030", "egypt 2030", "megaproject",
  "giga-project", "gigaproject", "national transformation",
];

// --- Classifier ---

export function classifyArticle(
  title: string,
  description: string | null,
  source: NewsSource
): ClassificationResult {
  const text = `${title} ${description ?? ""}`.toLowerCase();

  const sectors = classifySectors(text);
  const country = classifyCountry(text, source);
  const dealType = classifyDealType(text);
  const isRegulatory = sectors.includes("regulation_policy");
  const isVision = visionKeywords.some((kw) => text.includes(kw));
  const signalScore = calculateSignalScore(text, sectors, source.tier, dealType);

  return { country, sectors, signalScore, isRegulatory, isVision, dealType };
}

function classifySectors(text: string): SectorCode[] {
  const matched: SectorCode[] = [];

  for (const [sector, { companies, keywords }] of Object.entries(sectorKeywords)) {
    const hasCompany = companies.some((c) => text.includes(c));
    const keywordHits = keywords.filter((kw) => text.includes(kw)).length;

    if (hasCompany || keywordHits >= 2) {
      matched.push(sector as SectorCode);
    }
  }

  return matched.length > 0 ? matched : ["tech_digital" as SectorCode];
}

function classifyCountry(text: string, source: NewsSource): CountryCode {
  const scores: Partial<Record<CountryCode, number>> = {};

  for (const [country, keywords] of Object.entries(countryKeywords)) {
    const hits = keywords.filter((kw) => text.includes(kw)).length;
    if (hits > 0) {
      scores[country as CountryCode] = hits;
    }
  }

  // Check for gcc_wide: 3+ countries mentioned
  const countriesMentioned = Object.keys(scores).length;
  if (countriesMentioned >= 3) {
    return "gcc_wide";
  }

  // Highest scoring country wins
  const sorted = Object.entries(scores).sort(([, a], [, b]) => b - a);
  if (sorted.length > 0) {
    return sorted[0][0] as CountryCode;
  }

  // Fall back to source default
  return source.defaultCountry ?? "gcc_wide";
}

function classifyDealType(text: string): DealType | null {
  for (const [type, keywords] of Object.entries(dealKeywords)) {
    if (keywords.some((kw) => text.includes(kw))) {
      return type as DealType;
    }
  }
  return null;
}

function calculateSignalScore(
  text: string,
  sectors: SectorCode[],
  tier: 1 | 2 | 3,
  dealType: DealType | null
): number {
  let score = 2; // baseline

  // Tier bonus
  if (tier === 1) score += 1;

  // Deal mention bumps score
  if (dealType) score += 1;

  // Core consulting sectors get a bump
  const coreSectors: SectorCode[] = [
    "cpg_retail",
    "family_business",
    "private_capital",
    "tech_digital",
  ];
  if (sectors.some((s) => coreSectors.includes(s))) {
    score += 1;
  }

  // Large numbers suggest material deals
  const hasBigNumber = /\$\d+\s*(?:billion|bn|b)\b/i.test(text) ||
    /\$\d{3,}\s*(?:million|mn|m)\b/i.test(text);
  if (hasBigNumber) score += 1;

  return Math.min(score, 5);
}
