import { Target, Eye, Compass } from "lucide-react";
import { useState } from "react";

function CircuitLines() {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.07]" preserveAspectRatio="xMidYMid slice">
      <defs>
        <pattern id="circuit" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
          {/* Horizontal traces */}
          <line x1="0" y1="30" x2="90" y2="30" stroke="#00FFD1" strokeWidth="0.8" />
          <line x1="0" y1="90" x2="120" y2="90" stroke="#00FFD1" strokeWidth="0.8" />
          {/* Vertical traces */}
          <line x1="30" y1="0" x2="30" y2="60" stroke="#7B2FFF" strokeWidth="0.8" />
          <line x1="90" y1="30" x2="90" y2="120" stroke="#7B2FFF" strokeWidth="0.8" />
          {/* Corner joints */}
          <circle cx="30" cy="30" r="2.5" fill="#00FFD1" />
          <circle cx="90" cy="90" r="2.5" fill="#7B2FFF" />
          <circle cx="90" cy="30" r="1.5" fill="#00FFD1" />
          {/* L-joint */}
          <line x1="30" y1="60" x2="60" y2="60" stroke="#00FFD1" strokeWidth="0.8" />
          <circle cx="60" cy="60" r="1.5" fill="#00FFD1" />
          <line x1="60" y1="60" x2="60" y2="90" stroke="#00FFD1" strokeWidth="0.8" />
          <circle cx="60" cy="90" r="2" fill="#FF2D6B" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#circuit)" />
    </svg>
  );
}

function NexusLogo3D() {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <defs>
        <radialGradient id="core-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(0,255,209,0.6)" />
          <stop offset="100%" stopColor="rgba(0,255,209,0)" />
        </radialGradient>
        <filter id="glow-f">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Outer ring */}
      <circle cx="100" cy="100" r="85" fill="none" stroke="#00FFD1" strokeWidth="1" strokeOpacity="0.2" strokeDasharray="8 16" />
      {/* Middle ring */}
      <circle cx="100" cy="100" r="60" fill="none" stroke="#7B2FFF" strokeWidth="1" strokeOpacity="0.25" />
      {/* Inner glow */}
      <circle cx="100" cy="100" r="35" fill="url(#core-glow)" opacity="0.5" />
      <circle cx="100" cy="100" r="35" fill="none" stroke="#00FFD1" strokeWidth="1.5" strokeOpacity="0.6" />

      {/* X strokes — nexus mark */}
      <g filter="url(#glow-f)">
        <line x1="70" y1="70" x2="130" y2="130" stroke="#00FFD1" strokeWidth="3" strokeLinecap="round" />
        <line x1="130" y1="70" x2="70" y2="130" stroke="#00FFD1" strokeWidth="3" strokeLinecap="round" />
      </g>

      {/* Hub dots */}
      {[0, 60, 120, 180, 240, 300].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const x = 100 + 60 * Math.cos(rad);
        const y = 100 + 60 * Math.sin(rad);
        return (
          <circle key={i} cx={x} cy={y} r="4" fill={i % 2 === 0 ? "#00FFD1" : "#7B2FFF"}
            style={{ filter: `drop-shadow(0 0 4px ${i % 2 === 0 ? "#00FFD1" : "#7B2FFF"})` }}
          />
        );
      })}

      {/* Core dot */}
      <circle cx="100" cy="100" r="6" fill="#fff" style={{ filter: "drop-shadow(0 0 8px #00FFD1)" }} />
    </svg>
  );
}

const cards = [
  {
    icon: Target,
    id: "mission",
    label: "01",
    title: "Mission",
    body: "To make Pacific agricultural data accessible, explorable, and meaningful — for researchers, policymakers, and communities who need it most.",
    color: "#00FFD1",
    accent: "rgba(0,255,209,0.15)",
  },
  {
    icon: Eye,
    id: "vision",
    label: "02",
    title: "Vision",
    body: "A Pacific where every farmer, government agency, and citizen can understand the future of their food systems through the clarity of data.",
    color: "#7B2FFF",
    accent: "rgba(123,47,255,0.15)",
  },
  {
    icon: Compass,
    id: "objectives",
    label: "03",
    title: "Objectives",
    body: "Connect climate signals, agricultural records, and AI intelligence to surface the trends, comparisons, and stories hidden inside official datasets.",
    color: "#FF2D6B",
    accent: "rgba(255,45,107,0.15)",
  },
];

