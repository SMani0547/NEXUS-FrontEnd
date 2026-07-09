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

- **Landing Hub** — An engaging homepage featuring an animated hero section, count-up regional statistics, an interactive story timeline, key insights, team information, and dataset source references.
- **Data Explorer** (`/explorer`) —An interactive analytics dashboard that allows users to explore yield trends, compare countries, analyze product distributions, and visualize country-by-product relationships through a heatmap. Includes filters for country, product type, and year range.
- **Pacific Map** (`/map`) — An interactive SVG map of the Pacific region that provides detailed country profiles, growth metrics, and available agricultural products through dynamic information panels.
- **Nexus AI** (`/ai`) — A conversational AI interface with suggested prompts, typing animations, and dataset-based mock responses, enabling users to explore information in a natural, chat-driven format.
- **Smooth in-page navigation** — Seamless in-page navigation using hash links, allowing users to smoothly scroll between sections of the landing page for an improved browsing experience.

---

## Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | TanStack Start v1 (React 19, SSR-ready, Server Functions) |
| **Build Tool** | Vite 7 |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS v4 + shadcn/ui |
| **Charts** | Recharts |
| **Maps** | Custom SVG (Leaflet-ready) |
| **Fonts** | Inter (body) + Space Grotesk (display) |

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

| Dataset | Description | Notes |
|----------|-------------|-------|
| **Crop Yield — Disaggregated** | Production data by country, product, and year. | Some countries or years may have missing product data. |
| **Livestock Yield — Disaggregated** | Livestock head counts and yield data by country and year. | Coverage varies by country and reporting year. |

> **General Note:** The application automatically handles missing values and varying levels of data availability to ensure a consistent user experience.
---

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

---

## Team Nexus
- Abhishek
- Parth
- Pranav
- Pranshu
- Shainesh
- Shiva

---

## License

Built for the Pacific Dataviz Challenge 2026.
Open Source Project

