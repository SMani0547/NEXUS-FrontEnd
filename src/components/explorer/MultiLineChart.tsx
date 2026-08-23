import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { MultiTrendsResponse } from "@/lib/api/client";
import { ClientChart } from "./ChartCard";
import { colorForIndex, tooltipStyle } from "./chartTheme";

function toWide(series: MultiTrendsResponse["series"]) {
  const years = new Map<number, Record<string, number | null>>();
  series.forEach((item) => {
    item.points.forEach((point) => {
      const row = years.get(point.year) ?? { year: point.year };
      row[item.country] = point.value;
      years.set(point.year, row);
    });
  });
  return Array.from(years.entries())
    .sort(([a], [b]) => a - b)
    .map(([, row]) => row);
}

export function MultiLineChart({
  series,
  unit,
  height = 280,
}: {
  series: MultiTrendsResponse["series"];
  unit?: string | null;
  height?: number;
}) {
  const data = toWide(series);
  const countries = series.map((item) => item.country);

  return (
    <ClientChart height={height}>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="year" stroke="var(--muted-foreground)" fontSize={11} />
          <YAxis stroke="var(--muted-foreground)" fontSize={11} />
          <Tooltip
            contentStyle={tooltipStyle}
            formatter={(value, name) => [
              value == null ? "—" : `${Math.round(Number(value)).toLocaleString()}${unit ? ` ${unit}` : ""}`,
              String(name),
            ]}
          />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          {countries.map((country, index) => (
            <Line
              key={country}
              type="monotone"
              dataKey={country}
              stroke={colorForIndex(index)}
              strokeWidth={2}
              dot={false}
              connectNulls
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </ClientChart>
  );
}
