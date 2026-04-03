# UI Design Spec

## Design philosophy

**Bloomberg Terminal meets modern editorial.** Dense information, dark by default, but with the readability and polish of a premium news site. This is not a consumer product — it's a professional intelligence tool. Every pixel earns its place.

## Visual identity

### Color system

**Base palette (dark mode default):**
- Background: `#0A0A0B` (near-black)
- Surface: `#141416` (cards, panels)
- Surface elevated: `#1C1C20` (hover states, active tabs)
- Border: `#2A2A30` (subtle separation)
- Text primary: `#F0F0F2` (headlines, values)
- Text secondary: `#9A9AA0` (descriptions, labels)
- Text tertiary: `#5A5A62` (timestamps, metadata)

**Country accent colors** (used for badges, tab indicators, chart lines):
- UAE: `#0066CC` (blue)
- KSA: `#006B3F` (green)
- Qatar: `#8A1538` (maroon)
- Kuwait: `#007A5E` (teal-green)
- Bahrain: `#CE1126` (red)
- Oman: `#D12D1C` (red-orange)
- Egypt: `#C89B3C` (gold)
- GCC-wide: `#8B5CF6` (purple)

**Sector accent colors:**
- CPG & Retail: `#F59E0B` (amber)
- Family Business: `#8B5CF6` (purple)
- Private Capital: `#10B981` (emerald)
- Tech & Digital: `#3B82F6` (blue)
- Energy: `#EF4444` (red)
- Real Estate: `#F97316` (orange)
- Regulation: `#6B7280` (gray)

**Financial colors:**
- Positive / Up: `#22C55E`
- Negative / Down: `#EF4444`
- Neutral / Unchanged: `#9A9AA0`

### Typography

Use `Inter` for body text and data (excellent number rendering) and `Instrument Serif` for editorial headings (morning brief, article headlines).

| Element | Font | Weight | Size |
|---------|------|--------|------|
| Page title | Instrument Serif | 500 | 28px |
| Section heading | Inter | 600 | 18px |
| Card headline | Inter | 500 | 15px |
| Body text | Inter | 400 | 14px |
| Data value (large) | Inter | 600 | 24px |
| Data value (small) | Inter | 500 | 14px |
| Label / caption | Inter | 400 | 12px |
| Badge text | Inter | 500 | 11px |

### Spacing

Use a 4px base grid. Standard spacing tokens:
- `xs`: 4px
- `sm`: 8px
- `md`: 16px
- `lg`: 24px
- `xl`: 32px
- `2xl`: 48px

Card padding: 16px. Gap between cards: 12px. Page margin: 24px (desktop), 16px (mobile).

---

## Component patterns

### Navigation

**Top bar** (fixed, 56px height):
- Left: Logo/wordmark "GCC Monitor"
- Center: Page tabs — Home, Macro, News, Deals, Regulatory, Vision
- Right: Last updated timestamp, settings gear icon

Active tab has a bottom border accent in `#3B82F6`. Hover state uses `Surface elevated` background.

### Tab groups (country / sector)

Used on Macro (country tabs) and News (sector tabs) pages.

- Horizontal scrollable on mobile
- Active tab: white text, bottom border accent
- Inactive tab: `text-secondary`, no border
- Tab count badge (optional): small pill showing article count
- Keyboard navigable (arrow keys)

### Market data card

```
┌──────────────────────────────────┐
│  TASI (Tadawul)         🇸🇦     │
│  11,109.24       +0.17%  ↑      │
│  ▁▂▃▃▄▅▅▆▅▄▃▄▅▆▇█▇▆▅  (7d)    │
└──────────────────────────────────┘
```

- Index name + country flag emoji
- Current value (large, white) + change % (green/red) + arrow
- 7-day sparkline (using Recharts `<AreaChart>` with no axes)
- Click to navigate to country tab in Macro page

### Article card

```
┌──────────────────────────────────────────────────┐
│  AGBI  ·  2h ago  ·  🇸🇦 KSA  ·  Private Capital │
│                                                    │
│  PIF doubles down on gaming with $2B              │
│  investment in Japanese studios                    │
│                                                    │
│  Saudi Arabia's sovereign wealth fund has          │
│  committed $2 billion across three Japanese...     │
│                                                    │
│  ↗ Read original                                  │
└──────────────────────────────────────────────────┘
```

- Top row: source name, relative time, country badge, sector badge(s)
- Headline: 2 lines max, Inter 500 15px
- Summary: 2-3 lines, Inter 400 14px, `text-secondary`
- "Read original" link to source article

