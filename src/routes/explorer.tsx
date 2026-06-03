import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  ScatterChart, Scatter, XAxis, YAxis, Tooltip, CartesianGrid,
  ResponsiveContainer, Cell,
} from "recharts";
import { Search, SlidersHorizontal, Download, TrendingUp, TrendingDown, Award, Activity, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { nexusApi, type DataParams } from "@/lib/api/client";
import {
  useComparisonQuery,
  useDataQuery,
  useFiltersQuery,
  useHeatmapQuery,
  useInsightsQuery,
} from "@/hooks/useNexusApi";

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
  const countries = filters?.countries ?? [];
  const products = filters?.product_names ?? [];

  const [typeFilter, setTypeFilter] = useState<(typeof typeOptions)[number]>("All");
  const [country, setCountry] = useState<string>("All");
  const [product, setProduct] = useState<string>("");
  const [yearRange, setYearRange] = useState<[number, number]>([defaultYears.min, defaultYears.max]);
  const [query, setQuery] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(true);

  useEffect(() => {
    if (!filters) return;
    setYearRange((current) => {
      const untouched = current[0] === 1961 && current[1] === 2024;
      return untouched ? [filters.year_range?.min ?? current[0], filters.year_range?.max ?? current[1]] : current;
    });
    setProduct((current) => current || filters.product_names[0] || "");
  }, [filters]);

  const dataParams: DataParams = {
    type: typeFilter === "All" ? undefined : typeFilter,
    country: country === "All" ? undefined : country,
    year_min: yearRange[0],
    year_max: yearRange[1],
  };

  const dataQuery = useDataQuery(dataParams);
  const rows = useMemo(() => {
    const base = dataQuery.data?.rows ?? [];
    if (!query) return base;
    const needle = query.toLowerCase();
    return base.filter((row) => `${row.country} ${row.product}`.toLowerCase().includes(needle));
  }, [dataQuery.data?.rows, query]);

  const selectedProduct = product || products[0] || "";
  const comparisonQuery = useComparisonQuery(
    { product: selectedProduct, year: yearRange[1], type: typeFilter === "All" ? undefined : typeFilter },
    Boolean(selectedProduct),
  );
  const heatmapQuery = useHeatmapQuery();
  const insightsQuery = useInsightsQuery({
    product: selectedProduct,
    year_min: yearRange[0],
    year_max: yearRange[1],
  });

  const productRows = useMemo(
    () => rows.filter((row) => row.product === selectedProduct),
    [rows, selectedProduct],
  );

  const trendData = useMemo(() => {
    const byYear = new Map<number, number[]>();
    productRows.forEach((row) => {
      if (country !== "All" && row.country !== country) return;
      const list = byYear.get(row.year) ?? [];
      list.push(row.yield);
      byYear.set(row.year, list);
    });

    return Array.from(byYear.entries())
      .sort(([a], [b]) => a - b)
      .map(([year, values]) => ({
        year,
        yield: Math.round(values.reduce((sum, value) => sum + value, 0) / values.length),
      }));
  }, [productRows, country]);

  const compareData = useMemo(() => {
    return (comparisonQuery.data?.countries ?? [])
      .map((item) => ({
        country: item.country.length > 10 ? `${item.country.slice(0, 10)}...` : item.country,
        yield: Math.round(item.value ?? 0),
      }))
      .sort((a, b) => b.yield - a.yield)
      .slice(0, 10);
  }, [comparisonQuery.data]);

  const topProducts = useMemo(() => {
    const byProduct = new Map<string, { sum: number; n: number }>();
    rows.forEach((row) => {
      const current = byProduct.get(row.product) ?? { sum: 0, n: 0 };
      current.sum += row.yield;
      current.n += 1;
      byProduct.set(row.product, current);
    });
    return Array.from(byProduct.entries())
      .map(([name, values]) => ({ product: name, yield: Math.round(values.sum / values.n) }))
      .sort((a, b) => b.yield - a.yield)
      .slice(0, 8);
  }, [rows]);

  const scatterData = useMemo(
    () => productRows.map((row) => ({ year: row.year, yield: row.yield, country: row.country })),
    [productRows],
  );

  const heatmap = heatmapQuery.data;
  const heatMax = useMemo(() => {
    return Math.max(...(heatmap?.cells.map((cell) => cell.avg_yield ?? 0) ?? [0]), 1);
  }, [heatmap]);

  const insights = useMemo(() => {
    const data = insightsQuery.data;
    return [
      { icon: Award, color: "from-emerald-500 to-teal-500", item: data?.highest_yield_country },
      { icon: TrendingUp, color: "from-sky-500 to-blue-500", item: data?.fastest_growing_product },
      { icon: Activity, color: "from-indigo-500 to-sky-500", item: data?.fastest_growing_product ? { ...data.fastest_growing_product, label: "Largest Increase" } : undefined },
      { icon: TrendingDown, color: "from-orange-500 to-amber-500", item: data?.largest_decline_product },
      { icon: Sparkles, color: "from-teal-500 to-cyan-500", item: data?.most_reported_product },
    ];
  }, [insightsQuery.data]);

  const download = (extra: DataParams = {}) => {
    window.location.href = nexusApi.exportUrl({ ...dataParams, ...extra });
  };

  const isLoading = filtersQuery.isLoading || dataQuery.isLoading;

  return (
    <div className="pt-24 pb-16 min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-widest text-accent font-medium mb-2">Explorer</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-3">Data Explorer</h1>
          <p className="text-muted-foreground max-w-2xl">
            Filter, search, and explore the Pacific Dataviz Challenge datasets across
            countries, products, and time.
          </p>
        </div>

        <div className="grid lg:grid-cols-[280px_1fr] gap-6">
          <aside className="space-y-4">
            <div className="bg-card border border-border rounded-2xl p-5 shadow-card sticky top-24">
              <button
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
                    <label className="text-xs font-medium text-muted-foreground mb-2 block">Search</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Country or product" className="pl-9" />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-2 block">Product Type</label>
                    <div className="grid grid-cols-3 gap-1 p-1 bg-muted rounded-md">
                      {typeOptions.map((type) => (
                        <button
                          key={type}
                          onClick={() => setTypeFilter(type)}
                          className={`text-xs py-1.5 rounded capitalize ${typeFilter === type ? "bg-card shadow-sm font-medium" : "text-muted-foreground"}`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  <SelectField label="Country" value={country} onChange={setCountry} options={["All", ...countries]} />
                  <SelectField label="Product" value={selectedProduct} onChange={setProduct} options={products} />

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

                  <div className="pt-2 border-t border-border text-xs text-muted-foreground">
                    {isLoading ? "Loading records..." : `${rows.length.toLocaleString()} visible records`}
                  </div>
                </div>
              )}
            </div>
          </aside>

          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {insights.map(({ icon: Icon, color, item }, index) => (
                <div key={item?.label ?? index} className="bg-card border border-border rounded-xl p-4 shadow-card">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center mb-3`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">{item?.label ?? "Loading"}</div>
                  <div className="font-semibold text-sm truncate">{item?.value ?? "..."}</div>
                  <div className="text-xs text-muted-foreground">{item?.sub ?? "Fetching live data"}</div>
                </div>
              ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <ChartCard title="Yield Trend Over Time" subtitle={selectedProduct} loading={dataQuery.isLoading} onDownload={() => download({ product: selectedProduct })}>
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="year" stroke="var(--muted-foreground)" fontSize={11} />
                    <YAxis stroke="var(--muted-foreground)" fontSize={11} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Line type="monotone" dataKey="yield" stroke="var(--ocean)" strokeWidth={2.5} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="Country Comparison" subtitle={`${selectedProduct} - ${yearRange[1]}`} loading={comparisonQuery.isLoading} onDownload={() => download({ product: selectedProduct, year_max: yearRange[1], year_min: yearRange[1] })}>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={compareData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="country" stroke="var(--muted-foreground)" fontSize={10} angle={-30} textAnchor="end" height={60} />
                    <YAxis stroke="var(--muted-foreground)" fontSize={11} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Bar dataKey="yield" fill="var(--teal)" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="Top Performing Products" subtitle="By average yield" loading={dataQuery.isLoading} onDownload={() => download()}>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={topProducts} layout="vertical" margin={{ left: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis type="number" stroke="var(--muted-foreground)" fontSize={11} />
                    <YAxis type="category" dataKey="product" stroke="var(--muted-foreground)" fontSize={11} width={90} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Bar dataKey="yield" fill="var(--ocean)" radius={[0, 6, 6, 0]}>
                      {topProducts.map((_, i) => (
                        <Cell key={i} fill={i === 0 ? "var(--teal)" : "var(--ocean)"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="Historical Growth Analysis" subtitle={selectedProduct} loading={dataQuery.isLoading} onDownload={() => download({ product: selectedProduct })}>
                <ResponsiveContainer width="100%" height={260}>
                  <AreaChart data={trendData}>
                    <defs>
                      <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--teal)" stopOpacity={0.5} />
                        <stop offset="100%" stopColor="var(--teal)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="year" stroke="var(--muted-foreground)" fontSize={11} />
                    <YAxis stroke="var(--muted-foreground)" fontSize={11} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Area type="monotone" dataKey="yield" stroke="var(--teal)" strokeWidth={2} fill="url(#areaGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="Yield Distribution" subtitle={`${selectedProduct} - all countries`} loading={dataQuery.isLoading} onDownload={() => download({ product: selectedProduct })}>
                <ResponsiveContainer width="100%" height={260}>
                  <ScatterChart>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="year" stroke="var(--muted-foreground)" fontSize={11} type="number" domain={[yearRange[0], yearRange[1]]} />
                    <YAxis dataKey="yield" stroke="var(--muted-foreground)" fontSize={11} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Scatter data={scatterData} fill="var(--ocean)" fillOpacity={0.55} />
                  </ScatterChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="Heatmap" subtitle="Country x Product (avg yield)" loading={heatmapQuery.isLoading}>
                <div className="overflow-auto h-[260px]">
                  <table className="text-[10px] border-separate border-spacing-0.5">
                    <thead>
                      <tr>
                        <th className="sticky left-0 bg-card" />
                        {(heatmap?.products ?? []).map((name) => (
                          <th key={name} className="px-1 py-1 text-muted-foreground font-normal whitespace-nowrap text-left">
                            <div className="origin-bottom-left -rotate-45 translate-y-2 w-4">{name.slice(0, 8)}</div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {(heatmap?.countries ?? []).map((countryName) => (
                        <tr key={countryName}>
                          <td className="sticky left-0 bg-card pr-2 text-muted-foreground whitespace-nowrap">{countryName.slice(0, 10)}</td>
                          {(heatmap?.products ?? []).map((productName) => {
                            const cell = heatmap?.cells.find((item) => item.country === countryName && item.product === productName);
                            const avg = cell?.avg_yield ?? 0;
                            const intensity = avg / heatMax;
                            return (
                              <td
                                key={productName}
                                title={`${countryName} - ${productName}: ${Math.round(avg)}`}
                                className="w-7 h-7 rounded"
                                style={{
                                  backgroundColor: cell?.record_count
                                    ? `oklch(0.7 0.16 230 / ${0.1 + intensity * 0.85})`
                                    : "var(--muted)",
                                }}
                              />
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </ChartCard>
            </div>
          </div>
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

const tooltipStyle = {
  backgroundColor: "var(--card)",
  border: "1px solid var(--border)",
  borderRadius: 8,
  fontSize: 12,
};

function ChartCard({
  title,
  subtitle,
  children,
  loading,
  onDownload,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  loading?: boolean;
  onDownload?: () => void;
}) {
  return (
    <div className="bg-card border border-border rounded-2xl p-5 shadow-card">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-display font-semibold">{title}</h3>
          {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>
        {onDownload && (
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-muted-foreground" onClick={onDownload}>
            <Download className="w-3.5 h-3.5" />
          </Button>
        )}
      </div>
      <div className="relative min-h-[260px]">
        {children}
        {loading && (
          <div className="absolute inset-0 grid place-items-center rounded-xl bg-card/70 text-sm text-muted-foreground backdrop-blur-sm">
            Loading...
          </div>
        )}
      </div>
    </div>
  );
}
