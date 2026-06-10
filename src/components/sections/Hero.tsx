
import { ArrowRight, Zap } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState, useMemo } from "react";

// ─── Maths ───────────────────────────────────────────────────────────────────
const toRad = (d: number) => (d * Math.PI) / 180;

/** Orthographic projection.  Returns {x,y,z} where z∈[-1,1]; z>0 = front-facing. */
function project(lat: number, lon: number, rotY: number, cx: number, cy: number, R: number) {
  const phi   = toRad(90 - lat);          // polar angle from north pole
  const theta = toRad(lon) + rotY;        // azimuth + rotation offset
  const sinP  = Math.sin(phi);
  const cosP  = Math.cos(phi);
  const sinT  = Math.sin(theta);
  const cosT  = Math.cos(theta);
  return {
    x: cx + R * sinP * cosT,
    y: cy - R * cosP,
    z: sinP * sinT,                       // +1 = directly facing viewer
  };
}

/**
 * Build a series of <path> d-strings for a great-circle / parallel arc,
 * splitting wherever the line crosses the limb (z=0) so we never draw
 * a chord across the globe face.
 */
function buildSegments(
  points: { x: number; y: number; z: number }[],
  zThreshold = 0.0
): string[] {
  const paths: string[] = [];
  let current = "";
  let inside  = false;

  for (let i = 0; i < points.length; i++) {
    const p = points[i];
    const visible = p.z >= zThreshold;

    if (visible) {
      if (!inside) {
        // Start a new sub-path
        current = `M${p.x.toFixed(1)},${p.y.toFixed(1)}`;
        inside  = true;
      } else {
        current += ` L${p.x.toFixed(1)},${p.y.toFixed(1)}`;
      }
    } else {
      if (inside && current.length > 1) {
        paths.push(current);
      }
      current = "";
      inside  = false;
    }
  }
  if (inside && current.length > 1) paths.push(current);
  return paths;
}

