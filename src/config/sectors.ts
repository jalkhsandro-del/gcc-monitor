import type { Sector, SectorCode } from "@/types";

export const sectors: Record<SectorCode, Sector> = {
  cpg_retail: {
    code: "cpg_retail",
    name: "CPG & Retail",
    accentColor: "#F59E0B",
  },
  family_business: {
    code: "family_business",
    name: "Family Business",
    accentColor: "#8B5CF6",
  },
  private_capital: {
    code: "private_capital",
    name: "Private Capital",
    accentColor: "#10B981",
  },
  tech_digital: {
    code: "tech_digital",
    name: "Tech & Digital",
    accentColor: "#3B82F6",
  },
  energy: {
    code: "energy",
    name: "Energy",
    accentColor: "#EF4444",
  },
  real_estate_construction: {
    code: "real_estate_construction",
    name: "Real Estate",
    accentColor: "#F97316",
  },
  regulation_policy: {
    code: "regulation_policy",
    name: "Regulation",
    accentColor: "#6B7280",
  },
};

export const sectorCodes: SectorCode[] = Object.keys(sectors) as SectorCode[];
