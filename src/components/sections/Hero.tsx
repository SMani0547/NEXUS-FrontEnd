import { ArrowRight, Zap } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";

function Globe3D() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let frame = 0;
    let raf: number;
    const animate = () => {
      frame++;
      if (frame % 2 === 0) setTick((t) => t + 1);
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, []);

  const R = 180;
  const cx = 250;
  const cy = 250;
  const rotation = tick * 0.3;
  const toRad = (d: number) => (d * Math.PI) / 180;

  const project = (lat: number, lon: number, r = R) => {
    const phi = toRad(90 - lat);
    const theta = toRad(lon + rotation);
    const x = cx + r * Math.sin(phi) * Math.cos(theta);
    const y = cy - r * Math.cos(phi);
    const z = Math.sin(phi) * Math.sin(theta);
    return { x, y, z };
  };

  const pacificNations = [
    { name: "FJ", lat: -18, lon: 178, value: 85 },
    { name: "PG", lat: -6, lon: 147, value: 92 },
    { name: "SB", lat: -9, lon: 160, value: 61 },
    { name: "VU", lat: -16, lon: 167, value: 74 },
    { name: "WS", lat: -14, lon: -172, value: 55 },
    { name: "TO", lat: -21, lon: -175, value: 48 },
    { name: "KI", lat: 1, lon: -157, value: 38 },
    { name: "FM", lat: 7, lon: 158, value: 44 },
    { name: "PW", lat: 7, lon: 134, value: 52 },
    { name: "MH", lat: 7, lon: 171, value: 41 },
    { name: "NR", lat: -1, lon: 167, value: 29 },
    { name: "TV", lat: -8, lon: 179, value: 31 },
    { name: "CK", lat: -21, lon: -159, value: 36 },
    { name: "NI", lat: -19, lon: -170, value: 33 },
    { name: "NC", lat: -21, lon: 165, value: 67 },
    { name: "PF", lat: -17, lon: -149, value: 71 },
  ];

  const meridians = [-180, -120, -60, 0, 60, 120, 180];
  const parallels = [-60, -30, 0, 30, 60];

  const buildArcPath = (points: { x: number; y: number; z: number }[]) => {
    const visible = points.filter((p) => p.z > -0.2);
    if (visible.length < 2) return "";
    return visible.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  };

  const meridianPaths = meridians.map((lon) => {
    const pts = Array.from({ length: 37 }, (_, i) => project(-90 + i * 5, lon));
    return buildArcPath(pts);
  });

  const parallelPaths = parallels.map((lat) => {
    const pts = Array.from({ length: 73 }, (_, i) => project(lat, -180 + i * 5));
    return buildArcPath(pts);
  });

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 500 500"
      className="w-full h-full"
      style={{ filter: "drop-shadow(0 0 40px rgba(0,255,209,0.25))" }}
    >
      <defs>
        <radialGradient id="globe-core" cx="42%" cy="38%" r="58%">
          <stop offset="0%" stopColor="#1A0A4A" />
          <stop offset="60%" stopColor="#06002E" />
          <stop offset="100%" stopColor="#000000" />
        </radialGradient>
        <radialGradient id="glow-outer" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="transparent" />
          <stop offset="75%" stopColor="transparent" />
          <stop offset="100%" stopColor="rgba(0,255,209,0.12)" />
        </radialGradient>
        <radialGradient id="shine" cx="38%" cy="32%" r="40%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.08)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <clipPath id="globe-clip">
          <circle cx={cx} cy={cy} r={R} />
        </clipPath>
        <filter id="node-glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Base sphere */}
      <circle cx={cx} cy={cy} r={R} fill="url(#globe-core)" />

      {/* Grid lines */}
      <g clipPath="url(#globe-clip)">
        {meridianPaths.map((d, i) => d && (
          <path key={`m${i}`} d={d} fill="none" stroke="#00FFD1" strokeWidth="0.5" strokeOpacity="0.12" />
        ))}
        {parallelPaths.map((d, i) => d && (
          <path key={`p${i}`} d={d} fill="none" stroke="#00FFD1" strokeWidth="0.5" strokeOpacity="0.12" />
        ))}
      </g>

      {/* Equator highlight */}
      <g clipPath="url(#globe-clip)">
        {(() => {
          const pts = Array.from({ length: 73 }, (_, i) => project(0, -180 + i * 5));
          const d = buildArcPath(pts);
          return d ? <path d={d} fill="none" stroke="#00FFD1" strokeWidth="1.2" strokeOpacity="0.35" strokeDasharray="4 8" /> : null;
        })()}
      </g>

      {/* Nation data nodes */}
      {pacificNations.map((n) => {
        const pt = project(n.lat, n.lon);
        if (pt.z < 0.05) return null;
        const alpha = Math.max(0.3, pt.z);
        const pulseR = 4 + (n.value / 100) * 8;
        const color = n.value > 70 ? "#00FFD1" : n.value > 50 ? "#7B2FFF" : "#FF2D6B";
        return (
          <g key={n.name} filter="url(#node-glow)">
            <circle cx={pt.x} cy={pt.y} r={pulseR * 1.8} fill={color} opacity={alpha * 0.12} />
            <circle cx={pt.x} cy={pt.y} r={pulseR} fill={color} opacity={alpha * 0.6} />
            <circle cx={pt.x} cy={pt.y} r={2.5} fill="#fff" opacity={alpha * 0.9} />
          </g>
        );
      })}

      {/* Shine overlay */}
      <circle cx={cx} cy={cy} r={R} fill="url(#shine)" />
      <circle cx={cx} cy={cy} r={R} fill="url(#glow-outer)" />

      {/* Orbit ring 1 */}
      <ellipse cx={cx} cy={cy} rx={R + 28} ry={22} fill="none" stroke="#00FFD1" strokeWidth="1" strokeOpacity="0.2" strokeDasharray="6 10" transform={`rotate(-20 ${cx} ${cy})`} />
      {/* Orbit ring 2 */}
      <ellipse cx={cx} cy={cy} rx={R + 50} ry={35} fill="none" stroke="#7B2FFF" strokeWidth="0.8" strokeOpacity="0.18" strokeDasharray="3 14" transform={`rotate(30 ${cx} ${cy})`} />

      {/* Scanning meridian */}
      {(() => {
        const scanLon = (rotation * 2) % 360 - 180;
        const pts = Array.from({ length: 37 }, (_, i) => project(-90 + i * 5, scanLon));
        const d = buildArcPath(pts);
        return d ? (
          <path d={d} fill="none" stroke="#00FFD1" strokeWidth="1.5" strokeOpacity="0.5"
            style={{ filter: "drop-shadow(0 0 6px #00FFD1)" }} />
        ) : null;
      })()}

      {/* Outer glow rim */}
      <circle cx={cx} cy={cy} r={R + 8} fill="none" stroke="#00FFD1" strokeWidth="1" strokeOpacity="0.25" />
      <circle cx={cx} cy={cy} r={R + 2} fill="none" stroke="#fff" strokeWidth="0.5" strokeOpacity="0.08" />
    </svg>
  );
}

