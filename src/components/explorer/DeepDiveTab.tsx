import { useMemo } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  useComparisonQuery,
  useCountryProfileQuery,
  useDataQuery,
  useMultiTrendsQuery,
} from "@/hooks/useNexusApi";
import { nexusApi, type DataParams } from "@/lib/api/client";
import { ChartCard, ClientChart } from "./ChartCard";
import { DataTable } from "./DataTable";
import { MultiLineChart } from "./MultiLineChart";
import { SmallMultiples } from "./SmallMultiples";
import { tooltipStyle } from "./chartTheme";

export function DeepDiveTab({
  kind,
  product,
  country,
  yearRange,
  onProductChange,
  products,
}: {
  kind: "crop" | "livestock";
  product: string;
  country: string;
  yearRange: [number, number];
  onProductChange: (value: string) => void;
  products: string[];
}) {
  const dataParams: DataParams = {
    type: kind,
    product,
    country: country === "All" ? undefined : country,
    year_min: yearRange[0],
    year_max: yearRange[1],
  };
  const tableParams: DataParams = { ...dataParams, country: country === "All" ? undefined : country };
  const dataQuery = useDataQuery(tableParams);
  const trendsQuery = useMultiTrendsQuery(
    { product, type: kind, year_min: yearRange[0], year_max: yearRange[1] },
    Boolean(product),
  );
  const comparisonQuery = useComparisonQuery(
    { product, year: yearRange[1], type: kind },
    Boolean(product),
  );
  const livestockDataQuery = useDataQuery({ type: "livestock", year_min: yearRange[0], year_max: yearRange[1] });
  const profileCountry = country === "All" ? null : country;
  const profileQuery = useCountryProfileQuery(kind === "livestock" ? profileCountry : null);

  const rows = Array.isArray(dataQuery.data?.rows) ? dataQuery.data.rows : [];
  const compareData = (comparisonQuery.data?.countries ?? [])
    .map((item) => ({
      country: item.country.length > 12 ? `${item.country.slice(0, 12)}…` : item.country,
      yield: Math.round(item.value ?? 0),
    }))
    .slice(0, 12);

  const trendAverage = useMemo(() => {
    const byYear = new Map<number, number[]>();
    (trendsQuery.data?.series ?? []).forEach((series) => {
      series.points.forEach((point) => {
        if (point.value == null) return;
        const list = byYear.get(point.year) ?? [];
        list.push(point.value);
        byYear.set(point.year, list);
      });
    });
    return Array.from(byYear.entries())
      .sort(([a], [b]) => a - b)
      .map(([year, values]) => ({
        year,
        yield: Math.round(values.reduce((sum, value) => sum + value, 0) / values.length),
      }));
  }, [trendsQuery.data]);

  const multiples = useMemo(() => {
    const livestockRows = livestockDataQuery.data?.rows ?? [];
    const grouped = new Map<string, { unit: string; byYear: Map<number, number[]> }>();
    livestockRows.forEach((row) => {
      const current = grouped.get(row.product) ?? { unit: row.unit, byYear: new Map() };
      const list = current.byYear.get(row.year) ?? [];
      list.push(row.yield);
      current.byYear.set(row.year, list);
      grouped.set(row.product, current);
    });
    return Array.from(grouped.entries()).map(([name, values]) => ({
      product: name,
      unit: values.unit,
      points: Array.from(values.byYear.entries())
        .sort(([a], [b]) => a - b)
        .map(([year, list]) => ({
          year,
          value: list.reduce((sum, item) => sum + item, 0) / list.length,
        })),
    }));
  }, [livestockDataQuery.data]);

  const radarData = (profileQuery.data?.latest_values ?? [])
    .filter((item) => item.type === "livestock")
    .map((item) => ({
      product: item.product.length > 14 ? `${item.product.slice(0, 14)}…` : item.product,
      value: Math.round(item.value ?? 0),
    }));

  const unitNote = kind === "crop" ? "Kilograms per hectare" : "Kilograms per animal";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">{kind === "crop" ? "Crop deep-dive" : "Livestock deep-dive"}</p>
          <h2 className="font-display text-2xl font-semibold">{product || "Select a product"}</h2>
          <p className="text-xs text-muted-foreground mt-1">{unitNote}</p>
        </div>
        <label className="text-xs text-muted-foreground">
          Product
          <select
            value={product}
            onChange={(event) => onProductChange(event.target.value)}
            className="mt-1 block min-w-[220px] bg-background border border-input rounded-md px-3 py-2 text-sm text-foreground"
          >
            {products.map((name) => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
        </label>
      </div>

      {kind === "livestock" && (
        <ChartCard title="All livestock products" subtitle="Average yield across countries" loading={livestockDataQuery.isLoading} minHeight={160}>
          <SmallMultiples items={multiples} />
        </ChartCard>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        <ChartCard
          title="Multi-country trend"
          subtitle={`${product} · all reporting countries`}
          loading={trendsQuery.isLoading}
          onDownload={() => { window.location.href = nexusApi.exportUrl({ type: kind, product, year_min: yearRange[0], year_max: yearRange[1] }); }}
          minHeight={280}
        >
          <MultiLineChart series={trendsQuery.data?.series ?? []} unit={trendsQuery.data?.unit} />
        </ChartCard>

        <ChartCard title="Country ranking" subtitle={`${product} · ${yearRange[1]}`} loading={comparisonQuery.isLoading}>
          <ClientChart>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={compareData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="country" stroke="var(--muted-foreground)" fontSize={10} angle={-30} textAnchor="end" height={60} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="yield" fill={kind === "crop" ? "var(--teal)" : "var(--warning)"} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ClientChart>
        </ChartCard>

        <ChartCard title="Regional average over time" subtitle={product} loading={trendsQuery.isLoading}>
          <ClientChart>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={trendAverage}>
                <defs>
                  <linearGradient id={`${kind}-area`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={kind === "crop" ? "var(--teal)" : "var(--warning)"} stopOpacity={0.5} />
                    <stop offset="100%" stopColor={kind === "crop" ? "var(--teal)" : "var(--warning)"} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="year" stroke="var(--muted-foreground)" fontSize={11} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="yield" stroke={kind === "crop" ? "var(--teal)" : "var(--warning)"} strokeWidth={2} fill={`url(#${kind}-area)`} />
              </AreaChart>
            </ResponsiveContainer>
          </ClientChart>
        </ChartCard>

        {kind === "livestock" && (
          <ChartCard
            title="Livestock portfolio"
            subtitle={profileCountry ? `${profileCountry} · latest reported values` : "Choose a country in Filters to compare its livestock mix"}
            loading={profileQuery.isLoading}
          >
            {profileCountry && radarData.length > 0 ? (
              <ClientChart>
                <ResponsiveContainer width="100%" height={260}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="var(--border)" />
                    <PolarAngleAxis dataKey="product" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Radar dataKey="value" stroke="var(--warning)" fill="var(--warning)" fillOpacity={0.35} />
                  </RadarChart>
                </ResponsiveContainer>
              </ClientChart>
            ) : (
              <p className="grid h-[260px] place-items-center text-sm text-muted-foreground">
                {profileCountry ? "No livestock values for this country." : "Select a country to see its livestock radar."}
              </p>
            )}
          </ChartCard>
        )}
      </div>

      <ChartCard title="Raw data" subtitle={`${rows.length.toLocaleString()} rows for ${product}`} loading={dataQuery.isLoading} minHeight={200}>
        <DataTable rows={rows} />
      </ChartCard>
    </div>
  );
}
