import { useEffect, useRef, useState } from "react";
import { Globe2, Sprout, Calendar, Database } from "lucide-react";
import { useSummaryQuery } from "@/hooks/useNexusApi";

function useCountUp(target: number, duration = 1800, start = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start || target === 0) return;
    const t0 = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 4);
      setValue(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, start]);
  return value;
}

function DataRing({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = max > 0 ? value / max : 0;
  const r = 36;
  const circ = 2 * Math.PI * r;
  const dash = pct * circ;

  return (
    <svg viewBox="0 0 88 88" className="w-full h-full" style={{ transform: "rotate(-90deg)" }}>
      <circle cx="44" cy="44" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
      <circle cx="44" cy="44" r={r} fill="none" stroke={color} strokeWidth="3"
        strokeDasharray={`${dash.toFixed(2)} ${circ.toFixed(2)}`}
        strokeLinecap="round"
        style={{ filter: `drop-shadow(0 0 6px ${color})`, transition: "stroke-dasharray 1.6s cubic-bezier(0.16,1,0.3,1)" }}
      />
    </svg>
  );
}

function StatCard({
  icon: Icon, label, value, description, color, max, index,
}: {
  icon: typeof Globe2; label: string; value: number;
  description: string; color: string; max: number; index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const n = useCountUp(value, 1800, visible);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setVisible(true), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: y * -12, y: x * 12 });
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      className="relative cursor-default"
      style={{
        perspective: "800px",
        animationDelay: `${index * 120}ms`,
      }}
    >
      <div
        className="relative rounded-xl p-6 overflow-hidden transition-transform duration-100 ease-out"
        style={{
          background: "linear-gradient(135deg, rgba(26,10,74,0.9) 0%, rgba(3,0,28,0.95) 100%)",
          border: `1px solid ${color}28`,
          boxShadow: `0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.06), 0 20px 60px rgba(0,0,0,0.5), 0 0 40px ${color}18`,
          transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(0)`,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Holographic shimmer */}
        <div className="absolute inset-0 pointer-events-none rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `linear-gradient(105deg, transparent 40%, ${color}10 50%, transparent 60%)`,
          }}
        />

        {/* Corner accent */}
        <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none"
          style={{
            background: `radial-gradient(circle at top right, ${color}20, transparent 70%)`,
          }}
        />

        {/* Ring + Icon */}
        <div className="flex items-start gap-5 mb-5">
          <div className="relative w-16 h-16 flex-shrink-0">
            <div className="absolute inset-0">
              <DataRing value={n} max={max} color={color} />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Icon className="w-5 h-5" style={{ color }} />
            </div>
          </div>
          <div className="pt-1">
            <div className="font-mono text-xs uppercase tracking-widest mb-1" style={{ color: "rgba(255,255,255,0.35)" }}>
              {label}
            </div>
            <div
              className="font-bold tabular-nums leading-none"
              style={{
                fontFamily: "'Orbitron', monospace",
                fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
                color,
                textShadow: `0 0 20px ${color}70`,
              }}
            >
              {n.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs font-mono leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>
          {description}
        </p>

        {/* Bottom bar */}
        <div className="absolute bottom-0 left-0 right-0 h-px"
          style={{ background: `linear-gradient(to right, transparent, ${color}60, transparent)` }}
        />
      </div>
    </div>
  );
}

function LiveTicker() {
  const items = [
    "CROP_YIELD.CSV — LOADED",
    "LIVESTOCK_HEAD.CSV — LOADED",
    "16 COUNTRIES INDEXED",
    "78 PRODUCTS TRACKED",
    "AI MODEL — ONLINE",
    "VISUALIZATION ENGINE — READY",
  ];
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % items.length), 2200);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="flex items-center gap-3 mb-4">
      <span className="w-2 h-2 rounded-full bg-[#00FFD1] animate-pulse flex-shrink-0" />
      <span className="font-mono text-xs tracking-widest overflow-hidden"
        style={{ color: "#00FFD1" }}>
        {items[idx]}
      </span>
    </div>
  );
}

export function Stats() {
  const { data, isLoading } = useSummaryQuery();

  const items = [
    {
      icon: Globe2, label: "Countries Covered",
      value: data?.total_countries ?? 16,
      description: "Pacific Island nations and territories tracked across the full dataset.",
      color: "#00FFD1",
      max: 20,
    },
    {
      icon: Sprout, label: "Products Tracked",
      value: data?.total_products ?? 78,
      description: "Crop and livestock categories across all 16 nations.",
      color: "#7B2FFF",
      max: 100,
    },
    {
      icon: Calendar, label: "Years of Data",
      value: data?.total_years ?? 64,
      description: "Historical agricultural records from 1960 through present day.",
      color: "#FF2D6B",
      max: 80,
    },
    {
      icon: Database, label: "Total Records",
      value: data?.total_records ?? 12400,
      description: "Disaggregated data points available for visualization and analysis.",
      color: "#00A8FF",
      max: 15000,
    },
  ];

  return (
    <section className="relative py-24 overflow-hidden" style={{ background: "#03001C" }}>
      {/* Background grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: "linear-gradient(rgba(0,255,209,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,209,1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(123,47,255,0.08) 0%, transparent 70%)" }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-14">
          <LiveTicker />
          <p className="font-mono text-xs uppercase tracking-[0.4em] mb-3" style={{ color: "rgba(0,255,209,0.6)" }}>
            System Status — All Systems Nominal
          </p>
          <h2
            className="font-bold leading-none"
            style={{
              fontFamily: "'Orbitron', monospace",
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              color: "#ffffff",
              textShadow: "0 0 40px rgba(0,255,209,0.2)",
            }}
          >
            THE PACIFIC,{" "}
            <span style={{ color: "#00FFD1", textShadow: "0 0 20px #00FFD1" }}>QUANTIFIED</span>
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map((it, i) => <StatCard key={it.label} {...it} index={i} />)}
        </div>

        {isLoading && (
          <p className="mt-6 text-center font-mono text-xs tracking-widest animate-pulse" style={{ color: "rgba(0,255,209,0.5)" }}>
            ↻ FETCHING LIVE DATASET SUMMARY...
          </p>
        )}
      </div>
    </section>
  );
}
