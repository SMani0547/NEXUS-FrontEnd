import { Database, ExternalLink, FileSpreadsheet, Terminal, Shield, Zap } from "lucide-react";
import { useEffect, useState } from "react";

const dataSourceLinks = [
  {
    name: "Crop Yield — Disaggregated",
    desc: "Crop production data by country, product, and year.",
    size: "2.4 MB",
    records: "8,241",
    href: "https://stats.pacificdata.org/vis?lc=en&df[ds]=SPC2&df[id]=DF_AGRICULTURAL_PRODUCTION&df[ag]=SPC&df[vs]=1.0&av=true&dq=A...&pd=,&to[TIME_PERIOD]=false",
    color: "#00FFD1",
  },
  {
    name: "Livestock Yield — Disaggregated",
    desc: "Livestock head counts and yields across the region.",
    size: "1.8 MB",
    records: "4,159",
    href: "https://stats.pacificdata.org/vis?lc=en&df[ds]=SPC2&df[id]=DF_AGRICULTURAL_PRODUCTION&df[ag]=SPC&df[vs]=1.0&av=true&dq=A...&pd=,&to[TIME_PERIOD]=false",
    color: "#7B2FFF",
  },
];

function DataPipeline() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setStep((s) => (s + 1) % 6), 1100);
    return () => clearInterval(t);
  }, []);

  const stages = [
    { label: "SPC RAW", x: 40, color: "#00FFD1" },
    { label: "PARSE", x: 155, color: "#7B2FFF" },
    { label: "VALIDATE", x: 270, color: "#FF2D6B" },
    { label: "NEXUS DB", x: 385, color: "#00A8FF" },
  ];

  return (
    <svg viewBox="0 0 460 80" className="w-full">
      <defs>
        <filter id="pipe-glow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Connector lines */}
      {stages.slice(0, -1).map((s, i) => (
        <line key={i}
          x1={s.x + 52} y1="40"
          x2={stages[i + 1].x - 2} y2="40"
          stroke="var(--home-divider)" strokeWidth="2" strokeDasharray="4 6"
        />
      ))}

      {/* Animated packet */}
      {[0, 1, 2].map((offset) => {
        const pStep = (step + offset * 2) % 6;
        if (pStep >= stages.length - 1) return null;
        const from = stages[pStep].x + 50;
        const to = stages[pStep + 1].x;
        const prog = ((step + offset * 2 * 0.33) % 1);
        const x = from + (to - from) * 0.5;
        return (
          <circle key={offset} cx={x} cy="40" r="3"
            fill={stages[pStep].color}
            filter="url(#pipe-glow)"
            opacity="0.8"
          />
        );
      })}

      {/* Stage nodes */}
      {stages.map((s, i) => (
        <g key={s.label}>
          <rect x={s.x} y="22" width="52" height="36" rx="6"
            fill={i <= Math.floor(step / 1.5) % stages.length ? `${s.color}20` : "rgba(15,23,42,0.05)"}
            stroke={i <= Math.floor(step / 1.5) % stages.length ? s.color : "var(--home-divider)"}
            strokeWidth="1"
            style={{ transition: "fill 0.3s, stroke 0.3s", filter: `drop-shadow(0 0 6px ${s.color}40)` }}
          />
          <text x={s.x + 26} y="44" textAnchor="middle" fontSize="7"
            fill={i <= Math.floor(step / 1.5) % stages.length ? s.color : "var(--home-copy-muted)"}
            fontFamily="monospace" fontWeight="bold">
            {s.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

function TerminalLog() {
  const lines = [
    { text: "$ nexus init --source=pacific-dataviz-2026", color: "#00FFD1" },
    { text: "> Connecting to SPC data portal...", color: "var(--home-copy-muted)" },
    { text: "> Fetching DF_AGRICULTURAL_PRODUCTION...", color: "var(--home-copy-muted)" },
    { text: "[OK] 2 datasets loaded", color: "#00FFD1" },
    { text: "[OK] 16 countries indexed", color: "#00FFD1" },
    { text: "[OK] 78 products catalogued", color: "#00FFD1" },
    { text: "[OK] Null values normalized", color: "#00FFD1" },
    { text: "> AI engine — initialized", color: "#7B2FFF" },
    { text: "$ nexus ready ✓", color: "#00FFD1" },
  ];

  const [visible, setVisible] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setVisible((v) => Math.min(v + 1, lines.length)), 320);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="font-mono text-xs leading-6 space-y-0.5">
      {lines.slice(0, visible).map((line, i) => (
        <div key={i} style={{ color: line.color, opacity: 0.9 }}>
          {line.text}
          {i === visible - 1 && (
            <span className="inline-block w-2 h-4 ml-0.5 bg-current align-middle animate-pulse" />
          )}
        </div>
      ))}
    </div>
  );
}

function DataNotes() {
  const notes = [
    { icon: Shield, text: "Not every country reports every product", color: "#00FFD1" },
    { icon: Database, text: "Not every product exists in every country", color: "#7B2FFF" },
    { icon: Zap, text: "Missing values are handled gracefully", color: "#FF2D6B" },
    { icon: Terminal, text: "Data availability varies by year", color: "#00A8FF" },
  ];

  return (
    <div className="space-y-3">
      {notes.map((n) => (
        <div key={n.text} className="flex items-start gap-3 group">
          <div className="w-7 h-7 rounded flex items-center justify-center flex-shrink-0 mt-0.5"
            style={{ background: `${n.color}15`, border: `1px solid ${n.color}30` }}>
            <n.icon className="w-3.5 h-3.5" style={{ color: n.color }} />
          </div>
          <span className="text-sm leading-relaxed" style={{ color: "var(--home-copy-soft)", fontFamily: "'Space Grotesk', sans-serif" }}>
            {n.text}
          </span>
        </div>
      ))}
    </div>
  );
}

export function DataSources() {
  return (
    <section id="sources" className="relative py-24 overflow-hidden scroll-mt-20"
      style={{ background: "var(--home-section-alt-bg)" }}>

      {/* Background hex */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.08] dark:opacity-[0.03]"
        style={{
          backgroundImage: "linear-gradient(var(--home-grid-color) 1px, transparent 1px), linear-gradient(90deg, var(--home-grid-color) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="max-w-3xl mb-16">
          <p className="font-mono text-xs uppercase tracking-[0.4em] mb-4" style={{ color: "#00FFD1" }}>
            Data Layer
          </p>
          <h2
            className="font-bold leading-none mb-4"
            style={{
              fontFamily: "'Orbitron', monospace",
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              color: "var(--foreground)",
            }}
          >
            DATA{" "}
            <span style={{ color: "#00FFD1", textShadow: "0 0 20px #00FFD1" }}>SOURCES</span>
          </h2>
          <p className="text-base" style={{ color: "var(--home-copy-muted)", fontFamily: "'Space Grotesk', sans-serif" }}>
            Every visualization in Nexus is grounded in official Pacific Dataviz Challenge datasets.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-6">
          {/* Main source card */}
          <div className="lg:col-span-8 rounded-xl overflow-hidden"
            style={{
              background: "var(--home-panel-bg)",
              border: "1px solid rgba(0,255,209,0.15)",
              boxShadow: "0 0 40px rgba(0,255,209,0.06)",
            }}>

            {/* Title bar */}
            <div className="flex items-center gap-3 px-6 py-4"
              style={{ borderBottom: "1px solid rgba(0,255,209,0.1)" }}>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ background: "rgba(0,255,209,0.1)", border: "1px solid rgba(0,255,209,0.25)" }}>
                <Database className="w-5 h-5" style={{ color: "#00FFD1" }} />
              </div>
              <div>
                <h3 className="font-mono font-bold text-base" style={{ color: "var(--foreground)" }}>
                  Pacific Dataviz Challenge 2026
                </h3>
                <p className="font-mono text-xs" style={{ color: "rgba(0,255,209,0.5)" }}>
                  Official SPC datasets — stats.pacificdata.org
                </p>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#00FFD1] animate-pulse" />
                <span className="font-mono text-[10px] tracking-widest" style={{ color: "rgba(0,255,209,0.7)" }}>LIVE</span>
              </div>
            </div>

            {/* Pipeline */}
            <div className="px-6 py-5 border-b" style={{ borderColor: "var(--home-divider)" }}>
              <p className="font-mono text-[10px] uppercase tracking-widest mb-3" style={{ color: "var(--home-copy-muted)" }}>
                Data Pipeline
              </p>
              <DataPipeline />
            </div>

            {/* Source files */}
            <div className="p-6">
              <p className="font-mono text-[10px] uppercase tracking-widest mb-4" style={{ color: "var(--home-copy-muted)" }}>
                Source Files
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {dataSourceLinks.map((d) => (
                  <a
                    key={d.name}
                    href={d.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative rounded-lg p-4 transition-all"
                    style={{
                      background: "rgba(255,255,255,0.45)",
                      border: `1px solid ${d.color}20`,
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = `${d.color}60`;
                      (e.currentTarget as HTMLElement).style.background = `${d.color}08`;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = `${d.color}20`;
                      (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.45)";
                    }}
                  >
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <FileSpreadsheet className="w-4 h-4 flex-shrink-0" style={{ color: d.color }} />
                      <ExternalLink className="w-3.5 h-3.5 flex-shrink-0 transition-colors"
                        style={{ color: "var(--home-copy-muted)" }} />
                    </div>
                    <div className="font-mono font-semibold text-sm mb-1" style={{ color: "var(--foreground)" }}>{d.name}</div>
                    <div className="text-xs mb-3" style={{ color: "var(--home-copy-muted)", fontFamily: "'Space Grotesk', sans-serif" }}>{d.desc}</div>
                    <div className="flex gap-4">
                      <span className="font-mono text-[10px]" style={{ color: d.color }}>↓ {d.size}</span>
                      <span className="font-mono text-[10px]" style={{ color: "var(--home-copy-muted)" }}>{d.records} rows</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* Terminal */}
            <div className="rounded-xl flex-1 overflow-hidden"
              style={{
                background: "var(--home-terminal-bg)",
                border: "1px solid rgba(0,255,209,0.12)",
              }}>
              <div className="flex items-center gap-2 px-4 py-3"
                style={{ borderBottom: "1px solid rgba(0,255,209,0.1)" }}>
                <Terminal className="w-3.5 h-3.5" style={{ color: "#00FFD1" }} />
                <span className="font-mono text-[10px] tracking-widest uppercase" style={{ color: "rgba(0,255,209,0.6)" }}>
                  NEXUS INIT LOG
                </span>
              </div>
              <div className="p-4 min-h-[160px]">
                <TerminalLog />
              </div>
            </div>

            {/* Data notes */}
            <div className="rounded-xl p-6"
              style={{
                background: "var(--home-panel-strong-bg)",
                border: "1px solid rgba(123,47,255,0.2)",
              }}>
              <p className="font-mono text-[10px] uppercase tracking-widest mb-5" style={{ color: "rgba(123,47,255,0.8)" }}>
                Data Notes
              </p>
              <DataNotes />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
