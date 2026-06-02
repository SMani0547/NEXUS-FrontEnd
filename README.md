# NEXUS — Pacific Dataviz Challenge 2026

NEXUS is an AI-powered interactive data visualization platform that explores the relationship between **climate change, agriculture, and food production** across Pacific Island countries and territories.

Built for the **Pacific Dataviz Challenge 2026**.

---

## Overview

NEXUS turns the official Pacific Dataviz Challenge datasets (Crop Yield and Livestock Yield — Disaggregated) into an explorable, story-driven experience. It combines:

- Interactive data visualizations
- A geographic exploration of the Pacific region
- Narrative storytelling around climate and agriculture
- A conversational AI assistant (**Nexus AI**) layered on top of the datasets

The goal: make Pacific agricultural data accessible, explorable, and meaningful for researchers, policymakers, and communities.

---

## Features

- **Landing Hub** — Animated hero, regional stats with count-up animations, story timeline, insights, team, and data sources.
- **Data Explorer** (`/explorer`) — Yield trends, country comparisons, product distribution, and a country × product heatmap with filters for country, product type, and year range.
- **Pacific Map** (`/map`) — Interactive SVG map of the region with per-country detail panels, growth metrics, and product availability.
- **Nexus AI** (`/ai`) — Chat interface with suggested questions, typing indicators, and mock responses derived from the dataset.
- **Smooth in-page navigation** — Hash links in the navbar scroll smoothly to sections on the home page.

---

## Tech Stack

- **Framework**: TanStack Start v1 (React 19, SSR-ready, server functions)
- **Build tool**: Vite 7
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Charts**: Recharts
- **Maps**: Custom SVG (Leaflet-ready)
- **Fonts**: Inter (body) + Space Grotesk (display)

---

## Design System

Defined in `src/styles.css` using semantic tokens:

- **Navy** `#0F172A` — background
- **Ocean** `#0EA5E9` — primary accent
- **Teal** `#14B8A6` — secondary accent

All colors are themed via CSS variables (oklch). Components consume semantic tokens — no hard-coded colors.

---

## Project Structure

```
src/
├── components/
│   ├── Navbar.tsx, Footer.tsx
│   ├── sections/        # Hero, Stats, About, Story, Insights, Team, DataSources
│   └── ui/              # shadcn/ui primitives
├── lib/
│   └── mock-data.ts     # Deterministic mock dataset (15 countries, 15 products, 24 years)
├── routes/
│   ├── __root.tsx       # Root layout + SEO
│   ├── index.tsx        # Landing page
│   ├── explorer.tsx     # Data Explorer dashboard
│   ├── map.tsx          # Pacific map
│   └── ai.tsx           # Nexus AI assistant
└── styles.css           # Design tokens + Tailwind theme
```

---

## Backend Integration (Ready)

The frontend is structured to connect to a future FastAPI backend with the following endpoints:

| Method | Endpoint           | Purpose                              |
|--------|--------------------|--------------------------------------|
| GET    | `/api/summary`     | Regional summary statistics          |
| GET    | `/api/countries`   | List of countries with metadata      |
| GET    | `/api/products`    | Crops & livestock catalog            |
| GET    | `/api/trends`      | Time-series yield data               |
| GET    | `/api/comparison`  | Country / product comparisons        |
| GET    | `/api/map`         | Geographic data for the Pacific map  |
| POST   | `/api/ask`         | Nexus AI conversational endpoint     |

All data currently uses mock values from `src/lib/mock-data.ts`.

---

## Data Sources

Official **Pacific Dataviz Challenge 2026** datasets:

- **Crop Yield — Disaggregated** — production by country, product, and year
- **Livestock Yield — Disaggregated** — head counts and yields across the region

Notes: not every country reports every product, data availability varies by year, and missing values are handled gracefully.

---

## Development

```bash
# Install dependencies
bun install

# Start dev server
bun run dev

# Build for production
bun run build
```

---

## Team Nexus

A team dedicated to transforming Pacific data into meaningful insights — across data, design, engineering, research, and AI.

---

## License

Built for the Pacific Dataviz Challenge 2026.
