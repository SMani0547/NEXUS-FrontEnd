import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { CompareTab } from "@/components/explorer/CompareTab";
import { DeepDiveTab } from "@/components/explorer/DeepDiveTab";
import { ExplorerTabPanel, ExplorerTabs, type ExplorerTabId } from "@/components/explorer/ExplorerTabs";
import { HeatmapTab } from "@/components/explorer/HeatmapTab";
import { OverviewTab } from "@/components/explorer/OverviewTab";
import { useFiltersQuery, useProductsQuery } from "@/hooks/useNexusApi";

export const Route = createFileRoute("/explorer")({
  head: () => ({
    meta: [
      { title: "Data Explorer - NEXUS" },
      { name: "description", content: "Interactive Pacific agriculture data explorer with multiple visualizations and smart insights." },
    ],
  }),
  component: Explorer,
});

const typeOptions = ["All", "crop", "livestock"] as const;

function Explorer() {
  const filtersQuery = useFiltersQuery();
  const filters = filtersQuery.data;
  const defaultYears = filters?.year_range ?? { min: 1961, max: 2024 };
  const countries = Array.isArray(filters?.countries) ? filters.countries : [];
  const allProducts = Array.isArray(filters?.product_names) ? filters.product_names : [];

  const [tab, setTab] = useState<ExplorerTabId>("overview");
  const [typeFilter, setTypeFilter] = useState<(typeof typeOptions)[number]>("All");
  const [country, setCountry] = useState<string>("All");
  const [product, setProduct] = useState<string>("");
  const [yearRange, setYearRange] = useState<[number, number]>([defaultYears.min, defaultYears.max]);
  const [query, setQuery] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(true);

  const cropProductsQuery = useProductsQuery("crop");
  const livestockProductsQuery = useProductsQuery("livestock");
  const cropProducts = cropProductsQuery.data?.products ?? [];
  const livestockProducts = livestockProductsQuery.data?.products ?? [];

  const tabType = tab === "crops" ? "crop" : tab === "livestock" ? "livestock" : typeFilter === "All" ? undefined : typeFilter;
  const tabProducts = useMemo(() => {
    const source = tab === "crops" ? cropProducts : tab === "livestock" ? livestockProducts : allProducts;
    if (!query) return source;
    const needle = query.toLowerCase();
    return source.filter((name) => name.toLowerCase().includes(needle));
  }, [tab, cropProducts, livestockProducts, allProducts, query]);

  useEffect(() => {
    if (!filters) return;
    setYearRange((current) => {
      const untouched = current[0] === 1961 && current[1] === 2024;
      return untouched ? [filters.year_range?.min ?? current[0], filters.year_range?.max ?? current[1]] : current;
    });
  }, [filters]);

  useEffect(() => {
    if (tab === "crops") setTypeFilter("crop");
    if (tab === "livestock") setTypeFilter("livestock");
  }, [tab]);

  useEffect(() => {
    if (!tabProducts.length) return;
    setProduct((current) => (current && tabProducts.includes(current) ? current : tabProducts[0]));
  }, [tabProducts]);

  const selectedProduct = product || tabProducts[0] || "";
  const lockType = tab === "crops" || tab === "livestock";
  const hasApiError = filtersQuery.isError || cropProductsQuery.isError || livestockProductsQuery.isError;

  return (
    <div className="pt-24 pb-16 min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-widest text-accent font-medium mb-2">Explorer</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-3">Data Explorer</h1>
          <p className="text-muted-foreground max-w-2xl">
            Move from the full Pacific dataset down to a single crop, herd, country, or year —
            crop and livestock yields stay in their own units.
          </p>
        </div>

        {hasApiError && (
          <div className="mb-6 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-foreground">
            Some Explorer data could not be loaded. The available charts are still shown; check the backend URL or try again shortly.
          </div>
        )}

        <div className="grid lg:grid-cols-[280px_1fr] gap-6">
          <aside className="space-y-4">
            <div className="bg-card border border-border rounded-2xl p-5 shadow-card sticky top-24">
              <button
                type="button"
                onClick={() => setFiltersOpen(!filtersOpen)}
                className="w-full flex items-center justify-between mb-4"
              >
                <span className="font-display font-semibold flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4" /> Filters
                </span>
                <span className="text-xs text-muted-foreground">{filtersOpen ? "Hide" : "Show"}</span>
              </button>

              {filtersOpen && (
                <div className="space-y-5">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-2 block">Search products</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Product name" className="pl-9" />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-2 block">Product Type</label>
                    <div className="grid grid-cols-3 gap-1 p-1 bg-muted rounded-md">
                      {typeOptions.map((type) => (
                        <button
                          key={type}
                          type="button"
                          disabled={lockType && type !== tabType}
                          onClick={() => setTypeFilter(type)}
                          className={`text-xs py-1.5 rounded capitalize disabled:opacity-50 ${typeFilter === type ? "bg-card shadow-sm font-medium" : "text-muted-foreground"}`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                    {lockType && (
                      <p className="mt-1 text-[10px] text-muted-foreground">Type is locked on this tab.</p>
                    )}
                  </div>

                  <SelectField label="Country" value={country} onChange={setCountry} options={["All", ...countries]} />
                  <SelectField label="Product" value={selectedProduct} onChange={setProduct} options={tabProducts} />

                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-2 block">
                      Year Range: <span className="text-foreground">{yearRange[0]} - {yearRange[1]}</span>
                    </label>
                    <Slider
                      value={yearRange}
                      min={filters?.year_range?.min ?? yearRange[0]}
                      max={filters?.year_range?.max ?? yearRange[1]}
                      step={1}
                      onValueChange={(value) => setYearRange([value[0], value[1]] as [number, number])}
                    />
                  </div>
                </div>
              )}
            </div>
          </aside>

          <ExplorerTabs value={tab} onValueChange={setTab}>
            <ExplorerTabPanel value="overview">
              <OverviewTab />
            </ExplorerTabPanel>
            <ExplorerTabPanel value="crops">
              <DeepDiveTab
                kind="crop"
                product={selectedProduct}
                country={country}
                yearRange={yearRange}
                products={tabProducts}
                onProductChange={setProduct}
              />
            </ExplorerTabPanel>
            <ExplorerTabPanel value="livestock">
              <DeepDiveTab
                kind="livestock"
                product={selectedProduct}
                country={country}
                yearRange={yearRange}
                products={tabProducts}
                onProductChange={setProduct}
              />
            </ExplorerTabPanel>
            <ExplorerTabPanel value="compare">
              <CompareTab
                countries={countries}
                product={selectedProduct}
                products={tabProducts}
                yearRange={yearRange}
                onProductChange={setProduct}
              />
            </ExplorerTabPanel>
            <ExplorerTabPanel value="heatmap">
              <HeatmapTab
                typeFilter={typeFilter}
                product={selectedProduct}
                products={tabProducts}
                onTypeChange={setTypeFilter}
                onProductChange={setProduct}
              />
            </ExplorerTabPanel>
          </ExplorerTabs>
        </div>
      </div>
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <div>
      <label className="text-xs font-medium text-muted-foreground mb-2 block">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm"
      >
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </div>
  );
}