export function About() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [tilt, setTilt] = useState<Record<string, { x: number; y: number }>>({});

  const handleMove = (id: string, e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt((prev) => ({ ...prev, [id]: { x: y * -10, y: x * 10 } }));
  };

  return (
    <section id="about" className="relative py-24 overflow-hidden scroll-mt-20"
      style={{ background: "var(--home-section-bg)" }}>
      <CircuitLines />

      {/* Glow accents */}
      <div className="absolute top-1/4 left-0 w-[400px] h-[400px] pointer-events-none"
        style={{ background: "radial-gradient(circle, var(--home-teal-glow) 0%, transparent 70%)" }} />
      <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] pointer-events-none"
        style={{ background: "radial-gradient(circle, var(--home-violet-glow) 0%, transparent 70%)" }} />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Left — text */}
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.4em] mb-4" style={{ color: "#00FFD1" }}>
              About Nexus
            </p>
            <h2
              className="font-bold leading-none mb-6"
              style={{
                fontFamily: "'Orbitron', monospace",
                fontSize: "clamp(2.4rem, 5vw, 4rem)",
                color: "var(--foreground)",
              }}
            >
              WHAT IS{" "}
              <span style={{ color: "#00FFD1", textShadow: "0 0 20px #00FFD1" }}>NEXUS?</span>
            </h2>
            <p className="text-base leading-relaxed mb-6" style={{ color: "var(--home-copy-soft)", fontFamily: "'Space Grotesk', sans-serif" }}>
              Nexus is an AI-powered interactive data visualization platform that connects
              climate signals, agriculture records, and decision intelligence across the Pacific.
              By combining agricultural datasets, immersive visualizations, geographic exploration,
              and conversational AI — Nexus enables anyone to uncover patterns, compare countries,
              and understand the future of Pacific food systems.
            </p>
            <div className="flex flex-col gap-2">
              {["16 Pacific nations. One unified lens.", "Crop yields. Livestock trends. Climate signals.", "From raw CSV to interactive intelligence."].map((line) => (
                <div key={line} className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#00FFD1", boxShadow: "0 0 6px #00FFD1" }} />
                  <span className="font-mono text-sm" style={{ color: "var(--home-copy-muted)" }}>{line}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — 3D logo */}
          <div className="flex items-center justify-center">
            <div className="relative w-64 h-64" style={{ perspective: "600px" }}>
              <div className="w-full h-full" style={{
                animation: "spin3d 20s linear infinite",
              }}>
                <NexusLogo3D />
              </div>
            </div>
          </div>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {cards.map((c) => (
            <div
              key={c.id}
              onMouseEnter={() => setHovered(c.id)}
              onMouseLeave={() => { setHovered(null); setTilt((prev) => ({ ...prev, [c.id]: { x: 0, y: 0 } })); }}
              onMouseMove={(e) => handleMove(c.id, e)}
              className="relative cursor-default"
              style={{ perspective: "800px" }}
            >
              <div
                className="relative rounded-xl p-8 overflow-hidden transition-all duration-150"
                style={{
                  background: "var(--home-panel-strong-bg)",
                  border: `1px solid ${hovered === c.id ? c.color + "60" : c.color + "20"}`,
                  boxShadow: hovered === c.id
                    ? `0 0 40px ${c.color}20, 0 0 80px ${c.color}10, inset 0 1px 0 ${c.color}20`
                    : "var(--shadow-card)",
                  transform: `perspective(800px) rotateX(${tilt[c.id]?.x ?? 0}deg) rotateY(${tilt[c.id]?.y ?? 0}deg)`,
                  transformStyle: "preserve-3d",
                }}
              >
                {/* Number */}
                <div className="font-mono text-xs mb-6 flex items-center justify-between">
                  <span style={{ color: c.color, opacity: 0.6 }}>{c.label}</span>
                  <div className="w-8 h-px" style={{ background: `linear-gradient(to right, ${c.color}60, transparent)` }} />
                </div>

                {/* Icon */}
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center mb-6"
                  style={{
                    background: c.accent,
                    border: `1px solid ${c.color}30`,
                    boxShadow: `inset 0 0 20px ${c.color}10`,
                  }}
                >
                  <c.icon className="w-5 h-5" style={{ color: c.color }} />
                </div>

                <h3 className="font-mono font-bold text-xl mb-3 uppercase tracking-wider" style={{ color: "var(--foreground)" }}>
                  {c.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--home-copy-muted)", fontFamily: "'Space Grotesk', sans-serif" }}>
                  {c.body}
                </p>

                {/* Active indicator */}
                <div
                  className="absolute bottom-0 left-0 h-0.5 transition-all duration-500"
                  style={{
                    background: `linear-gradient(to right, ${c.color}, transparent)`,
                    width: hovered === c.id ? "100%" : "0%",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes spin3d {
          from { transform: rotateY(0deg) rotateX(10deg); }
          to { transform: rotateY(360deg) rotateX(10deg); }
        }
      `}</style>
    </section>
  );
}
