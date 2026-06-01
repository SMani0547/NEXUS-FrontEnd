import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { COUNTRIES, DATASET, YEARS } from "@/lib/mock-data";
import { TrendingUp, TrendingDown, MapPin, X } from "lucide-react";

export const Route = createFileRoute("/map")({
  head: () => ({
    meta: [
      { title: "Pacific Map — NEXUS" },
      { name: "description", content: "Interactive map of Pacific Island countries and their agricultural yield data." },
    ],
  }),
  component: MapPage,
});

// Approximate Pacific positions (lat/lon roughly mapped to SVG coords)
const PLACES: Record<string, { x: number; y: number; size?: number }> = {
  "Papua New Guinea":   { x: 120, y: 360, size: 18 },
  "Solomon Islands":    { x: 210, y: 380, size: 14 },
  "Vanuatu":            { x: 250, y: 430, size: 12 },
  "New Caledonia":      { x: 270, y: 480, size: 12 },
  "Fiji":               { x: 360, y: 430, size: 14 },
  "Tonga":              { x: 410, y: 470, size: 10 },
  "Samoa":              { x: 440, y: 400, size: 10 },
  "Niue":               { x: 470, y: 445, size: 8 },
  "Cook Islands":       { x: 540, y: 455, size: 10 },
  "French Polynesia":   { x: 640, y: 460, size: 12 },
  "Tuvalu":             { x: 400, y: 360, size: 8 },
  "Kiribati":           { x: 470, y: 330, size: 10 },
  "Marshall Islands":   { x: 360, y: 250, size: 10 },
  "Micronesia":         { x: 260, y: 290, size: 12 },
  "Palau":              { x: 160, y: 290, size: 8 },
};