### Deal card (extends article card)

Same as article card but with:
- Deal type badge (M&A, IPO, PE/VC, SWF) in top row
- Value badge if disclosed (e.g., "$2B")
- Acquirer/investor name highlighted

### Data table

Used for market indices, macro stats, top movers.

- Fixed header on scroll
- Alternating row background (transparent / `Surface`)
- Numeric columns right-aligned
- Change columns color-coded (green/red)
- Sortable columns (click header)
- Compact row height: 40px

### Signal badge

Small pill component used for high-signal alerts on the home page.

```
[🔴 New UAE corporate tax guidance]  [🟢 PIF invests $500M in logistics]
```

- Colored dot (red = regulatory, green = deal, blue = tech, amber = CPG)
- One-line text, max 50 chars
- Click to open the source article

---

## Page layouts

### Home (`/`)

```
┌─────────────────────────────────────────┐
│ [Nav bar]                               │
├─────────────────────────────────────────┤
│ Market Snapshot Strip (horizontal)      │
│ Brent $XX | TASI XX | DFM XX | USD/EGP │
├─────────────────────────────────────────┤
│ ┌─────────────────────────────────────┐ │
│ │ Morning Brief                       │ │
│ │ AI-generated 3-4 paragraph brief    │ │
│ │ of today's key developments...      │ │
│ └─────────────────────────────────────┘ │
├─────────────────────────────────────────┤
│ Signals    [badge] [badge] [badge]      │
├─────────────────────────────────────────┤
│ Top Stories                             │
│ ┌───────────┐ ┌───────────┐            │
│ │ Article 1 │ │ Article 2 │            │
│ └───────────┘ └───────────┘            │
│ ┌───────────┐ ┌───────────┐            │
│ │ Article 3 │ │ Article 4 │            │
│ └───────────┘ └───────────┘            │
└─────────────────────────────────────────┘
```

### Macro (`/macro`)

```
┌─────────────────────────────────────────┐
│ [Nav bar]                               │
├─────────────────────────────────────────┤
│ [All GCC][UAE][KSA][Qatar][Kuwait]...   │
├─────────────────────────────────────────┤
│ Oil & Energy Strip                      │
│ Brent $XX | WTI $XX | NatGas $XX       │
├─────────────────────────────────────────┤
│ Market Indices Table                    │
│ Exchange | Value | Change | YTD | Chart │
│ ──────────────────────────────────────  │
│ TASI     | 11109 | +0.17% | -3.2% | ▅▆ │
│ ADX      | 9596  | -0.05% | +6.0% | ▆▅ │
│ ...                                     │
├─────────────────────────────────────────┤
│ Currency Strip                          │
│ FX Table                                │
├─────────────────────────────────────────┤
│ Commodities (CPG-relevant)              │
│ Wheat | Sugar | Palm Oil | Coffee       │
└─────────────────────────────────────────┘
```

Country tab replaces the table with a single-country deep dive (chart, stats card, top movers, sector heatmap).

### News (`/news`)

```
┌─────────────────────────────────────────┐
│ [Nav bar]                               │
├─────────────────────────────────────────┤
│ [All][CPG][Family Biz][Capital][Tech].. │
│ Country: [dropdown] Sort: [dropdown]    │
├─────────────────────────────────────────┤
│ ┌──────────────────────────────────┐    │
│ │ Article card                     │    │
│ └──────────────────────────────────┘    │
│ ┌──────────────────────────────────┐    │
│ │ Article card                     │    │
│ └──────────────────────────────────┘    │
│ ┌──────────────────────────────────┐    │
│ │ Article card                     │    │
│ └──────────────────────────────────┘    │
│ ... (infinite scroll or pagination)     │
└─────────────────────────────────────────┘
```

---

## Responsive behavior

| Breakpoint | Layout |
|-----------|--------|
| Desktop (≥1280px) | Full layout, side-by-side cards |
| Tablet (768-1279px) | Single column, full-width cards |
| Mobile (<768px) | Compact cards, horizontal scroll tabs, stacked layout |

Priority: Desktop first. This is a desk tool. Mobile is a nice-to-have for quick glances on the go.

---

## Light mode

Available via toggle, but dark mode is the default. Light mode inverts:
- Background: `#FFFFFF`
- Surface: `#F5F5F7`
- Text primary: `#1A1A1B`
- Keep accent colors the same

Use Tailwind's `dark:` variants throughout. Set dark as default in `tailwind.config.ts` with `darkMode: 'class'`.
