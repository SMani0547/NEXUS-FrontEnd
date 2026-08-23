import { useEffect, useMemo, useState } from "react";
import { useQueries } from "@tanstack/react-query";
import { Pause, Play } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useComparisonQuery } from "@/hooks/useNexusApi";
import { nexusApi } from "@/lib/api/client";
import { ChartCard, ClientChart } from "./ChartCard";
import { colorForIndex, tooltipStyle } from "./chartTheme";

const MAX_COUNTRIES = 5;

export function CompareTab({
  countries,
  product,
  products,
  yearRange,
  onProductChange,
}: {
  countries: string[];
  product: string;
  products: string[];
  yearRange: [number, number];
  onProductChange: (value: string) => void;
}) {
  const [selected, setSelected] = useState<string[]>([]);
  const [playYear, setPlayYear] = useState(yearRange[1]);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    setSelected((current) => {
      if (current.length) return current.filter((name) => countries.includes(name));
      return countries.slice(0, 3);
    });
  }, [countries]);

  useEffect(() => {
    setPlayYear((current) => Math.min(Math.max(current, yearRange[0]), yearRange[1]));
  }, [yearRange]);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      setPlayYear((current) => {
        if (current >= yearRange[1]) {
          setPlaying(false);
          return yearRange[1];
        }
        return current + 1;
      });
    }, 280);
    return () => window.clearInterval(timer);
  }, [playing, yearRange]);

  const toggle = (name: string) => {
    setSelected((current) => {
      if (current.includes(name)) return current.filter((item) => item !== name);
      if (current.length >= MAX_COUNTRIES) return current;
      return [...current, name];
    });
  };

  const profiles = useQueries({
    queries: selected.map((country) => ({
      queryKey: ["nexus", "country-profile", country],
      queryFn: () => nexusApi.countryProfile(country),
      enabled: selected.length > 0,
    })),
  });

  const comparisonQuery = useComparisonQuery(
    { product, year: playYear },
    Boolean(product),
  );

  const sideBySide = profiles.map((query, index) => {
    const country = selected[index];
    const values = (query.data?.latest_values ?? [])
      .slice()
      .sort((a, b) => (b.value ?? 0) - (a.value ?? 0))
      .slice(0, 6)
      .map((item) => ({
        product: item.product.length > 14 ? `${item.product.slice(0, 14)}…` : item.product,
        yield: Math.round(item.value ?? 0),
        type: item.type,
      }));
    return { country, values, loading: query.isLoading };
  });

  const grouped = useMemo(() => {
    const wanted = new Set(selected.map((name) => name.toLowerCase()));
    return (comparisonQuery.data?.countries ?? [])
      .filter((item) => wanted.has(item.country.toLowerCase()))
      .map((item) => ({
        country: item.country,
        yield: Math.round(item.value ?? 0),
      }));
  }, [comparisonQuery.data, selected]);

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-2xl p-5 shadow-card space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-display font-semibold">Select countries</h3>
            <p className="text-xs text-muted-foreground">Pick 2–{MAX_COUNTRIES} countries to compare. Units stay product-specific.</p>
          </div>
          <label className="text-xs text-muted-foreground">
            Product
            <select
              value={product}
              onChange={(event) => onProductChange(event.target.value)}
              className="mt-1 block min-w-[200px] bg-background border border-input rounded-md px-3 py-2 text-sm text-foreground"
            >
              {products.map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </label>
        </div>
        <div className="flex flex-wrap gap-2">
          {countries.map((name, index) => {
            const checked = selected.includes(name);
            return (
              <label
                key={name}
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs cursor-pointer ${
                  checked ? "border-transparent text-white" : "border-border text-muted-foreground"
                }`}
                style={checked ? { backgroundColor: colorForIndex(index) } : undefined}
              >
                <Checkbox checked={checked} onCheckedChange={() => toggle(name)} className="h-3.5 w-3.5 border-white/70" />
                {name}
              </label>
            );
          })}
        </div>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {sideBySide.map((item) => (
          <ChartCard key={item.country} title={item.country} subtitle="Top products, latest year" loading={item.loading} minHeight={220}>
            <ClientChart height={220}>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={item.values} layout="vertical" margin={{ left: 8 }}>
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="product" width={90} fontSize={10} stroke="var(--muted-foreground)" />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="yield" fill="var(--ocean)" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ClientChart>
          </ChartCard>
        ))}
      </div>

      <ChartCard
        title="Same product across countries"
        subtitle={`${product} · ${playYear}`}
        loading={comparisonQuery.isLoading}
        minHeight={280}
      >
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <Button size="sm" variant="outline" onClick={() => setPlaying((current) => !current)}>
            {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            {playing ? "Pause" : "Play timeline"}
          </Button>
          <input
            type="range"
            min={yearRange[0]}
            max={yearRange[1]}
            value={playYear}
            onChange={(event) => {
              setPlaying(false);
              setPlayYear(Number(event.target.value));
            }}
            className="flex-1 min-w-[160px]"
          />
          <span className="text-sm font-medium tabular-nums">{playYear}</span>
        </div>
        <ClientChart>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={grouped}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="country" stroke="var(--muted-foreground)" fontSize={11} />
              <YAxis stroke="var(--muted-foreground)" fontSize={11} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="yield" fill="var(--teal)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ClientChart>
      </ChartCard>
    </div>
  );
}
