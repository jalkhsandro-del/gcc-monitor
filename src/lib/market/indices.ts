import type { CountryCode } from "@/types";

export interface MarketIndex {
  symbol: string;
  name: string;
  exchange: string;
  country: CountryCode;
  tradingDays: number[]; // 0=Sun, 1=Mon, ... 6=Sat
  openHourUTC: number;
  closeHourUTC: number;
}

export const gccIndices: MarketIndex[] = [
  {
    symbol: "FADGI.FGI",
    name: "FTSE ADX General",
    exchange: "ADX",
    country: "uae",
    tradingDays: [0, 1, 2, 3, 4],
    openHourUTC: 6,
    closeHourUTC: 10,
  },
  {
    symbol: "DFMGI.AE",
    name: "DFM General Index",
    exchange: "DFM",
    country: "uae",
    tradingDays: [0, 1, 2, 3, 4],
    openHourUTC: 6,
    closeHourUTC: 10,
  },
  {
    symbol: "^TASI.SR",
    name: "TASI",
    exchange: "Tadawul",
    country: "ksa",
    tradingDays: [0, 1, 2, 3, 4],
    openHourUTC: 7,
    closeHourUTC: 12,
  },
  {
    symbol: "GNRI.QA",
    name: "QE General Index",
    exchange: "QSE",
    country: "qatar",
    tradingDays: [0, 1, 2, 3, 4],
    openHourUTC: 6,
    closeHourUTC: 10,
  },
  {
    symbol: "BKP.KW",
    name: "Premier Market",
    exchange: "Boursa Kuwait",
    country: "kuwait",
    tradingDays: [0, 1, 2, 3, 4],
    openHourUTC: 6,
    closeHourUTC: 10,
  },
  {
    symbol: "BAX.BH",
    name: "BAX",
    exchange: "Bahrain Bourse",
    country: "bahrain",
    tradingDays: [0, 1, 2, 3, 4],
    openHourUTC: 6,
    closeHourUTC: 10,
  },
  {
    symbol: "MSI.OM",
    name: "MSM 30",
    exchange: "MSM",
    country: "oman",
    tradingDays: [0, 1, 2, 3, 4],
    openHourUTC: 6,
    closeHourUTC: 9,
  },
  {
    symbol: "^EGX30.CA",
    name: "EGX 30",
    exchange: "EGX",
    country: "egypt",
    tradingDays: [0, 1, 2, 3, 4],
    openHourUTC: 8,
    closeHourUTC: 12,
  },
];

export const commoditySymbols = {
  brentCrude: "BZ=F",
  wtiCrude: "CL=F",
  naturalGas: "NG=F",
  wheat: "ZW=F",
  sugar: "SB=F",
  corn: "ZC=F",
  coffee: "KC=F",
  gold: "GC=F",
} as const;

export const fxSymbols = {
  usdAed: "USDAED=X",
  usdSar: "USDSAR=X",
  usdQar: "USDQAR=X",
  usdKwd: "USDKWD=X",
  usdBhd: "USDBHD=X",
  usdOmr: "USDOMR=X",
  usdEgp: "USDEGP=X",
  eurUsd: "EURUSD=X",
} as const;
