import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { nexusApi, type DataParams } from "@/lib/api/client";

export function useSummaryQuery() {
  return useQuery({ queryKey: ["nexus", "summary"], queryFn: nexusApi.summary });
}

export function useFiltersQuery() {
  return useQuery({ queryKey: ["nexus", "filters"], queryFn: nexusApi.filters });
}

export function useCountriesQuery() {
  return useQuery({ queryKey: ["nexus", "countries"], queryFn: nexusApi.countries });
}

export function useDataQuery(params: DataParams) {
  return useQuery({
    queryKey: ["nexus", "data", params],
    queryFn: () => nexusApi.data(params),
    placeholderData: keepPreviousData,
  });
}

export function useTrendsQuery(params: { country: string; product: string; type?: string }, enabled = true) {
  return useQuery({
    queryKey: ["nexus", "trends", params],
    queryFn: () => nexusApi.trends(params),
    enabled,
    placeholderData: keepPreviousData,
  });
}

export function useComparisonQuery(params: { product: string; year: number; type?: string }, enabled = true) {
  return useQuery({
    queryKey: ["nexus", "comparison", params],
    queryFn: () => nexusApi.comparison(params),
    enabled,
    placeholderData: keepPreviousData,
  });
}

export function useCountryProfileQuery(country: string | null) {
  return useQuery({
    queryKey: ["nexus", "country-profile", country],
    queryFn: () => nexusApi.countryProfile(country ?? ""),
    enabled: Boolean(country),
    placeholderData: keepPreviousData,
  });
}

export function useProductsQuery(type?: string) {
  return useQuery({
    queryKey: ["nexus", "products", type ?? "all"],
    queryFn: () => nexusApi.products(type),
  });
}

export function useHeatmapQuery() {
  return useQuery({ queryKey: ["nexus", "heatmap"], queryFn: nexusApi.heatmap });
}

export function useEnhancedHeatmapQuery(params: { type?: string; limit_countries?: number; limit_products?: number } = {}) {
  return useQuery({
    queryKey: ["nexus", "heatmap-enhanced", params],
    queryFn: () => nexusApi.heatmapEnhanced(params),
    placeholderData: keepPreviousData,
  });
}

export function useYearHeatmapQuery(params: { product?: string; type?: string }, enabled = true) {
  return useQuery({
    queryKey: ["nexus", "heatmap-year", params],
    queryFn: () => nexusApi.heatmapYear(params),
    enabled,
    placeholderData: keepPreviousData,
  });
}

export function useTypeSummaryQuery() {
  return useQuery({ queryKey: ["nexus", "type-summary"], queryFn: nexusApi.typeSummary });
}

export function useMultiTrendsQuery(
  params: { product: string; countries?: string[]; year_min?: number; year_max?: number; type?: string },
  enabled = true,
) {
  return useQuery({
    queryKey: ["nexus", "multi-trends", params],
    queryFn: () => nexusApi.multiTrends(params),
    enabled,
    placeholderData: keepPreviousData,
  });
}

export function useRankingsQuery(params: { type?: string; year?: number; limit?: number } = {}, enabled = true) {
  return useQuery({
    queryKey: ["nexus", "rankings", params],
    queryFn: () => nexusApi.rankings(params),
    enabled,
    placeholderData: keepPreviousData,
  });
}

export function useInsightsQuery(params: { product?: string; year_min?: number; year_max?: number }) {
  return useQuery({
    queryKey: ["nexus", "insights", params],
    queryFn: () => nexusApi.insights(params),
    placeholderData: keepPreviousData,
  });
}

export function useAskMutation() {
  return useMutation({ mutationFn: nexusApi.ask });
}
