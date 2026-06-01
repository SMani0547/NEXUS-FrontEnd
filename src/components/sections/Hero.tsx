import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-hero text-white pt-16">
      {/* Decorative grid */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-white/40 animate-pulse-glow"
            style={{
              top: `${(i * 37) % 100}%`,
              left: `${(i * 53) % 100}%`,
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>

      {/* Pacific orbit visual */}
      <div className="absolute right-[-10%] top-1/2 -translate-y-1/2 w-[700px] h-[700px] hidden lg:block animate-float">
        <svg viewBox="0 0 700 700" className="w-full h-full opacity-60">
          <defs>
            <radialGradient id="hero-grad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#14B8A6" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#0EA5E9" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="350" cy="350" r="300" fill="url(#hero-grad)" />
          {[120, 180, 240, 300].map((r, i) => (
            <circle
              key={r}
              cx="350"
              cy="350"
              r={r}
              fill="none"
              stroke="#0EA5E9"
              strokeOpacity={0.3 - i * 0.05}
              strokeWidth="1"
            />
          ))}
          {Array.from({ length: 18 }).map((_, i) => {
            const angle = (i / 18) * Math.PI * 2;
            const r = 240;
            const x = 350 + Math.cos(angle) * r;
            const y = 350 + Math.sin(angle) * r;
            return <circle key={i} cx={x} cy={y} r={4} fill="#14B8A6" />;
          })}
          {Array.from({ length: 9 }).map((_, i) => {
            const angle = (i / 9) * Math.PI * 2;
            const x = 350 + Math.cos(angle) * 180;
            const y = 350 + Math.sin(angle) * 180;
            return <circle key={i} cx={x} cy={y} r={5} fill="#0EA5E9" />;
          })}
          <circle cx="350" cy="350" r="8" fill="white" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-24 lg:py-32 grid lg:grid-cols-2 gap-12 items-center">
        <div className="animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm text-xs mb-6">
            <Sparkles className="w-3.5 h-3.5 text-teal" />
            <span className="text-white/90">Pacific Dataviz Challenge 2026</span>
          </div>

          <h1 className="font-display font-bold text-7xl md:text-8xl lg:text-9xl leading-[0.9] tracking-tighter mb-6">
            NE<span className="text-gradient-ocean">X</span>US
          </h1>

          <p className="text-xl md:text-2xl text-white/80 font-light mb-4 max-w-xl">
            Connecting Pacific Agriculture, Climate, and Data.
          </p>
          <p className="text-base text-white/60 mb-10 max-w-xl leading-relaxed">
            An interactive platform helping users explore crop and livestock yield
            trends across Pacific Island countries through data visualization,
            storytelling, and artificial intelligence.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link to="/explorer">
              <Button size="lg" className="bg-gradient-ocean text-white border-0 hover:opacity-90 shadow-glow h-12 px-6">
                Explore Data <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link to="/ai">
              <Button
                size="lg"
                variant="outline"
                className="bg-white/5 text-white border-white/20 hover:bg-white/10 hover:text-white h-12 px-6"
              >
                Ask Nexus AI
              </Button>
            </Link>
          </div>

          <div className="mt-12 flex items-center gap-8 text-xs text-white/50 uppercase tracking-wider">
            <span>15 Countries</span>
            <span className="w-1 h-1 rounded-full bg-white/30" />
            <span>15 Products</span>
            <span className="w-1 h-1 rounded-full bg-white/30" />
            <span>24 Years</span>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40 text-xs uppercase tracking-widest">
        <div className="w-px h-12 bg-white/20 mx-auto mb-2" />
        Scroll
      </div>
    </section>
  );
}