function ParticleField() {
  const particles = Array.from({ length: 80 }, (_, i) => ({
    id: i,
    x: ((i * 137.508) % 100).toFixed(2),
    y: ((i * 71.337) % 100).toFixed(2),
    size: 1 + (i % 3) * 0.5,
    delay: (i * 0.13) % 4,
    dur: 3 + (i % 5),
  }));

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="xMidYMid slice">
      {particles.map((p) => (
        <circle
          key={p.id}
          cx={`${p.x}%`} cy={`${p.y}%`}
          r={p.size}
          fill={p.id % 3 === 0 ? "#00FFD1" : p.id % 3 === 1 ? "#7B2FFF" : "#ffffff"}
          opacity="0"
        >
          <animate attributeName="opacity" values="0;0.6;0" dur={`${p.dur}s`} begin={`${p.delay}s`} repeatCount="indefinite" />
          <animate attributeName="cy" values={`${p.y}%;${(parseFloat(p.y) - 5).toFixed(2)}%;${p.y}%`} dur={`${p.dur * 2}s`} begin={`${p.delay}s`} repeatCount="indefinite" />
        </circle>
      ))}
    </svg>
  );
}

function HexGrid() {
  const size = 28;
  const cols = 20;
  const rows = 10;
  const hexes = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = col * size * 1.732 + (row % 2) * size * 0.866;
      const y = row * size * 1.5;
      const active = (col * row * 7 + col * 3) % 9 === 0;
      hexes.push({ x, y, active, id: `${row}-${col}` });
    }
  }
  const hexPath = (x: number, y: number, s: number) => {
    const pts = Array.from({ length: 6 }, (_, i) => {
      const a = (Math.PI / 3) * i - Math.PI / 6;
      return `${(x + s * Math.cos(a)).toFixed(1)},${(y + s * Math.sin(a)).toFixed(1)}`;
    });
    return `M${pts.join("L")}Z`;
  };

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.04]" preserveAspectRatio="xMidYMid slice">
      {hexes.map((h) => (
        <path key={h.id} d={hexPath(h.x, h.y, size * 0.92)}
          fill={h.active ? "#00FFD1" : "transparent"}
          stroke="#00FFD1" strokeWidth="0.5" />
      ))}
    </svg>
  );
}

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-[#03001C] text-white pt-16">
      <HexGrid />
      <ParticleField />

      {/* Scanline overlay */}
      <div className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,209,0.015) 2px, rgba(0,255,209,0.015) 4px)",
        }}
      />

      {/* Radial glow center-left */}
      <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(123,47,255,0.18) 0%, transparent 70%)" }} />

      {/* Globe */}
      <div className="absolute right-[-5%] xl:right-[2%] top-1/2 -translate-y-1/2 w-[520px] h-[520px] xl:w-[640px] xl:h-[640px] hidden lg:block">
        <Globe3D />
      </div>

      <div className="relative z-20 max-w-7xl mx-auto px-6 py-24 lg:py-32 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-8 border text-xs font-mono uppercase tracking-widest"
            style={{ borderColor: "rgba(0,255,209,0.4)", background: "rgba(0,255,209,0.05)", color: "#00FFD1" }}>
            <Zap className="w-3 h-3" />
            <span>Pacific Dataviz Challenge 2026</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#00FFD1] animate-pulse" />
          </div>

          {/* Wordmark */}
          <div className="mb-2 font-mono text-xs tracking-[0.4em] text-white/30 uppercase">Agricultural Intelligence Platform</div>
          <h1
            className="font-bold leading-none tracking-tighter mb-6 select-none"
            style={{
              fontFamily: "'Orbitron', 'Space Grotesk', monospace",
              fontSize: "clamp(5rem, 14vw, 10rem)",
              textShadow: "0 0 60px rgba(0,255,209,0.35), 0 0 120px rgba(123,47,255,0.2)",
            }}
          >
            NE
            <span style={{ color: "#00FFD1", textShadow: "0 0 30px #00FFD1, 0 0 80px rgba(0,255,209,0.5)" }}>X</span>
            US
          </h1>

          <p className="text-xl md:text-2xl font-light mb-3" style={{ color: "rgba(255,255,255,0.75)", fontFamily: "'Space Grotesk', sans-serif" }}>
            Connecting Pacific Agriculture,<br />Climate, and Data.
          </p>
          <p className="text-sm mb-10 leading-relaxed font-mono" style={{ color: "rgba(255,255,255,0.4)" }}>
            Explore crop &amp; livestock yield trends across 16 Pacific Island nations<br />
            through immersive data visualization, AI storytelling, and predictive intelligence.
          </p>

          <div className="flex flex-wrap gap-3 mb-12">
            <Link to="/explorer">
              <Button size="lg"
                className="h-12 px-7 text-sm font-mono tracking-wider border-0 text-[#03001C] font-bold"
                style={{
                  background: "linear-gradient(135deg, #00FFD1, #00C2A0)",
                  boxShadow: "0 0 30px rgba(0,255,209,0.4), 0 0 60px rgba(0,255,209,0.15)",
                }}>
                EXPLORE DATA <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link to="/ai">
              <Button size="lg" variant="outline"
                className="h-12 px-7 text-sm font-mono tracking-wider"
                style={{
                  borderColor: "rgba(123,47,255,0.6)",
                  color: "#7B2FFF",
                  background: "rgba(123,47,255,0.06)",
                  boxShadow: "0 0 20px rgba(123,47,255,0.2)",
                }}>
                ASK NEXUS AI
              </Button>
            </Link>
          </div>

          {/* Stats bar */}
          <div className="flex items-center gap-0 border-t border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
            {[
              { v: "16", l: "Countries" },
              { v: "78", l: "Products" },
              { v: "64", l: "Years" },
              { v: "12K+", l: "Records" },
            ].map((s, i) => (
              <div key={s.l} className="flex-1 py-4 text-center" style={{ borderLeft: i === 0 ? "none" : "1px solid rgba(255,255,255,0.08)" }}>
                <div className="font-mono text-2xl font-bold" style={{ color: "#00FFD1" }}>{s.v}</div>
                <div className="text-xs font-mono uppercase tracking-widest mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none z-20"
        style={{ background: "linear-gradient(to bottom, transparent, #03001C)" }} />

      {/* Scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2">
        <div className="w-px h-10" style={{ background: "linear-gradient(to bottom, transparent, #00FFD1)" }} />
        <span className="text-[10px] font-mono tracking-[0.3em] uppercase" style={{ color: "rgba(0,255,209,0.5)" }}>SCROLL</span>
      </div>
    </section>
  );
}
