import { useEffect, useRef, useState, type ComponentType } from "react";
import { cn } from "@/lib/utils";

function useCountUp(target: number, duration = 1200, start = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    const origin = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const progress = Math.min(1, (now - origin) / duration);
      const eased = 1 - Math.pow(1 - progress, 4);
      setValue(Math.round(target * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration, start]);
  return value;
}

export function AnimatedCounter({
  label,
  value,
  suffix,
  icon: Icon,
  accent = "from-sky-500 to-teal-500",
}: {
  label: string;
  value: number;
  suffix?: string;
  icon?: ComponentType<{ className?: string }>;
  accent?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const display = useCountUp(value, 1200, visible);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setVisible(true);
    }, { threshold: 0.3 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="bg-card border border-border rounded-xl p-4 shadow-card">
      {Icon && (
        <div className={cn("w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center mb-3", accent)}>
          <Icon className="w-4 h-4 text-white" />
        </div>
      )}
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">{label}</div>
      <div className="font-display text-2xl font-semibold tabular-nums">
        {display.toLocaleString()}
        {suffix ? <span className="text-sm font-medium text-muted-foreground ml-1">{suffix}</span> : null}
      </div>
    </div>
  );
}