// ─── Globe component ─────────────────────────────────────────────────────────
function Globe3D() {
  const [rotY, setRotY] = useState(0);
  const rafRef = useRef<number>(0);
  const lastRef = useRef<number>(0);

  useEffect(() => {
    const step = (ts: number) => {
      const dt = lastRef.current ? ts - lastRef.current : 0;
      lastRef.current = ts;
      // ~0.3°/frame at 60 fps → 0.005 rad/frame
      setRotY((r) => r + (dt / 1000) * 0.28 * (Math.PI / 180) * 60);
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const R  = 190;
  const cx = 250;
  const cy = 250;

  const proj = (lat: number, lon: number) => project(lat, lon, rotY, cx, cy, R);

  // ── Grid ────────────────────────────────────────────────────────────────
  const MERIDIAN_LONS = useMemo(() => [-150,-120,-90,-60,-30,0,30,60,90,120,150,180], []);
  const PARALLEL_LATS = useMemo(() => [-75,-60,-45,-30,-15,0,15,30,45,60,75], []);

  // each meridian: 73 pts pole→pole
  const meridianSegments = useMemo(() => MERIDIAN_LONS.map(() => [] as string[]), []);
  const parallelSegments = useMemo(() => PARALLEL_LATS.map(() => [] as string[]), []);

  // Recompute every frame (rotY changes)
  const mSegs = MERIDIAN_LONS.map((lon) => {
    const pts = Array.from({ length: 73 }, (_, i) => proj(-90 + i * 2.5, lon));
    return buildSegments(pts, 0);
  });

  const pSegs = PARALLEL_LATS.map((lat) => {
    const pts = Array.from({ length: 145 }, (_, i) => proj(lat, -180 + i * 2.5));
    return buildSegments(pts, 0);
  });

  // ── Equator ──────────────────────────────────────────────────────────────
  const equatorSegs = buildSegments(
    Array.from({ length: 145 }, (_, i) => proj(0, -180 + i * 2.5)),
    0
  );

  // ── Tropics ──────────────────────────────────────────────────────────────
  const tropicCancerSegs = buildSegments(
    Array.from({ length: 145 }, (_, i) => proj(23.5, -180 + i * 2.5)),
    0
  );
  const tropicCapricornSegs = buildSegments(
    Array.from({ length: 145 }, (_, i) => proj(-23.5, -180 + i * 2.5)),
    0
  );

  // ── Nation nodes ─────────────────────────────────────────────────────────
  const nations = [
    { name: "FJ",  lat: -18,  lon:  178, value: 85 },
    { name: "PG",  lat:  -6,  lon:  147, value: 92 },
    { name: "SB",  lat:  -9,  lon:  160, value: 61 },
    { name: "VU",  lat: -16,  lon:  167, value: 74 },
    { name: "WS",  lat: -14,  lon: -172, value: 55 },
    { name: "TO",  lat: -21,  lon: -175, value: 48 },
    { name: "KI",  lat:   1,  lon: -157, value: 38 },
    { name: "FM",  lat:   7,  lon:  158, value: 44 },
    { name: "PW",  lat:   7,  lon:  134, value: 52 },
    { name: "MH",  lat:   7,  lon:  171, value: 41 },
    { name: "NR",  lat:  -1,  lon:  167, value: 29 },
    { name: "TV",  lat:  -8,  lon:  179, value: 31 },
    { name: "CK",  lat: -21,  lon: -159, value: 36 },
    { name: "NI",  lat: -19,  lon: -170, value: 33 },
    { name: "NC",  lat: -21,  lon:  165, value: 67 },
    { name: "PF",  lat: -17,  lon: -149, value: 71 },
  ];

  const visibleNations = nations
    .map((n) => ({ ...n, pt: proj(n.lat, n.lon) }))
    .filter((n) => n.pt.z > 0.05)
    .sort((a, b) => a.pt.z - b.pt.z); // paint furthest first

  // ── Scanning meridian (always on front face) ──────────────────────────────
  const scanLon = ((rotY * (180 / Math.PI)) * 1.2) % 360;
  const scanSegs = buildSegments(
    Array.from({ length: 73 }, (_, i) => proj(-90 + i * 2.5, scanLon - 180)),
    0.02
  );

  // ── Land mass outlines (simplified Pacific region shapes) ─────────────────
  // Papua New Guinea rough outline
  const pgOutline = [
    [141,-6],[143,-5],[145,-4],[147,-4],[149,-5],[150,-6],[151,-7],[150,-8],
    [148,-8],[146,-7],[144,-6],[142,-6],[141,-6],
  ].map(([lon, lat]) => proj(lat!, lon!));
  const pgSegs = buildSegments(pgOutline, 0.05);

  // Fiji rough
  const fjOutline = [
    [177,-17],[178,-17],[179,-18],[178,-19],[177,-18],[177,-17],
  ].map(([lon, lat]) => proj(lat!, lon!));
  const fjSegs = buildSegments(fjOutline, 0.05);

  // Solomon Islands rough
  const sbOutline = [
    [157,-8],[159,-8],[161,-9],[162,-10],[161,-10],[159,-9],[157,-9],[157,-8],
  ].map(([lon, lat]) => proj(lat!, lon!));
  const sbSegs = buildSegments(sbOutline, 0.05);

  // Vanuatu rough
  const vuOutline = [
    [166,-14],[167,-15],[168,-16],[168,-17],[167,-16],[166,-15],[166,-14],
  ].map(([lon, lat]) => proj(lat!, lon!));
  const vuSegs = buildSegments(vuOutline, 0.05);

  const allLandSegs = [...pgSegs, ...fjSegs, ...sbSegs, ...vuSegs];

  return (
    <svg viewBox="0 0 500 500" className="w-full h-full" aria-hidden="true">
      <defs>
        {/* ── Base sphere: deep space gradient with lighter front face ── */}
        <radialGradient id="g-sphere" cx="38%" cy="35%" r="65%">
          <stop offset="0%"   stopColor="#0E2A4A" />   {/* lit upper-left */}
          <stop offset="40%"  stopColor="#061830" />
          <stop offset="80%"  stopColor="#020A1A" />
          <stop offset="100%" stopColor="#000508" />
        </radialGradient>

        {/* ── Atmospheric rim — outer glow ── */}
        <radialGradient id="g-atmo" cx="50%" cy="50%" r="50%">
          <stop offset="80%"  stopColor="transparent" />
          <stop offset="92%"  stopColor="rgba(0,180,255,0.10)" />
          <stop offset="100%" stopColor="rgba(0,120,255,0.22)" />
        </radialGradient>

        {/* ── Specular highlight: small bright patch top-left ── */}
        <radialGradient id="g-spec" cx="36%" cy="30%" r="28%">
          <stop offset="0%"   stopColor="rgba(180,230,255,0.22)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>

        {/* ── Ocean tint — very subtle blue wash on front face ── */}
        <radialGradient id="g-ocean" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="rgba(0,80,180,0.18)" />
          <stop offset="70%"  stopColor="rgba(0,50,120,0.08)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>

        {/* ── Terminator: dark limb on the right ── */}
        <radialGradient id="g-terminator" cx="72%" cy="50%" r="45%">
          <stop offset="0%"   stopColor="rgba(0,0,0,0.55)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>

        {/* ── Shadow: bottom-right dark ── */}
        <radialGradient id="g-shadow" cx="68%" cy="68%" r="45%">
          <stop offset="0%"   stopColor="rgba(0,0,0,0.45)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>

        <clipPath id="globe-clip">
          <circle cx={cx} cy={cy} r={R} />
        </clipPath>

        {/* ── Node glow filter ── */}
        <filter id="f-node" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* ── Soft line glow ── */}
        <filter id="f-line" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* ── Scan glow ── */}
        <filter id="f-scan" x="-50%" y="-10%" width="200%" height="120%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* ── Outer atmosphere drop shadow ── */}
        <filter id="f-outer" x="-15%" y="-15%" width="130%" height="130%">
          <feGaussianBlur stdDeviation="18" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* ── Outer atmosphere glow (behind sphere) ── */}
      <circle cx={cx} cy={cy} r={R + 22}
        fill="none" stroke="rgba(0,160,255,0.13)" strokeWidth="20"
        filter="url(#f-outer)" />

      {/* ── Base sphere ── */}
      <circle cx={cx} cy={cy} r={R} fill="url(#g-sphere)" />

      <g clipPath="url(#globe-clip)">
        {/* ── Ocean tint ── */}
        <circle cx={cx} cy={cy} r={R} fill="url(#g-ocean)" />

        {/* ── Land masses ── */}
        {allLandSegs.map((d, i) => (
          <path key={`land${i}`} d={d} fill="rgba(20,80,50,0.55)"
            stroke="rgba(40,180,100,0.35)" strokeWidth="0.8" />
        ))}

        {/* ── Grid: meridians ── */}
        {mSegs.map((segs, mi) =>
          segs.map((d, si) => (
            <path key={`m${mi}-${si}`} d={d} fill="none"
              stroke="rgba(0,200,180,0.22)" strokeWidth="0.6" />
          ))
        )}

        {/* ── Grid: parallels ── */}
        {pSegs.map((segs, pi) =>
          segs.map((d, si) => (
            <path key={`p${pi}-${si}`} d={d} fill="none"
              stroke="rgba(0,200,180,0.22)" strokeWidth="0.6" />
          ))
        )}

        {/* ── Tropics ── */}
        {tropicCancerSegs.map((d, i) => (
          <path key={`tc${i}`} d={d} fill="none"
            stroke="rgba(255,200,80,0.18)" strokeWidth="0.8" strokeDasharray="3 8" />
        ))}
        {tropicCapricornSegs.map((d, i) => (
          <path key={`tcc${i}`} d={d} fill="none"
            stroke="rgba(255,200,80,0.18)" strokeWidth="0.8" strokeDasharray="3 8" />
        ))}

        {/* ── Equator ── */}
        {equatorSegs.map((d, i) => (
          <path key={`eq${i}`} d={d} fill="none" filter="url(#f-line)"
            stroke="rgba(0,255,209,0.55)" strokeWidth="1.2" strokeDasharray="5 9" />
        ))}

        {/* ── Scanning meridian ── */}
        {scanSegs.map((d, i) => (
          <path key={`sc${i}`} d={d} fill="none" filter="url(#f-scan)"
            stroke="rgba(0,255,209,0.75)" strokeWidth="1.6" />
        ))}

        {/* ── Depth shading: terminator + shadow ── */}
        <circle cx={cx} cy={cy} r={R} fill="url(#g-terminator)" />
        <circle cx={cx} cy={cy} r={R} fill="url(#g-shadow)" />

        {/* ── Nation nodes ── */}
        {visibleNations.map((n) => {
          const { pt } = n;
          const fade   = Math.min(1, Math.max(0.25, pt.z * 1.4));
          const radius = 3.5 + (n.value / 100) * 6;
          const color  = n.value > 70 ? "#00FFD1"
                       : n.value > 50 ? "#7B2FFF"
                       :                "#FF2D6B";
          return (
            <g key={n.name} filter="url(#f-node)">
              {/* Outer pulse ring */}
              <circle cx={pt.x} cy={pt.y} r={radius * 2.4}
                fill={color} opacity={fade * 0.10} />
              {/* Mid ring */}
              <circle cx={pt.x} cy={pt.y} r={radius * 1.4}
                fill="none" stroke={color} strokeWidth="0.7"
                opacity={fade * 0.5} />
              {/* Core dot */}
              <circle cx={pt.x} cy={pt.y} r={radius * 0.55}
                fill={color} opacity={fade * 0.95} />
              {/* White centre pinpoint */}
              <circle cx={pt.x} cy={pt.y} r={1.4}
                fill="#fff" opacity={fade * 0.85} />
            </g>
          );
        })}

        {/* ── Specular highlight ── */}
        <circle cx={cx} cy={cy} r={R} fill="url(#g-spec)" />
      </g>

      {/* ── Atmospheric rim (on top of clip, outside sphere edge) ── */}
      <circle cx={cx} cy={cy} r={R} fill="url(#g-atmo)" />

      {/* ── Rim light (thin bright edge, top-left quadrant) ── */}
      <circle cx={cx} cy={cy} r={R - 1}
        fill="none"
        stroke="rgba(100,200,255,0.18)"
        strokeWidth="2.5"
        strokeDasharray={`${R * 1.6} ${R * 5}`}
        strokeDashoffset={`${-R * 0.4}`}
        transform={`rotate(-35 ${cx} ${cy})`}
      />

      {/* ── Orbit rings (outside sphere) ── */}
      <ellipse cx={cx} cy={cy} rx={R + 30} ry={24}
        fill="none" stroke="rgba(0,255,209,0.18)" strokeWidth="0.8"
        strokeDasharray="5 12"
        transform={`rotate(-18 ${cx} ${cy})`} />
      <ellipse cx={cx} cy={cy} rx={R + 52} ry={36}
        fill="none" stroke="rgba(123,47,255,0.15)" strokeWidth="0.7"
        strokeDasharray="3 16"
        transform={`rotate(28 ${cx} ${cy})`} />
    </svg>
  );
}