function MapPage() {
  const [selected, setSelected] = useState<string | null>("Fiji");
  const [hover, setHover] = useState<string | null>(null);

  const summary = useMemo(() => {
    if (!selected) return null;
    const rows = DATASET.filter((r) => r.country === selected);
    if (!rows.length) return null;
    const products = Array.from(new Set(rows.map((r) => r.product)));
    const lastY = YEARS[YEARS.length - 1];
    const firstY = YEARS[0];
    const latest = rows.filter((r) => r.year === lastY);
    const earliest = rows.filter((r) => r.year === firstY);
    const latestAvg = latest.length ? latest.reduce((s, r) => s + r.yield, 0) / latest.length : 0;
    const earliestAvg = earliest.length ? earliest.reduce((s, r) => s + r.yield, 0) / earliest.length : latestAvg;
    const growth = earliestAvg ? ((latestAvg - earliestAvg) / earliestAvg) * 100 : 0;
    return {
      products,
      latest: Math.round(latestAvg),
      growth,
      yearsCount: new Set(rows.map((r) => r.year)).size,
    };
  }, [selected]);

  return (
    <div className="pt-24 pb-16 min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-widest text-accent font-medium mb-2">Geographic Explorer</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-3">Pacific Map</h1>
          <p className="text-muted-foreground max-w-2xl">
            Click any country to see its agricultural profile.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr_360px] gap-6">
          {/* Map */}
          <div className="relative bg-gradient-to-br from-[oklch(0.21_0.05_260)] to-[oklch(0.16_0.05_260)] rounded-2xl overflow-hidden border border-border shadow-card aspect-[4/3]">
            {/* grid */}
            <div
              className="absolute inset-0 opacity-[0.06]"
              style={{
                backgroundImage:
                  "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />
            <svg viewBox="0 0 800 600" className="absolute inset-0 w-full h-full">
              {/* Ocean ripples */}
              {[100, 200, 300, 400].map((r) => (
                <circle key={r} cx="400" cy="380" r={r} fill="none" stroke="var(--ocean)" strokeOpacity="0.08" strokeWidth="1" />
              ))}

              {/* Connection lines */}
              {selected && PLACES[selected] && COUNTRIES.map((c) => {
                if (c === selected || !PLACES[c]) return null;
                const a = PLACES[selected];
                const b = PLACES[c];
                return (
                  <line
                    key={c}
                    x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                    stroke="var(--teal)" strokeOpacity="0.15" strokeWidth="1" strokeDasharray="2 4"
                  />
                );
              })}

              {COUNTRIES.map((c) => {
                const p = PLACES[c];
                if (!p) return null;
                const isSelected = selected === c;
                const isHover = hover === c;
                const size = (p.size ?? 10) + (isSelected ? 6 : isHover ? 3 : 0);
                return (
                  <g
                    key={c}
                    onMouseEnter={() => setHover(c)}
                    onMouseLeave={() => setHover(null)}
                    onClick={() => setSelected(c)}
                    className="cursor-pointer"
                  >
                    {(isSelected || isHover) && (
                      <circle cx={p.x} cy={p.y} r={size + 8} fill="var(--teal)" fillOpacity="0.15" />
                    )}
                    <circle
                      cx={p.x} cy={p.y} r={size}
                      fill={isSelected ? "var(--teal)" : "var(--ocean)"}
                      stroke="white"
                      strokeOpacity={isSelected ? 0.9 : 0.3}
                      strokeWidth={isSelected ? 2 : 1}
                    />
                    {(isSelected || isHover) && (
                      <text
                        x={p.x} y={p.y - size - 8}
                        textAnchor="middle"
                        fill="white"
                        fontSize="11"
                        fontWeight="500"
                      >{c}</text>
                    )}
                  </g>
                );
              })}
            </svg>

            <div className="absolute bottom-4 left-4 text-white/40 text-xs font-mono uppercase tracking-widest">
              Pacific Ocean · 15 territories
            </div>
            <div className="absolute top-4 right-4 flex gap-2">
              <div className="px-3 py-1.5 rounded-md bg-white/10 backdrop-blur-md border border-white/10 text-white/80 text-xs">
                {COUNTRIES.length} countries
              </div>
            </div>
          </div>

          {/* Detail panel */}
          <aside className="bg-card border border-border rounded-2xl shadow-card overflow-hidden flex flex-col">
            {selected && summary ? (
              <>
                <div className="bg-gradient-ocean p-6 text-white relative">
                  <button onClick={() => setSelected(null)} className="absolute top-3 right-3 w-7 h-7 rounded-md bg-white/10 hover:bg-white/20 flex items-center justify-center">
                    <X className="w-4 h-4" />
                  </button>
                  <div className="w-12 h-12 rounded-lg bg-white/15 backdrop-blur-md flex items-center justify-center mb-3">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <h3 className="font-display text-2xl font-bold">{selected}</h3>
                  <p className="text-white/70 text-sm">Pacific Island Country</p>
                </div>

                <div className="p-6 space-y-5">
                  <div className="grid grid-cols-2 gap-3">
                    <Stat label="Latest Yield" value={summary.latest.toLocaleString()} />
                    <Stat
                      label="Growth"
                      value={`${summary.growth >= 0 ? "+" : ""}${summary.growth.toFixed(1)}%`}
                      trend={summary.growth >= 0 ? "up" : "down"}
                    />
                    <Stat label="Products" value={summary.products.length.toString()} />
                    <Stat label="Years Reported" value={summary.yearsCount.toString()} />
                  </div>

                  <div>
                    <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Products Available</div>
                    <div className="flex flex-wrap gap-1.5">
                      {summary.products.map((p) => (
                        <span key={p} className="text-xs px-2 py-1 rounded-md bg-muted text-muted-foreground">{p}</span>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-xl bg-muted/50 p-4 text-sm text-muted-foreground border border-border">
                    {selected} reports {summary.products.length} agricultural products across {summary.yearsCount} years, with {summary.growth >= 0 ? "an overall positive" : "a declining"} yield trajectory over the period.
                  </div>
                </div>
              </>
            ) : (
              <div className="p-10 text-center text-muted-foreground">
                <MapPin className="w-8 h-8 mx-auto mb-3 opacity-40" />
                Select a country on the map to view its agricultural profile.
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, trend }: { label: string; value: string; trend?: "up" | "down" }) {
  return (
    <div className="rounded-xl border border-border p-3">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">{label}</div>
      <div className="font-display text-lg font-semibold flex items-center gap-1">
        {value}
        {trend === "up" && <TrendingUp className="w-3.5 h-3.5 text-[var(--success)]" />}
        {trend === "down" && <TrendingDown className="w-3.5 h-3.5 text-[var(--warning)]" />}
      </div>
    </div>
  );
}
