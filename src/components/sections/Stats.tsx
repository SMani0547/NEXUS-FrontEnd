import { useEffect, useRef, useState } from "react";
import { Globe2, Sprout, Calendar, Database } from "lucide-react";
import { STATS } from "@/lib/mock-data";

function useCountUp(target: number, duration = 1500, start = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    const t0 = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, start]);
  return value;
}

function StatCard({
  icon: Icon, label, value, description,
}: { icon: typeof Globe2; label: string; value: number; description: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && setVisible(true),
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const n = useCountUp(value, 1600, visible);

  return (
    <div
      ref={ref}
      className="group relative bg-card rounded-2xl p-8 shadow-card border border-border hover:shadow-elegant transition-all duration-300 hover:-translate-y-1"
    >
      <div className="w-12 h-12 rounded-xl bg-gradient-ocean flex items-center justify-center mb-6 shadow-glow">
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div className="font-display text-5xl font-bold mb-1 tabular-nums">
        {n.toLocaleString()}
      </div>
      <div className="text-sm font-medium text-foreground mb-2">{label}</div>
      <div className="text-sm text-muted-foreground">{description}</div>
    </div>
  );
}

export function Stats() {
  const items = [
    { icon: Globe2, label: "Countries Covered", value: STATS.countries, description: "Pacific Island countries and territories tracked." },
    { icon: Sprout, label: "Products Tracked", value: STATS.products, description: "Crops and livestock across the region." },
    { icon: Calendar, label: "Years Available", value: STATS.years, description: "Years of historical yield data." },
    { icon: Database, label: "Total Records", value: STATS.records, description: "Disaggregated data points analyzed." },
  ];
  return (
    <section className="relative py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-sm uppercase tracking-widest text-accent font-medium mb-3">By the numbers</p>
          <h2 className="text-4xl md:text-5xl font-bold">The Pacific, quantified</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((it) => <StatCard key={it.label} {...it} />)}
        </div>
      </div>
    </section>
  );
}
