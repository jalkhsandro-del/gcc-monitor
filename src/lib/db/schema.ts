import {
  pgTable,
  uuid,
  text,
  integer,
  boolean,
  timestamp,
  date,
  numeric,
  bigint,
  serial,
  index,
  uniqueIndex,
  jsonb,
} from "drizzle-orm/pg-core";

export const articles = pgTable(
  "articles",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    url: text("url").notNull().unique(),
    title: text("title").notNull(),
    description: text("description"),
    summary: text("summary"),
    source: text("source").notNull(),
    sourceName: text("source_name").notNull(),
    country: text("country").notNull(),
    sectors: text("sectors").array().notNull().default([]),
    signalScore: integer("signal_score").notNull().default(1),
    dealType: text("deal_type"),
    publishedAt: timestamp("published_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    isRegulatory: boolean("is_regulatory").notNull().default(false),
    isVision: boolean("is_vision").notNull().default(false),
  },
  (table) => [
    index("articles_country_created_idx").on(table.country, table.createdAt),
    index("articles_signal_created_idx").on(
      table.signalScore,
      table.createdAt
    ),
    index("articles_deal_type_created_idx").on(
      table.dealType,
      table.createdAt
    ),
  ]
);

export const briefs = pgTable("briefs", {
  id: uuid("id").primaryKey().defaultRandom(),
  date: date("date").notNull().unique(),
  content: text("content").notNull(),
  generated: boolean("generated").notNull().default(true),
  articleIds: uuid("article_ids").array().notNull().default([]),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const marketDaily = pgTable(
  "market_daily",
  {
    id: serial("id").primaryKey(),
    symbol: text("symbol").notNull(),
    date: date("date").notNull(),
    open: numeric("open"),
    high: numeric("high"),
    low: numeric("low"),
    close: numeric("close").notNull(),
    volume: bigint("volume", { mode: "number" }),
    changePct: numeric("change_pct"),
  },
  (table) => [
    uniqueIndex("market_daily_symbol_date_idx").on(table.symbol, table.date),
  ]
);

export const macroStats = pgTable(
  "macro_stats",
  {
    id: serial("id").primaryKey(),
    country: text("country").notNull(),
    metric: text("metric").notNull(),
    value: numeric("value").notNull(),
    period: text("period").notNull(),
    source: text("source").notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("macro_stats_country_metric_period_idx").on(
      table.country,
      table.metric,
      table.period
    ),
  ]
);

export const cache = pgTable("cache", {
  key: text("key").primaryKey(),
  value: jsonb("value").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const megaprojects = pgTable("megaprojects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  country: text("country").notNull(),
  valueUsdBn: numeric("value_usd_bn"),
  status: text("status").notNull().default("announced"),
  vision: text("vision"),
  completionYear: integer("completion_year"),
  description: text("description"),
  lastNewsUrl: text("last_news_url"),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
