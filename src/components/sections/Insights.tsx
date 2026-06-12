import { TrendingUp, MapPinned, Leaf, Trophy, CloudRain, Lightbulb } from "lucide-react";
import { useState, useRef, useEffect } from "react";

function MiniSparkline({ color }: { color: string }) {
  const pts = [60, 45, 70, 40, 65, 50, 80, 55, 90, 72];
  const max = Math.max(...pts);
  const min = Math.min(...pts);
  const norm = pts.map((v) => ((v - min) / (max - min)) * 28 + 4);
  const path = norm.map((y, i) => `${i === 0 ? "M" : "L"}${4 + i * 10.2},${36 - y}`).join(" ");
  const gradientId = `spark-${color.replace(/[^a-z0-9]/gi, "")}`;

  return (
    <svg viewBox="0 0 100 40" className="w-full h-8">
      <defs>
        <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${path} L${4 + 9 * 10.2},36 L4,36 Z`} fill={`url(#${gradientId})`} />
      <path d={path} fill="none" stroke={color} strokeWidth="1.5"
        style={{ filter: `drop-shadow(0 0 3px ${color})` }} />
    </svg>
  );
}

function MiniMap({ color }: { color: string }) {
  const dots = [
    [40, 55], [65, 60], [55, 70], [45, 65], [30, 70],
    [80, 45], [25, 55], [70, 75], [50, 40], [85, 65],
  ];
  return (
    <svg viewBox="0 0 100 40" className="w-full h-8">
      {dots.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y / 2 + 5} r={2.5} fill={color}
          opacity={0.3 + (i % 4) * 0.18}
          style={{ filter: `drop-shadow(0 0 3px ${color})` }}
        />
      ))}
    </svg>
  );
}

function MiniBar({ color }: { color: string }) {
  const bars = [0.6, 0.9, 0.4, 0.75, 0.55, 0.85];
  return (
    <svg viewBox="0 0 100 40" className="w-full h-8">
      {bars.map((h, i) => (
        <rect key={i} x={4 + i * 16} y={36 - h * 28} width="12" height={h * 28} rx="2"
          fill={color} opacity={0.5 + i * 0.05}
          style={{ filter: `drop-shadow(0 0 3px ${color}80)` }}
        />
      ))}
    </svg>
  );
}

const insights = [
  {
    icon: MapPinned,
    title: "Regional Trends",
    body: "Patterns of agricultural productivity across geographic zones of the Pacific.",
    color: "var(--insight-teal)",
    mini: MiniMap,
    tag: "GEO",
  },
  {
    icon: Trophy,
    title: "Country Performance",
    body: "How each nation's yield evolves year over year — winners and shifting leaders.",
    color: "var(--insight-violet)",
    mini: MiniSparkline,
    tag: "RANK",
  },
  {
    icon: Leaf,
    title: "Agricultural Diversity",
    body: "Which countries cultivate the broadest mix of crops and livestock products.",
    color: "var(--insight-teal)",
    mini: MiniBar,
    tag: "DIVERSITY",
  },
  {
    icon: TrendingUp,
    title: "Growth Leaders",
    body: "Products and regions experiencing the strongest sustained growth signals.",
    color: "var(--insight-pink)",
    mini: MiniSparkline,
    tag: "GROWTH",
  },
  {
    icon: CloudRain,
    title: "Climate Vulnerability",
    body: "Signals of declining yields that may correlate with ongoing climate stress.",
    color: "var(--insight-blue)",
    mini: MiniSparkline,
    tag: "CLIMATE",
  },
  {
    icon: Lightbulb,
    title: "Opportunity Areas",
    body: "Untapped categories where targeted investment could yield meaningful returns.",
    color: "var(--insight-violet)",
    mini: MiniMap,
    tag: "INTEL",
  },
];

