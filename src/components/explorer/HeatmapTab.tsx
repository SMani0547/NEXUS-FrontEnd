import { useEnhancedHeatmapQuery, useYearHeatmapQuery } from "@/hooks/useNexusApi";
import { ChartCard } from "./ChartCard";
import { HeatmapGrid } from "./HeatmapGrid";

export function HeatmapTab({
  typeFilter,
  product,
  products,
  onTypeChange,
  onProductChange,
}: {
  typeFilter: "All" | "crop" | "livestock";
  product: string;
  products: string[];
  onTypeChange: (value: "All" | "crop" | "livestock") => void;
  onProductChange: (value: string) => void;
}) {
  const type = typeFilter === "All" ? undefined : typeFilter;
  const enhancedQuery = useEnhancedHeatmapQuery({ type, limit_countries: 16, limit_products: 18 });
  const yearQuery = useYearHeatmapQuery({ product, type }, Boolean(product));

  const enhanced = enhancedQuery.data;
  const yearMap = yearQuery.data;
  const yearIsCountry = yearMap?.axis === "year_country";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-semibold">Heatmap & correlations</h2>
          <p className="text-xs text-muted-foreground mt-1">Darker cells are higher average yield. Hover a cell for the exact value.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="grid grid-cols-3 gap-1 p-1 bg-muted rounded-md">
            {(["All", "crop", "livestock"] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => onTypeChange(option)}
                className={`text-xs py-1.5 px-3 rounded capitalize ${typeFilter === option ? "bg-card shadow-sm font-medium" : "text-muted-foreground"}`}
              >
                {option}
              </button>
            ))}
          </div>
          <select
            value={product}
            onChange={(event) => onProductChange(event.target.value)}
            className="bg-background border border-input rounded-md px-3 py-2 text-sm"
          >
            {products.map((name) => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
        </div>
      </div>

      <ChartCard
        title="Country × product"
        subtitle={type ? `${type} products · top reporters` : "All types · top reporters"}
        loading={enhancedQuery.isLoading}
        minHeight={320}
      >
        <HeatmapGrid
          rows={enhanced?.countries ?? []}
          cols={enhanced?.products ?? []}
          cells={(enhanced?.cells ?? []).map((cell) => ({
            row: cell.country,
            col: cell.product,
            value: cell.avg_yield,
            count: cell.record_count,
          }))}
        />
      </ChartCard>

      <ChartCard
        title={yearIsCountry ? "Year × country" : "Year × product"}
        subtitle={product ? `${product} yield intensity over time` : "Select a product"}
        loading={yearQuery.isLoading}
        minHeight={320}
      >
        <HeatmapGrid
          rows={(yearMap?.years ?? []).map(String)}
          cols={yearIsCountry ? (yearMap?.countries ?? []) : (yearMap?.products ?? [])}
          cells={(yearMap?.cells ?? []).map((cell) => ({
            row: String(cell.year),
            col: yearIsCountry ? (cell.country ?? "") : (cell.product ?? ""),
            value: cell.avg_yield,
            count: cell.avg_yield == null ? 0 : 1,
          }))}
        />
      </ChartCard>
    </div>
  );
}
