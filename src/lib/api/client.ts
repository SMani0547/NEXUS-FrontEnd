export const API_BASE_URL =
  import.meta.env.VITE_NEXUS_API_BASE_URL?.replace(/\/$/, "") || "http://127.0.0.1:8000";

type QueryValue = string | number | boolean | null | undefined;
type QueryParam = QueryValue | QueryValue[];

function withQuery(path: string, params: Record<string, QueryParam> = {}) {
  const url = new URL(`${API_BASE_URL}${path}`);
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "" || value === "All") return;
    if (Array.isArray(value)) {
      const joined = value.filter((item) => item !== undefined && item !== null && item !== "").join(",");
      if (joined) url.searchParams.set(key, joined);
      return;
    }
    url.searchParams.set(key, String(value));
  });
  return url.toString();
}

async function apiFetch<T>(path: string, params?: Record<string, QueryParam>, init?: RequestInit): Promise<T> {
  const response = await fetch(withQuery(path, params), {
    ...init,
    headers: {
      "content-type": "application/json",
      ...init?.headers,
    },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed with ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export type SummaryResponse = {
  total_countries: number;
  total_products: number;
  total_years: number;
  total_records: number;
  crop_record_count: number;
  livestock_record_count: number;
};

export type FiltersResponse = {
  countries: string[];
  product_types: string[];
  product_names: string[];
  year_range: { min: number; max: number } | null;
  years: number[];
  units: string[];
};

type CountriesResponse = {
  countries: string[];
};

export type YieldRow = {
  country: string;
  product: string;
  type: string;
  year: number;
  yield: number;
  unit: string;
};

export type DataResponse = {
  total: number;
  rows: YieldRow[];
};

export type TrendResponse = {
  country: string;
  product: string;
  type: string;
  unit: string;
  series: { year: number; value: number | null }[];
};

export type ComparisonResponse = {
  product: string;
  type: string;
  year: number;
  countries: { country: string; unit: string; value: number | null }[];
};

export type CountryProfileResponse = {
  country: string;
  available_crop_products: string[];
  available_livestock_products: string[];
  years_available: number[];
  latest_values: { product: string; type: string; year: number; value: number | null; unit: string }[];
  trend_summaries: { product: string; type: string; direction: string; change_percent: number | null }[];
};

export type HeatmapResponse = {
  countries: string[];
  products: string[];
  cells: { country: string; product: string; avg_yield: number | null; record_count: number }[];
  type?: string | null;
};

export type TypeSummaryBlock = {
  product_count: number;
  record_count: number;
  avg_yield: number | null;
  unit: string | null;
  top_products: { product: string; avg_yield: number }[];
};

export type TypeSummaryResponse = {
  year_range: { min: number; max: number } | null;
  total_countries: number;
  total_records: number;
  types: { crop: TypeSummaryBlock; livestock: TypeSummaryBlock };
  coverage: { country: string; year_min: number; year_max: number; record_count: number }[];
};

export type MultiTrendsResponse = {
  product: string;
  type: string | null;
  unit: string | null;
  series: { country: string; points: { year: number; value: number | null }[] }[];
};

export type RankingsResponse = {
  type: string | null;
  year: number | null;
  products: { product: string; type: string; avg_yield: number | null; country_count: number; record_count: number }[];
};

export type YearHeatmapResponse = {
  product: string | null;
  type: string | null;
  axis: "year_country" | "year_product" | string;
  years: number[];
  countries: string[];
  products: string[];
  cells: { year: number; avg_yield: number | null; country?: string | null; product?: string | null }[];
};

export type InsightItem = {
  label: string;
  value: string;
  sub: string;
};

export type InsightsResponse = {
  highest_yield_country: InsightItem;
  fastest_growing_product: InsightItem;
  largest_decline_product: InsightItem;
  most_reported_product: InsightItem;
};

export type AskResponse = {
  answer: string;
  note: string;
  suggested_questions: string[];
  data_context: Record<string, unknown> | null;
};

export type DataParams = {
  type?: string;
  country?: string;
  product?: string;
  year_min?: number;
  year_max?: number;
};

export const nexusApi = {
  summary: () => apiFetch<SummaryResponse>("/api/summary"),
  filters: () => apiFetch<FiltersResponse>("/api/filters"),
  countries: async () => {
    const response = await apiFetch<CountriesResponse>("/api/countries");
    return response.countries;
  },
  data: (params: DataParams = {}) => apiFetch<DataResponse>("/api/data", params),
  trends: (params: { country: string; product: string; type?: string }) =>
    apiFetch<TrendResponse>("/api/trends", params),
  comparison: (params: { product: string; year: number; type?: string }) =>
    apiFetch<ComparisonResponse>("/api/comparison", params),
  countryProfile: (country: string) =>
    apiFetch<CountryProfileResponse>("/api/country-profile", { country }),
  products: (type?: string) =>
    apiFetch<{ type: string | null; products: string[] }>("/api/products", { type }),
  heatmap: () => apiFetch<HeatmapResponse>("/api/heatmap"),
  heatmapEnhanced: (params: { type?: string; limit_countries?: number; limit_products?: number } = {}) =>
    apiFetch<HeatmapResponse>("/api/heatmap/enhanced", params),
  heatmapYear: (params: { product?: string; type?: string } = {}) =>
    apiFetch<YearHeatmapResponse>("/api/heatmap/year", params),
  typeSummary: () => apiFetch<TypeSummaryResponse>("/api/type-summary"),
  multiTrends: (params: {
    product: string;
    countries?: string[];
    year_min?: number;
    year_max?: number;
    type?: string;
  }) => apiFetch<MultiTrendsResponse>("/api/multi-trends", params),
  rankings: (params: { type?: string; year?: number; limit?: number } = {}) =>
    apiFetch<RankingsResponse>("/api/rankings", params),
  insights: (params: { product?: string; year_min?: number; year_max?: number } = {}) =>
    apiFetch<InsightsResponse>("/api/insights", params),
  ask: (question: string) =>
    apiFetch<AskResponse>("/api/ask", undefined, {
      method: "POST",
      body: JSON.stringify({ question }),
    }),
  exportUrl: (params: DataParams = {}) => withQuery("/api/data/export", params),
};
