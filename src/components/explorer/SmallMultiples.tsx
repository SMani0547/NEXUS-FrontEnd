import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ClientChart } from "./ChartCard";
import { tooltipStyle } from "./chartTheme";

export type SmallMultipleSeries = {
  product: string;
  unit?: string;
  points: { year: number; value: number | null }[];
};

export function SmallMultiples({ items }: { items: SmallMultipleSeries[] }) {
  if (!items.length) {
    return <p className="text-sm text-muted-foreground py-8 text-center">No livestock series available.</p>;
  }

  return (
    <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {items.map((item) => (
        <div key={item.product} className="rounded-xl border border-border bg-background/60 p-3">
          <div className="mb-2 flex items-baseline justify-between gap-2">
            <h4 className="text-sm font-medium truncate">{item.product}</h4>
            {item.unit && <span className="text-[10px] text-muted-foreground">{item.unit}</span>}
          </div>
          <ClientChart height={140}>
            <ResponsiveContainer width="100%" height={140}>
              <AreaChart data={item.points}>
                <XAxis dataKey="year" hide />
                <YAxis hide />
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(value) => [value == null ? "—" : Math.round(Number(value)).toLocaleString(), item.product]}
                />
                <Area type="monotone" dataKey="value" stroke="var(--warning)" fill="oklch(0.78 0.16 75 / 0.25)" strokeWidth={1.5} />
              </AreaChart>
            </ResponsiveContainer>
          </ClientChart>
        </div>
      ))}
    </div>
  );
}