function InsightCard({ insight, idx }: { insight: typeof insights[0]; index?: number; idx: number }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setVisible(true), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: y * -12, y: x * 12 });
  };

  const Mini = insight.mini;

  return (
    <div
      ref={ref}
      className="relative"
      style={{
        perspective: "900px",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(30px)",
        transition: `opacity 0.6s ease ${idx * 80}ms, transform 0.6s ease ${idx * 80}ms`,
      }}
    >
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => { setHovered(false); setTilt({ x: 0, y: 0 }); }}
        onMouseMove={handleMove}
        className="relative rounded-xl p-6 overflow-hidden cursor-default h-full"
        style={{
          background: hovered
            ? `linear-gradient(135deg, color-mix(in srgb, ${insight.color} 8%, var(--card)) 0%, var(--card) 100%)`
            : "var(--home-panel-bg)",
          border: `1px solid color-mix(in srgb, ${insight.color} ${hovered ? "48%" : "24%"}, transparent)`,
          boxShadow: hovered
            ? `var(--insight-card-hover-shadow), inset 0 1px 0 color-mix(in srgb, ${insight.color} 18%, transparent)`
            : "var(--shadow-card)",
          transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(${hovered ? 8 : 0}px)`,
          transformStyle: "preserve-3d",
          transition: "border-color 0.3s, box-shadow 0.3s, background 0.3s, transform 0.15s",
        }}
      >
        {/* Tag + index */}
        <div className="flex items-center justify-between mb-5">
          <span className="font-mono text-[10px] tracking-widest px-2 py-0.5 rounded"
            style={{
              background: `color-mix(in srgb, ${insight.color} 10%, transparent)`,
              border: `1px solid color-mix(in srgb, ${insight.color} 30%, transparent)`,
              color: insight.color,
            }}>
            {insight.tag}
          </span>
          <span className="font-mono text-xs" style={{ color: "var(--home-copy-muted)" }}>
            0{idx + 1}
          </span>
        </div>

        {/* Icon */}
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
          style={{
            background: `color-mix(in srgb, ${insight.color} 10%, transparent)`,
            border: `1px solid color-mix(in srgb, ${insight.color} 28%, transparent)`,
          }}
        >
          <insight.icon className="w-4 h-4" style={{ color: insight.color }} />
        </div>

        {/* Title */}
        <h3 className="font-mono font-bold text-base mb-2 uppercase tracking-wide" style={{ color: "var(--foreground)" }}>
          {insight.title}
        </h3>
        <p className="text-xs leading-relaxed mb-5" style={{ color: "var(--home-copy-muted)", fontFamily: "'Space Grotesk', sans-serif" }}>
          {insight.body}
        </p>

        {/* Mini chart */}
        <div
          style={{ borderTop: `1px solid color-mix(in srgb, ${insight.color} 18%, transparent)` }}
          className="pt-3"
        >
          <Mini color={insight.color} />
        </div>

        {/* Glow bottom line */}
        <div className="absolute bottom-0 left-0 right-0 h-px transition-opacity duration-300"
          style={{
            background: `linear-gradient(to right, transparent, color-mix(in srgb, ${insight.color} 70%, transparent), transparent)`,
            opacity: hovered ? 1 : 0,
          }}
        />
      </div>
    </div>
  );
}

function MatrixRain() {
  const chars = "01データ農業気候01".split("");
  return (
    <svg className="absolute right-0 top-0 bottom-0 w-32 pointer-events-none opacity-[0.08] dark:opacity-[0.04]" preserveAspectRatio="xMidYMid slice">
      {chars.map((c, i) => (
        <text key={i} x="50%" y={`${(i * 11) % 100}%`} textAnchor="middle"
          fontSize="12" fill="var(--insight-teal)" fontFamily="monospace">
          <animate attributeName="opacity" values="0;1;0" dur={`${2 + i * 0.3}s`}
            begin={`${i * 0.4}s`} repeatCount="indefinite" />
          {c}
        </text>
      ))}
    </svg>
  );
}

export function Insights() {
  return (
    <section id="insights" className="relative py-24 overflow-hidden scroll-mt-20"
      style={{ background: "var(--home-section-bg)" }}>

      <MatrixRain />

      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 50% at 50% 50%, var(--home-teal-glow) 0%, transparent 70%)" }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="max-w-3xl mb-16">
          <p className="font-mono text-xs uppercase tracking-[0.4em] mb-4" style={{ color: "var(--insight-teal)" }}>
            Intelligence Layer
          </p>
          <h2
            className="font-bold leading-none mb-4"
            style={{
              fontFamily: "'Orbitron', monospace",
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              color: "var(--foreground)",
            }}
          >
            DISCOVER{" "}
            <span
              style={{
                color: "var(--insight-teal)",
                textShadow: "var(--insight-heading-glow)",
              }}
            >
              HIDDEN
            </span>
            <br />PATTERNS
          </h2>
          <p className="text-base" style={{ color: "var(--home-copy-muted)", fontFamily: "'Space Grotesk', sans-serif" }}>
            AI-assisted lenses on the official Pacific Dataviz Challenge datasets —
            surfacing what raw numbers alone can never show.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {insights.map((insight, i) => (
            <InsightCard key={insight.title} insight={insight} idx={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
