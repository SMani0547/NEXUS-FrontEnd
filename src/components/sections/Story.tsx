import { useEffect, useRef, useState } from "react";

function useVisible(threshold = 0.25) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setVisible(true), { threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return { ref, visible };
}

/* ── Graphic 0: Animated bar chart ── */
function AgricultureGraphic({ active }: { active: boolean }) {
  const countries = ["FJ", "PG", "SB", "VU", "WS", "TO", "KI", "FM"];
  const values = [85, 92, 61, 74, 55, 48, 38, 44];
  const max = 100;

  return (
    <svg viewBox="0 0 360 220" className="w-full h-full p-4">
      <defs>
        <linearGradient id="bar-grad-0" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#00FFD1" />
          <stop offset="100%" stopColor="#00FFD130" />
        </linearGradient>
        <linearGradient id="bar-grad-1" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#7B2FFF" />
          <stop offset="100%" stopColor="#7B2FFF30" />
        </linearGradient>
      </defs>

      {/* Grid lines */}
      {[0, 25, 50, 75, 100].map((v) => {
        const y = 185 - (v / max) * 150;
        return (
          <g key={v}>
            <line x1="30" y1={y} x2="350" y2={y} stroke="var(--home-divider)" strokeWidth="1" />
            <text x="22" y={y + 4} textAnchor="end" fontSize="9" fill="var(--home-copy-muted)" fontFamily="monospace">{v}</text>
          </g>
        );
      })}

      {/* Bars */}
      {values.map((v, i) => {
        const barW = 30;
        const gap = 40;
        const x = 35 + i * gap;
        const h = active ? (v / max) * 150 : 0;
        const y = 185 - h;
        return (
          <g key={countries[i]}>
            <rect x={x} y={y} width={barW} height={h} rx="3"
              fill={`url(#bar-grad-${i % 2})`}
              style={{
                transition: `height ${0.6 + i * 0.07}s cubic-bezier(0.16,1,0.3,1) ${i * 50}ms, y ${0.6 + i * 0.07}s cubic-bezier(0.16,1,0.3,1) ${i * 50}ms`,
                filter: `drop-shadow(0 0 6px ${i % 2 === 0 ? "#00FFD1" : "#7B2FFF"}60)`,
              }}
            />
            <text x={x + barW / 2} y="200" textAnchor="middle" fontSize="8" fill="var(--home-copy-muted)" fontFamily="monospace">
              {countries[i]}
            </text>
          </g>
        );
      })}

      {/* Y-axis */}
      <line x1="30" y1="35" x2="30" y2="185" stroke="rgba(0,255,209,0.3)" strokeWidth="1" />
      <line x1="30" y1="185" x2="350" y2="185" stroke="rgba(0,255,209,0.3)" strokeWidth="1" />
    </svg>
  );
}

/* ── Graphic 1: Climate wave ── */
function ClimateGraphic({ active }: { active: boolean }) {
  const years = Array.from({ length: 40 }, (_, i) => 1985 + i);
  const stable = years.map((_, i) => 110 + Math.sin(i * 0.4) * 20 + i * 0.3);
  const stressed = years.map((_, i) => 130 + Math.sin(i * 0.6) * 15 - i * 0.8);

  const makePath = (pts: number[]) =>
    pts.map((y, i) => `${i === 0 ? "M" : "L"}${22 + i * 8},${y}`).join(" ");

  return (
    <svg viewBox="0 0 360 220" className="w-full h-full p-4">
      <defs>
        <linearGradient id="wave-fill-a" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#00FFD1" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#00FFD1" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="wave-fill-b" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#FF2D6B" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#FF2D6B" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Area fills */}
      <path
        d={`${makePath(stable)} L${22 + 39 * 8},190 L22,190 Z`}
        fill="url(#wave-fill-a)"
        style={{ opacity: active ? 1 : 0, transition: "opacity 1s ease 0.3s" }}
      />
      <path
        d={`${makePath(stressed)} L${22 + 39 * 8},190 L22,190 Z`}
        fill="url(#wave-fill-b)"
        style={{ opacity: active ? 1 : 0, transition: "opacity 1s ease 0.5s" }}
      />

      {/* Lines */}
      <path d={makePath(stable)} fill="none" stroke="#00FFD1" strokeWidth="2"
        style={{
          strokeDasharray: 400,
          strokeDashoffset: active ? 0 : 400,
          transition: "stroke-dashoffset 1.6s cubic-bezier(0.16,1,0.3,1)",
          filter: "drop-shadow(0 0 4px #00FFD1)",
        }}
      />
      <path d={makePath(stressed)} fill="none" stroke="#FF2D6B" strokeWidth="2"
        style={{
          strokeDasharray: 400,
          strokeDashoffset: active ? 0 : 400,
          transition: "stroke-dashoffset 1.6s cubic-bezier(0.16,1,0.3,1) 0.3s",
          filter: "drop-shadow(0 0 4px #FF2D6B)",
        }}
      />

      {/* Axis */}
      <line x1="22" y1="190" x2="338" y2="190" stroke="var(--home-divider)" strokeWidth="1" />

      {/* Year labels */}
      {[1985, 2000, 2015, 2025].map((yr) => {
        const i = yr - 1985;
        return (
          <text key={yr} x={22 + i * 8} y="205" fontSize="9" fill="var(--home-copy-muted)" fontFamily="monospace">{yr}</text>
        );
      })}

      {/* Legend */}
      <g>
        <rect x="240" y="10" width="8" height="8" rx="1" fill="#00FFD1" />
        <text x="252" y="18" fontSize="9" fill="var(--home-copy-soft)" fontFamily="monospace">Pre-stress yield</text>
        <rect x="240" y="24" width="8" height="8" rx="1" fill="#FF2D6B" />
        <text x="252" y="32" fontSize="9" fill="var(--home-copy-soft)" fontFamily="monospace">Climate-affected</text>
      </g>
    </svg>
  );
}

