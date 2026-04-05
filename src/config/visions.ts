import type { CountryCode, VisionProgram } from "@/types";

export interface NationalVision {
  code: VisionProgram;
  name: string;
  country: CountryCode;
  targetYear: number;
  keyTargets: string[];
}

export const nationalVisions: NationalVision[] = [
  {
    code: "vision_2030_ksa",
    name: "Saudi Vision 2030",
    country: "ksa",
    targetYear: 2030,
    keyTargets: [
      "Reduce oil dependency to 50% of GDP",
      "Increase non-oil revenue to SAR 1 trillion",
      "Raise PIF assets to $2 trillion",
      "Attract 100M tourist visits/year",
      "Increase women workforce to 30%",
    ],
  },
  {
    code: "we_the_uae_2031",
    name: "We the UAE 2031",
    country: "uae",
    targetYear: 2031,
    keyTargets: [
      "Double GDP to AED 3 trillion",
      "Increase non-oil exports to AED 800B",
      "Attract AED 550B in FDI",
      "Grow tourism to 40M visitors",
      "Position among top 10 global economies",
    ],
  },
  {
    code: "qatar_2030",
    name: "Qatar National Vision 2030",
    country: "qatar",
    targetYear: 2030,
    keyTargets: [
      "Diversify economy beyond hydrocarbons",
      "World-class healthcare & education",
      "Sustainable development",
      "FIFA World Cup legacy infrastructure",
      "Knowledge-based economy",
    ],
  },
  {
    code: "kuwait_2035",
    name: "New Kuwait 2035",
    country: "kuwait",
    targetYear: 2035,
    keyTargets: [
      "Transform into financial & trade hub",
      "Develop Silk City (Madinat al-Hareer)",
      "Privatize state-owned enterprises",
      "Reduce public sector employment",
      "Increase private sector GDP share to 60%",
    ],
  },
  {
    code: "bahrain_2030",
    name: "Bahrain Vision 2030",
    country: "bahrain",
    targetYear: 2030,
    keyTargets: [
      "Diversify from oil to services",
      "Grow fintech & financial services hub",
      "Double tourism arrivals",
      "Improve government efficiency",
      "Sustainable & competitive economy",
    ],
  },
  {
    code: "oman_2040",
    name: "Oman Vision 2040",
    country: "oman",
    targetYear: 2040,
    keyTargets: [
      "Increase non-oil GDP to 90%",
      "Grow manufacturing sector",
      "Attract $20B+ in FDI",
      "Become logistics hub (Duqm port)",
      "Green hydrogen production leader",
    ],
  },
  {
    code: "egypt_2030",
    name: "Egypt Vision 2030",
    country: "egypt",
    targetYear: 2030,
    keyTargets: [
      "New Administrative Capital development",
      "Grow GDP to $500B+",
      "Suez Canal Economic Zone expansion",
      "Renewable energy 42% of mix",
      "Digital transformation programs",
    ],
  },
];

export interface MegaprojectData {
  name: string;
  country: CountryCode;
  valueUsdBn: number | null;
  status: "announced" | "under_construction" | "completed";
  completionYear: number | null;
  description: string;
}

export const megaprojectsData: MegaprojectData[] = [
  // KSA
  { name: "NEOM / The Line", country: "ksa", valueUsdBn: 500, status: "under_construction", completionYear: 2039, description: "170km linear city in Tabuk province" },
  { name: "Red Sea Global", country: "ksa", valueUsdBn: 10, status: "under_construction", completionYear: 2030, description: "Luxury tourism across 90+ islands" },
  { name: "Diriyah Gate", country: "ksa", valueUsdBn: 17, status: "under_construction", completionYear: 2027, description: "Heritage & culture destination in Riyadh" },
  { name: "Qiddiya", country: "ksa", valueUsdBn: 8, status: "under_construction", completionYear: 2030, description: "Entertainment mega-city south of Riyadh" },
  { name: "Jeddah Tower", country: "ksa", valueUsdBn: 1.4, status: "under_construction", completionYear: 2028, description: "1km+ supertall skyscraper" },
  // UAE
  { name: "Masdar City", country: "uae", valueUsdBn: 22, status: "under_construction", completionYear: 2030, description: "Sustainable city in Abu Dhabi" },
  { name: "Saadiyat Island Cultural District", country: "uae", valueUsdBn: 27, status: "under_construction", completionYear: 2025, description: "Louvre, Guggenheim, Zayed National Museum" },
  { name: "Etihad Rail", country: "uae", valueUsdBn: 11, status: "under_construction", completionYear: 2030, description: "National rail network connecting Emirates" },
  { name: "Dubai Creek Tower", country: "uae", valueUsdBn: 1, status: "announced", completionYear: null, description: "Observation tower in Dubai Creek Harbour" },
  // Qatar
  { name: "Lusail City", country: "qatar", valueUsdBn: 45, status: "under_construction", completionYear: 2030, description: "New planned city north of Doha" },
  { name: "FIFA Legacy Projects", country: "qatar", valueUsdBn: 6.5, status: "completed", completionYear: 2022, description: "Stadiums & infrastructure repurposed post-World Cup" },
  // Kuwait
  { name: "Silk City (Madinat al-Hareer)", country: "kuwait", valueUsdBn: 86, status: "announced", completionYear: 2035, description: "New city on Subiya peninsula with Burj Mubarak" },
  { name: "South Sabah Al-Ahmad City", country: "kuwait", valueUsdBn: 4, status: "under_construction", completionYear: 2030, description: "Residential city for 400,000 people" },
  // Oman
  { name: "Duqm Special Economic Zone", country: "oman", valueUsdBn: 15, status: "under_construction", completionYear: 2030, description: "Industrial port city and refinery hub" },
  // Egypt
  { name: "New Administrative Capital", country: "egypt", valueUsdBn: 58, status: "under_construction", completionYear: 2030, description: "New capital city east of Cairo" },
  { name: "Suez Canal Economic Zone", country: "egypt", valueUsdBn: 10, status: "under_construction", completionYear: 2030, description: "Industrial and logistics hub along Suez Canal" },
];

export interface VisionKpi {
  country: CountryCode;
  metrics: { label: string; value: string; trend: "up" | "down" | "flat" }[];
}

export const visionKpis: VisionKpi[] = [
  {
    country: "ksa",
    metrics: [
      { label: "Non-oil GDP %", value: "50%", trend: "up" },
      { label: "Tourism (M visits)", value: "27.4", trend: "up" },
      { label: "FDI inflows ($B)", value: "5.5", trend: "up" },
      { label: "PIF AUM ($T)", value: "0.93", trend: "up" },
    ],
  },
  {
    country: "uae",
    metrics: [
      { label: "Non-oil GDP %", value: "71%", trend: "up" },
      { label: "Tourism (M visits)", value: "17.2", trend: "up" },
      { label: "FDI inflows ($B)", value: "22.7", trend: "up" },
      { label: "Tech exports ($B)", value: "8.3", trend: "up" },
    ],
  },
  {
    country: "qatar",
    metrics: [
      { label: "Non-oil GDP %", value: "42%", trend: "flat" },
      { label: "Tourism (M visits)", value: "4.0", trend: "up" },
      { label: "LNG capacity (Mtpa)", value: "77", trend: "up" },
    ],
  },
  {
    country: "egypt",
    metrics: [
      { label: "GDP ($B)", value: "398", trend: "up" },
      { label: "Suez revenue ($B)", value: "9.4", trend: "down" },
      { label: "Renewable %", value: "20%", trend: "up" },
    ],
  },
];
