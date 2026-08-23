import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { ClientChart } from "./ChartCard";
import { tooltipStyle } from "./chartTheme";

export type DonutSlice = {
  name: string;
  value: number;
  color: string;
};

export function DonutChart({ data, height = 260 }: { data: DonutSlice[]; height?: number }) {
  const total = data.reduce((sum, slice) => sum + slice.value, 0);

  return (
    <ClientChart height={height}>
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={68}
            outerRadius={96}
            paddingAngle={3}
            stroke="none"
          >
            {data.map((slice) => (
              <Cell key={slice.name} fill={slice.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={tooltipStyle}
            formatter={(value) => {
              const numeric = Number(value ?? 0);
              const share = total ? Math.round((numeric / total) * 100) : 0;
              return [`${numeric.toLocaleString()} (${share}%)`, "Records"];
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </ClientChart>
  );
}
