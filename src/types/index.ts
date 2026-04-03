export type CountryCode =
  | "uae"
  | "ksa"
  | "qatar"
  | "kuwait"
  | "bahrain"
  | "oman"
  | "egypt"
  | "gcc_wide"
  | "international";

export type SectorCode =
  | "cpg_retail"
  | "family_business"
  | "private_capital"
  | "tech_digital"
  | "energy"
  | "real_estate_construction"
  | "regulation_policy";

export type DealType = "ma" | "ipo" | "pe_vc" | "swf";

export type ProjectStatus = "announced" | "under_construction" | "completed";

export type VisionProgram =
  | "vision_2030_ksa"
  | "we_the_uae_2031"
  | "qatar_2030"
  | "kuwait_2035"
  | "bahrain_2030"
  | "oman_2040"
  | "egypt_2030";

export interface Country {
  code: CountryCode;
  name: string;
  flag: string;
  accentColor: string;
  currency: string;
  exchangeName: string;
  timezone: string;
}

export interface Sector {
  code: SectorCode;
  name: string;
  accentColor: string;
}

export interface MarketQuote {
  symbol: string;
  name: string;
  country: CountryCode;
  price: number;
  change: number;
  changePercent: number;
  previousClose: number;
  stale: boolean;
}

export interface Article {
  id: string;
  url: string;
  title: string;
  description: string | null;
  summary: string | null;
  source: string;
  sourceName: string;
  country: CountryCode;
  sectors: SectorCode[];
  signalScore: number;
  dealType: DealType | null;
  publishedAt: Date;
  createdAt: Date;
  isRegulatory: boolean;
  isVision: boolean;
}

export interface Brief {
  id: string;
  date: string;
  content: string;
  generated: boolean;
  articleIds: string[];
  createdAt: Date;
}

export interface MacroStat {
  country: CountryCode;
  metric: string;
  value: number;
  period: string;
  source: string;
}

export interface Megaproject {
  id: number;
  name: string;
  country: CountryCode;
  valueUsdBn: number | null;
  status: ProjectStatus;
  vision: VisionProgram | null;
  completionYear: number | null;
  description: string | null;
  lastNewsUrl: string | null;
}