// ─── Background effects ───────────────────────────────────────────────────────
function ParticleField() {
  const particles = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    cx: ((i * 137.508) % 100).toFixed(2),
    cy: ((i * 71.337) % 100).toFixed(2),
    r:  0.8 + (i % 3) * 0.6,
    delay: (i * 0.19) % 5,
    dur:   3 + (i % 6),
  }));

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="xMidYMid slice">
      {particles.map((p) => (
        <circle key={p.id} cx={`${p.cx}%`} cy={`${p.cy}%`} r={p.r}
          fill={p.id % 3 === 0 ? "#00FFD1" : p.id % 3 === 1 ? "#7B2FFF" : "#fff"}
          opacity="0">
          <animate attributeName="opacity" values="0;0.55;0"
            dur={`${p.dur}s`} begin={`${p.delay}s`} repeatCount="indefinite" />
          <animate attributeName="cy"
            values={`${p.cy}%;${(parseFloat(p.cy) - 4).toFixed(2)}%;${p.cy}%`}
            dur={`${p.dur * 2}s`} begin={`${p.delay}s`} repeatCount="indefinite" />
        </circle>
      ))}
    </svg>
  );
}

function HexGrid() {
  const size = 30;
  const hexPath = (x: number, y: number) => {
    const pts = Array.from({ length: 6 }, (_, i) => {
      const a = (Math.PI / 3) * i - Math.PI / 6;
      return `${(x + size * 0.9 * Math.cos(a)).toFixed(1)},${(y + size * 0.9 * Math.sin(a)).toFixed(1)}`;
    });
    return `M${pts.join("L")}Z`;
  };

  const hexes: { x: number; y: number; id: string; lit: boolean }[] = [];
  for (let row = 0; row < 12; row++) {
    for (let col = 0; col < 22; col++) {
      const x = col * size * 1.732 + (row % 2) * size * 0.866;
      const y = row * size * 1.5;
      hexes.push({ x, y, id: `${row}-${col}`, lit: (col * row * 7 + col * 3) % 11 === 0 });
    }
  }

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.045]"
      preserveAspectRatio="xMidYMid slice">
      {hexes.map((h) => (
        <path key={h.id} d={hexPath(h.x, h.y)}
          fill={h.lit ? "#00FFD1" : "transparent"} stroke="#00FFD1" strokeWidth="0.4" />
      ))}
    </svg>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-background text-foreground dark:bg-[#03001C] dark:text-white pt-16">
      <HexGrid />
      <ParticleField />

      {/* Scanline texture */}
      <div className="absolute inset-0 pointer-events-none z-10"
        style={{ background: "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,255,209,0.012) 2px,rgba(0,255,209,0.012) 4px)" }} />

      {/* Violet ambient glow left */}
      <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] pointer-events-none rounded-full"
        style={{ background: "radial-gradient(circle,var(--home-violet-glow) 0%,transparent 70%)" }} />

      {/* Globe — positioned right side */}
      <div className="absolute right-[-6%] xl:right-[1%] top-1/2 -translate-y-1/2
                      w-[520px] h-[520px] xl:w-[660px] xl:h-[660px] hidden lg:block"
        style={{ filter: "drop-shadow(0 0 50px rgba(0,160,255,0.20)) drop-shadow(0 0 90px rgba(0,80,200,0.12))" }}>
        <Globe3D />
      </div>

      {/* Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 py-24 lg:py-32 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-8 border text-xs font-mono uppercase tracking-widest"
            style={{ borderColor: "rgba(0,255,209,0.4)", background: "rgba(0,255,209,0.05)", color: "#00FFD1" }}>
            <Zap className="w-3 h-3" />
            <span>Pacific Dataviz Challenge 2026</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#00FFD1] animate-pulse" />
          </div>

          <div className="mb-2 font-mono text-xs tracking-[0.4em] uppercase" style={{ color: "var(--home-copy-muted)" }}>
            Agricultural Intelligence Platform
          </div>

          <h1 className="font-bold leading-none tracking-tighter mb-6 select-none"
            style={{
              fontFamily: "'Orbitron','Space Grotesk',monospace",
              fontSize: "clamp(5rem,14vw,10rem)",
              textShadow: "0 0 60px rgba(0,255,209,0.35),0 0 120px rgba(123,47,255,0.2)",
            }}>
            NE
            <span style={{ color: "#00FFD1", textShadow: "0 0 30px #00FFD1,0 0 80px rgba(0,255,209,0.5)" }}>X</span>
            US
          </h1>

          <p className="text-xl md:text-2xl font-light mb-3"
            style={{ color: "var(--home-copy-soft)", fontFamily: "'Space Grotesk',sans-serif" }}>
            Connecting Pacific Agriculture,<br />Climate, and Data.
          </p>
          <p className="text-sm mb-10 leading-relaxed font-mono"
            style={{ color: "var(--home-copy-muted)" }}>
            Explore crop &amp; livestock yield trends across 16 Pacific Island nations<br />
            through immersive data visualization, AI storytelling, and predictive intelligence.
          </p>

          <div className="flex flex-wrap gap-3 mb-12">
            <Link to="/explorer">
              <Button size="lg"
                className="h-12 px-7 text-sm font-mono tracking-wider border-0 text-[#03001C] font-bold"
                style={{
                  background: "linear-gradient(135deg,#00FFD1,#00C2A0)",
                  boxShadow: "0 0 30px rgba(0,255,209,0.4),0 0 60px rgba(0,255,209,0.15)",
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
          <div className="flex items-center gap-0 border-t border-b"
            style={{ borderColor: "var(--home-divider)" }}>
            {[
              { v: "16", l: "Countries" },
              { v: "78", l: "Products" },
              { v: "64", l: "Years"    },
              { v: "12K+", l: "Records" },
            ].map((s, i) => (
              <div key={s.l} className="flex-1 py-4 text-center"
                style={{ borderLeft: i === 0 ? "none" : "1px solid var(--home-divider)" }}>
                <div className="font-mono text-2xl font-bold" style={{ color: "#00FFD1" }}>{s.v}</div>
                <div className="text-xs font-mono uppercase tracking-widest mt-0.5"
                  style={{ color: "var(--home-copy-muted)" }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none z-20"
        style={{ background: "linear-gradient(to bottom,transparent,var(--color-background))" }} />

      {/* Scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2">
        <div className="w-px h-10" style={{ background: "linear-gradient(to bottom,transparent,#00FFD1)" }} />
        <span className="text-[10px] font-mono tracking-[0.3em] uppercase"
          style={{ color: "rgba(0,255,209,0.5)" }}>SCROLL</span>
      </div>
    </section>
  );
}
