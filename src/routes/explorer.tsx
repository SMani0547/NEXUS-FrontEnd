import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  ScatterChart, Scatter, XAxis, YAxis, Tooltip, CartesianGrid,
  ResponsiveContainer, Legend, Cell,
} from "recharts";
import { Search, SlidersHorizontal, Download, TrendingUp, TrendingDown, Award, Activity, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { COUNTRIES, CROPS, LIVESTOCK, DATASET, YEARS } from "@/lib/mock-data";

export const Route = createFileRoute("/explorer")({
  head: () => ({
    meta: [
      { title: "Data Explorer — NEXUS" },
      { name: "description", content: "Interactive Pacific agriculture data explorer with multiple visualizations and smart insights." },
    ],
  }),
  component: Explorer,
});

const ALL_PRODUCTS = [...CROPS, ...LIVESTOCK];

function Explorer() {
  const [typeFilter, setTypeFilter] = useState<"All" | "Crop" | "Livestock">("All");
  const [country, setCountry] = useState<string>("All");
  const [product, setProduct] = useState<string>("Taro");
  const [yearRange, setYearRange] = useState<[number, number]>([YEARS[0], YEARS[YEARS.length - 1]]);
  const [query, setQuery] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(true);

  const filtered = useMemo(() => {
    return DATASET.filter((r) => {
      if (typeFilter !== "All" && r.type !== typeFilter) return false;
      if (country !== "All" && r.country !== country) return false;
      if (r.year < yearRange[0] || r.year > yearRange[1]) return false;
      if (query && !`${r.country} ${r.product}`.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [typeFilter, country, yearRange, query]);

  // Chart 1: Yield over time for selected product
  const trendData = useMemo(() => {
    return YEARS
      .filter((y) => y >= yearRange[0] && y <= yearRange[1])
      .map((year) => {
        const rows = filtered.filter((r) => r.product === product && r.year === year);
        const avg = rows.length ? rows.reduce((s, r) => s + r.yield, 0) / rows.length : null;
        return { year, yield: avg ? Math.round(avg) : null };
      });
  }, [filtered, product, yearRange]);

  // Chart 2: Country comparison for selected product (latest year in range)
  const compareData = useMemo(() => {
    const y = yearRange[1];
    return COUNTRIES.map((c) => {
      const row = DATASET.find((r) => r.country === c && r.product === product && r.year === y);
      return { country: c.length > 10 ? c.slice(0, 10) + "…" : c, yield: row?.yield ?? 0 };
    })
      .sort((a, b) => b.yield - a.yield)
      .slice(0, 10);
  }, [product, yearRange]);

  // Chart 3: Top products
  const topProducts = useMemo(() => {
    const byProduct: Record<string, { sum: number; n: number }> = {};
    filtered.forEach((r) => {
      byProduct[r.product] ??= { sum: 0, n: 0 };
      byProduct[r.product].sum += r.yield;
      byProduct[r.product].n += 1;
    });
    return Object.entries(byProduct)
      .map(([p, { sum, n }]) => ({ product: p, yield: Math.round(sum / n) }))
      .sort((a, b) => b.yield - a.yield)
      .slice(0, 8);
  }, [filtered]);

  // Chart 4: Historical growth (area)
  const growthData = trendData;

  // Chart 5: Scatter — yield vs year for filtered
  const scatterData = useMemo(() => {
    return filtered
      .filter((r) => r.product === product)
      .map((r) => ({ year: r.year, yield: r.yield, country: r.country }));
  }, [filtered, product]);

  // Chart 6: Heatmap — country vs product (avg yield)
  const heatProducts = ALL_PRODUCTS.slice(0, 10);
  const heatCountries = COUNTRIES.slice(0, 10);
  const heatMax = useMemo(() => {
    let m = 0;
    heatCountries.forEach((c) =>
      heatProducts.forEach((p) => {
        const rows = DATASET.filter((r) => r.country === c && r.product === p);
        if (rows.length) m = Math.max(m, rows.reduce((s, r) => s + r.yield, 0) / rows.length);
      })
    );
    return m;
  }, []);

  // Smart insights
  const insights = useMemo(() => {
    const lastY = yearRange[1];
    const firstY = yearRange[0];
    const byCountry: Record<string, number[]> = {};
    DATASET.filter((r) => r.product === product).forEach((r) => {
      (byCountry[r.country] ??= []).push(r.yield);
    });

    let topCountry = "—", topVal = 0;
    Object.entries(byCountry).forEach(([c, vs]) => {
      const avg = vs.reduce((s, v) => s + v, 0) / vs.length;
      if (avg > topVal) { topVal = avg; topCountry = c; }
    });

    let fastest = "—", fastestPct = 0, decliner = "—", declinePct = 0;
    ALL_PRODUCTS.forEach((p) => {
      const start = DATASET.filter((r) => r.product === p && r.year === firstY);
      const end = DATASET.filter((r) => r.product === p && r.year === lastY);
      if (!start.length || !end.length) return;
      const s = start.reduce((a, r) => a + r.yield, 0) / start.length;
      const e = end.reduce((a, r) => a + r.yield, 0) / end.length;
      const pct = ((e - s) / s) * 100;
      if (pct > fastestPct) { fastestPct = pct; fastest = p; }
      if (pct < declinePct) { declinePct = pct; decliner = p; }
    });

    const reportCount: Record<string, number> = {};
    DATASET.forEach((r) => { reportCount[r.product] = (reportCount[r.product] ?? 0) + 1; });
    const mostReported = Object.entries(reportCount).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";

    return [
      { icon: Award, label: "Highest Yield Country", value: topCountry, sub: `${Math.round(topVal)} avg`, color: "from-emerald-500 to-teal-500" },
      { icon: TrendingUp, label: "Fastest Growing Product", value: fastest, sub: `${fastestPct.toFixed(1)}% over period`, color: "from-sky-500 to-blue-500" },
      { icon: Activity, label: "Largest Increase", value: fastest, sub: `+${fastestPct.toFixed(1)}%`, color: "from-indigo-500 to-sky-500" },
      { icon: TrendingDown, label: "Largest Decline", value: decliner, sub: `${declinePct.toFixed(1)}%`, color: "from-orange-500 to-amber-500" },
      { icon: Sparkles, label: "Most Reported Product", value: mostReported, sub: `${reportCount[mostReported]} records`, color: "from-teal-500 to-cyan-500" },
    ];
  }, [product, yearRange]);

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
          {/* Filters */}
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
                      {(["All", "Crop", "Livestock"] as const).map((t) => (
                        <button
                          key={t}
                          onClick={() => setTypeFilter(t)}
                          className={`text-xs py-1.5 rounded ${typeFilter === t ? "bg-card shadow-sm font-medium" : "text-muted-foreground"}`}
                        >{t}</button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-2 block">Country</label>
                    <select value={country} onChange={(e) => setCountry(e.target.value)}
                      className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm">
                      <option>All</option>
                      {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-2 block">Product</label>
                    <select value={product} onChange={(e) => setProduct(e.target.value)}
                      className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm">
                      <optgroup label="Crops">{CROPS.map((c) => <option key={c}>{c}</option>)}</optgroup>
                      <optgroup label="Livestock">{LIVESTOCK.map((c) => <option key={c}>{c}</option>)}</optgroup>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-2 block">
                      Year Range: <span className="text-foreground">{yearRange[0]} – {yearRange[1]}</span>
                    </label>
                    <Slider
                      value={yearRange}
                      min={YEARS[0]}
                      max={YEARS[YEARS.length - 1]}
                      step={1}
                      onValueChange={(v) => setYearRange([v[0], v[1]] as [number, number])}
                    />
                  </div>

                  <div className="pt-2 border-t border-border text-xs text-muted-foreground">
                    {filtered.length.toLocaleString()} records
                  </div>
                </div>
              )}
            </div>
          </aside>

          {/* Charts area */}
          <div className="space-y-6">
            {/* Insights row */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {insights.map((i) => (
                <div key={i.label} className="bg-card border border-border rounded-xl p-4 shadow-card">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${i.color} flex items-center justify-center mb-3`}>
                    <i.icon className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">{i.label}</div>
                  <div className="font-semibold text-sm truncate">{i.value}</div>
                  <div className="text-xs text-muted-foreground">{i.sub}</div>
                </div>
              ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <ChartCard title="Yield Trend Over Time" subtitle={product}>
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

              <ChartCard title="Country Comparison" subtitle={`${product} · ${yearRange[1]}`}>
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

              <ChartCard title="Top Performing Products" subtitle="By average yield">
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

              <ChartCard title="Historical Growth Analysis" subtitle={product}>
                <ResponsiveContainer width="100%" height={260}>
                  <AreaChart data={growthData}>
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

              <ChartCard title="Yield Distribution" subtitle={`${product} · all countries`}>
                <ResponsiveContainer width="100%" height={260}>
                  <ScatterChart>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="year" stroke="var(--muted-foreground)" fontSize={11} type="number" domain={[YEARS[0], YEARS[YEARS.length - 1]]} />
                    <YAxis dataKey="yield" stroke="var(--muted-foreground)" fontSize={11} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Scatter data={scatterData} fill="var(--ocean)" fillOpacity={0.55} />
                  </ScatterChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="Heatmap" subtitle="Country × Product (avg yield)">
                <div className="overflow-auto h-[260px]">
                  <table className="text-[10px] border-separate border-spacing-0.5">
                    <thead>
                      <tr>
                        <th className="sticky left-0 bg-card" />
                        {heatProducts.map((p) => (
                          <th key={p} className="px-1 py-1 text-muted-foreground font-normal whitespace-nowrap text-left">
                            <div className="origin-bottom-left -rotate-45 translate-y-2 w-4">{p.slice(0, 8)}</div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {heatCountries.map((c) => (
                        <tr key={c}>
                          <td className="sticky left-0 bg-card pr-2 text-muted-foreground whitespace-nowrap">{c.slice(0, 10)}</td>
                          {heatProducts.map((p) => {
                            const rows = DATASET.filter((r) => r.country === c && r.product === p);
                            const avg = rows.length ? rows.reduce((s, r) => s + r.yield, 0) / rows.length : 0;
                            const intensity = avg / heatMax;
                            return (
                              <td key={p} title={`${c} · ${p}: ${Math.round(avg)}`}
                                className="w-7 h-7 rounded"
                                style={{
                                  backgroundColor: rows.length
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

const tooltipStyle = {
  backgroundColor: "var(--card)",
  border: "1px solid var(--border)",
  borderRadius: 8,
  fontSize: 12,
};

function ChartCard({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-5 shadow-card">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-display font-semibold">{title}</h3>
          {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-muted-foreground">
          <Download className="w-3.5 h-3.5" />
        </Button>
      </div>
      {children}
    </div>
  );
}