/* ── Graphic 2: Data matrix / scatter ── */
function DataCompassGraphic({ active }: { active: boolean }) {
  const nodes = Array.from({ length: 40 }, (_, i) => ({
    x: 30 + (i % 10) * 30,
    y: 20 + Math.floor(i / 10) * 48,
    r: 4 + (i * 7 % 8),
    c: i % 3 === 0 ? "#00FFD1" : i % 3 === 1 ? "#7B2FFF" : "#FF2D6B",
    delay: i * 40,
  }));

  const connections = [
    [0, 5], [5, 10], [10, 15], [3, 8], [8, 13], [1, 6], [7, 12],
    [4, 9], [9, 14], [2, 7], [6, 11],
  ];

  return (
    <svg viewBox="0 0 360 220" className="w-full h-full p-4">
      {/* Connection lines */}
      {connections.map(([a, b], i) => {
        const na = nodes[a];
        const nb = nodes[b];
        return (
          <line key={i} x1={na.x} y1={na.y} x2={nb.x} y2={nb.y}
            stroke="#00FFD1" strokeWidth="0.6" strokeOpacity="0.15"
            style={{ opacity: active ? 1 : 0, transition: `opacity 0.4s ease ${i * 80}ms` }}
          />
        );
      })}

      {/* Nodes */}
      {nodes.map((n, i) => (
        <g key={i}>
          <circle cx={n.x} cy={n.y} r={n.r * 1.6} fill={n.c} opacity={active ? 0.1 : 0}
            style={{ transition: `opacity 0.6s ease ${n.delay}ms` }} />
          <circle cx={n.x} cy={n.y} r={n.r * 0.6} fill={n.c} opacity={active ? 0.85 : 0}
            style={{
              transition: `opacity 0.6s ease ${n.delay}ms`,
              filter: `drop-shadow(0 0 4px ${n.c})`,
            }} />
        </g>
      ))}

      {/* Axes */}
      <line x1="14" y1="200" x2="346" y2="200" stroke="rgba(0,255,209,0.15)" strokeWidth="1" />
      <line x1="14" y1="10" x2="14" y2="200" stroke="rgba(0,255,209,0.15)" strokeWidth="1" />

      <text x="180" y="215" textAnchor="middle" fontSize="9" fill="rgba(0,255,209,0.4)" fontFamily="monospace">COUNTRY INDEX</text>
      <text x="6" y="110" textAnchor="middle" fontSize="9" fill="rgba(0,255,209,0.4)" fontFamily="monospace"
        transform="rotate(-90 6 110)">YIELD INDEX</text>
    </svg>
  );
}

const blocks = [
  {
    n: "01",
    title: "A Region Defined by Agriculture",
    body: "Agriculture remains one of the most vital sectors across Pacific Island nations — sustaining communities, economies, and cultural identity across 16 countries and 64 years of recorded history.",
    graphic: AgricultureGraphic,
    color: "#00FFD1",
    tag: "CONTEXT",
  },
  {
    n: "02",
    title: "A Climate in Flux",
    body: "Climate variability, shifting weather patterns, and environmental pressures are measurably influencing agricultural productivity. The data tells the story — across decades, the signals are undeniable.",
    graphic: ClimateGraphic,
    color: "#FF2D6B",
    tag: "CHALLENGE",
  },
  {
    n: "03",
    title: "Data as a Compass",
    body: "Understanding these changes requires accessible tools — so decisions can be made with clarity, not guesswork. That's why Nexus exists: to turn raw datasets into actionable intelligence.",
    graphic: DataCompassGraphic,
    color: "#7B2FFF",
    tag: "SOLUTION",
  },
];

