import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Calendar, Database, Globe2, Sprout, Beef } from "lucide-react";
import { useRankingsQuery, useTypeSummaryQuery } from "@/hooks/useNexusApi";
import { AnimatedCounter } from "./AnimatedCounter";
import { ChartCard, ClientChart } from "./ChartCard";
import { DonutChart } from "./DonutChart";
import { tooltipStyle, TYPE_COLORS } from "./chartTheme";

export function OverviewTab() {
  const summaryQuery = useTypeSummaryQuery();
  const rankingsQuery = useRankingsQuery({ limit: 10 });
  const summary = summaryQuery.data;
  const crop = summary?.types.crop;
  const livestock = summary?.types.livestock;
  const yearSpan = summary?.year_range ? summary.year_range.max - summary.year_range.min + 1 : 0;

  const donut = [
    { name: "Crop", value: crop?.record_count ?? 0, color: TYPE_COLORS.crop },
    { name: "Livestock", value: livestock?.record_count ?? 0, color: TYPE_COLORS.livestock },
  ];

  const topProducts = (rankingsQuery.data?.products ?? []).map((item) => ({
    product: item.product.length > 16 ? `${item.product.slice(0, 16)}…` : item.product,
    yield: Math.round(item.avg_yield ?? 0),
    type: item.type,
  }));

  const coverage = summary?.coverage ?? [];
  const globalMin = summary?.year_range?.min ?? 1961;
  const globalMax = summary?.year_range?.max ?? 2024;
  const span = Math.max(1, globalMax - globalMin);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <AnimatedCounter label="Countries" value={summary?.total_countries ?? 0} icon={Globe2} accent="from-sky-500 to-blue-500" />
        <AnimatedCounter label="Crop products" value={crop?.product_count ?? 0} icon={Sprout} accent="from-emerald-500 to-teal-500" />
        <AnimatedCounter label="Livestock products" value={livestock?.product_count ?? 0} icon={Beef} accent="from-orange-500 to-amber-500" />
        <AnimatedCounter label="Year span" value={yearSpan} suffix="yrs" icon={Calendar} accent="from-indigo-500 to-sky-500" />
        <AnimatedCounter label="Records" value={summary?.total_records ?? 0} icon={Database} accent="from-teal-500 to-cyan-500" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <ChartCard title="Crop vs Livestock" subtitle="Share of records in the dataset" loading={summaryQuery.isLoading}>
          <div className="grid md:grid-cols-[1fr_160px] gap-4 items-center">
            <DonutChart data={donut} />
            <div className="space-y-3 text-sm">
              <div>
                <div className="flex items-center gap-2 font-medium"><span className="h-2.5 w-2.5 rounded-full" style={{ background: TYPE_COLORS.crop }} /> Crop</div>
                <p className="text-xs text-muted-foreground">{crop?.product_count ?? 0} products · {crop?.unit ?? "kg/ha"}</p>
              </div>
              <div>
                <div className="flex items-center gap-2 font-medium"><span className="h-2.5 w-2.5 rounded-full" style={{ background: TYPE_COLORS.livestock }} /> Livestock</div>
                <p className="text-xs text-muted-foreground">{livestock?.product_count ?? 0} products · {livestock?.unit ?? "kg/animal"}</p>
              </div>
            </div>
          </div>
        </ChartCard>

        <ChartCard title="Top 10 Products" subtitle="By average yield · green = crop, orange = livestock" loading={rankingsQuery.isLoading}>
          <ClientChart>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={topProducts} layout="vertical" margin={{ left: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis type="number" stroke="var(--muted-foreground)" fontSize={11} />
                <YAxis type="category" dataKey="product" stroke="var(--muted-foreground)" fontSize={11} width={100} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="yield" radius={[0, 6, 6, 0]}>
                  {topProducts.map((item) => (
                    <Cell key={item.product} fill={item.type === "livestock" ? TYPE_COLORS.livestock : TYPE_COLORS.crop} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ClientChart>
        </ChartCard>
      </div>

      <ChartCard title="Year coverage" subtitle="Which countries report data, and over which years" loading={summaryQuery.isLoading} minHeight={120}>
        <div className="space-y-2">
          {coverage.map((row) => {
            const left = ((row.year_min - globalMin) / span) * 100;
            const width = ((row.year_max - row.year_min) / span) * 100;
            return (
              <div key={row.country} className="flex items-center gap-3">
                <span className="w-32 shrink-0 text-xs truncate">{row.country}</span>
                <div className="relative h-2 flex-1 rounded bg-muted">
                  <div
                    className="absolute h-2 rounded bg-[var(--ocean)]"
                    style={{ left: `${left}%`, width: `${Math.max(width, 1.5)}%` }}
                    title={`${row.year_min}–${row.year_max} · ${row.record_count.toLocaleString()} records`}
                  />
                </div>
                <span className="w-24 shrink-0 text-right text-[10px] text-muted-foreground">
                  {row.year_min}–{row.year_max}
                </span>
              </div>
            );
          })}
        </div>
      </ChartCard>
    </div>
  );
}
