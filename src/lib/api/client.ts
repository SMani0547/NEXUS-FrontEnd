export const API_BASE_URL =
  import.meta.env.VITE_NEXUS_API_BASE_URL?.replace(/\/$/, "") || "http://127.0.0.1:8000";

type QueryValue = string | number | boolean | null | undefined;

function withQuery(path: string, params: Record<string, QueryValue> = {}) {
  const url = new URL(`${API_BASE_URL}${path}`);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "" && value !== "All") {
      url.searchParams.set(key, String(value));
    }
  });
  return url.toString();
}

async function apiFetch<T>(path: string, params?: Record<string, QueryValue>, init?: RequestInit): Promise<T> {
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
  heatmap: () => apiFetch<HeatmapResponse>("/api/heatmap"),
  insights: (params: { product?: string; year_min?: number; year_max?: number } = {}) =>
    apiFetch<InsightsResponse>("/api/insights", params),
  ask: (question: string) =>
    apiFetch<AskResponse>("/api/ask", undefined, {
      method: "POST",
      body: JSON.stringify({ question }),
    }),
  exportUrl: (params: DataParams = {}) => withQuery("/api/data/export", params),
};