function StoryBlock({ block, index }: { block: typeof blocks[0]; index: number }) {
  const { ref, visible } = useVisible(0.2);
  const isLeft = index % 2 === 0;
  const Graphic = block.graphic;

  return (
    <div
      ref={ref}
      className="grid md:grid-cols-2 gap-8 lg:gap-16 items-center"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(40px)",
        transition: "opacity 0.8s ease, transform 0.8s ease",
      }}
    >
      {/* Text */}
      <div className={`${isLeft ? "md:order-1" : "md:order-2"}`}>
        <div className="flex items-center gap-3 mb-5">
          <span className="font-mono text-xs px-2 py-1 rounded"
            style={{ background: `${block.color}15`, border: `1px solid ${block.color}40`, color: block.color }}>
            {block.tag}
          </span>
          <div className="flex-1 h-px" style={{ background: `linear-gradient(to right, ${block.color}40, transparent)` }} />
        </div>

        <div
          className="font-bold leading-none mb-4"
          style={{
            fontFamily: "'Orbitron', monospace",
            fontSize: "clamp(3rem, 8vw, 6rem)",
            color: block.color,
            textShadow: `0 0 30px ${block.color}50`,
          }}
        >
          {block.n}
        </div>

        <h3
          className="font-bold mb-4"
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "clamp(1.5rem, 3vw, 2.2rem)",
            color: "var(--foreground)",
          }}
        >
          {block.title}
        </h3>

        <p className="leading-relaxed text-sm" style={{ color: "var(--home-copy-soft)", fontFamily: "'Space Grotesk', sans-serif" }}>
          {block.body}
        </p>
      </div>

      {/* Graphic card */}
      <div className={`${isLeft ? "md:order-2" : "md:order-1"} relative h-64 md:h-72`}>
        <div
          className="absolute inset-0 rounded-xl overflow-hidden"
          style={{
            background: "var(--home-panel-strong-bg)",
            border: `1px solid ${block.color}25`,
            boxShadow: `0 0 40px ${block.color}10`,
          }}
        >
          {/* Top bar */}
          <div className="flex items-center gap-2 px-4 py-2.5 border-b" style={{ borderColor: `${block.color}15` }}>
            <div className="w-2 h-2 rounded-full" style={{ background: block.color, boxShadow: `0 0 6px ${block.color}` }} />
            <span className="font-mono text-[10px] tracking-widest uppercase" style={{ color: `${block.color}80` }}>
              NEXUS — DATA PANEL {block.n}
            </span>
          </div>
          <div className="h-full">
            <Graphic active={visible} />
          </div>
        </div>
      </div>
    </div>
  );
}

export function Story() {
  return (
    <section id="story" className="relative py-24 overflow-hidden scroll-mt-20"
      style={{ background: "var(--home-section-bg)" }}>

      {/* Vertical timeline line */}
      <div className="absolute left-1/2 top-40 bottom-20 w-px hidden md:block pointer-events-none"
        style={{ background: "linear-gradient(to bottom, transparent, color-mix(in oklab, var(--color-accent) 30%, transparent) 20%, color-mix(in oklab, var(--color-accent) 30%, transparent) 80%, transparent)" }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="max-w-3xl mb-20">
          <p className="font-mono text-xs uppercase tracking-[0.4em] mb-4" style={{ color: "#00FFD1" }}>
            Story
          </p>
          <h2
            className="font-bold leading-none mb-4"
            style={{
              fontFamily: "'Orbitron', monospace",
              fontSize: "clamp(2.2rem, 5vw, 3.5rem)",
              color: "var(--foreground)",
            }}
          >
            THE STORY BEHIND
            <br />
            <span style={{ color: "#00FFD1", textShadow: "0 0 20px #00FFD1" }}>THE DATA</span>
          </h2>
          <p className="text-lg font-light" style={{ color: "var(--home-copy-muted)", fontFamily: "'Space Grotesk', sans-serif" }}>
            Why Pacific agriculture matters — and what the numbers reveal.
          </p>
        </div>

        <div className="space-y-20 md:space-y-32">
          {blocks.map((b, i) => (
            <StoryBlock key={b.n} block={b} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
