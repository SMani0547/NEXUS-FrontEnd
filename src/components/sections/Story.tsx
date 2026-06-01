const blocks = [
  {
    n: "01",
    title: "A Region Defined by Agriculture",
    body: "Agriculture remains one of the most important sectors across Pacific Island nations — sustaining communities, economies, and cultural identity.",
  },
  {
    n: "02",
    title: "A Climate in Flux",
    body: "Climate variability, changing weather patterns, and environmental pressures continue to influence agricultural productivity across the region.",
  },
  {
    n: "03",
    title: "Data as a Compass",
    body: "Understanding these changes requires data, insights, and accessible tools — so decisions can be made with clarity, not guesswork.",
  },
];

export function Story() {
  return (
    <section id="story" className="relative py-24 bg-background scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-3xl mb-20">
          <p className="text-sm uppercase tracking-widest text-accent font-medium mb-3">Story</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">The Story Behind the Data</h2>
          <p className="text-xl text-muted-foreground">Why Pacific Agriculture Matters.</p>
        </div>

        <div className="relative">
          {/* Vertical timeline */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-border to-transparent hidden md:block" />

          <div className="space-y-16 md:space-y-24">
            {blocks.map((b, i) => {
              const left = i % 2 === 0;
              return (
                <div
                  key={b.n}
                  className={`grid md:grid-cols-2 gap-8 items-center ${left ? "" : "md:[direction:rtl]"}`}
                >
                  <div className={`[direction:ltr] ${left ? "md:pr-12 md:text-right" : "md:pl-12"}`}>
                    <div className="font-display text-7xl font-bold text-gradient-ocean mb-4 tabular-nums">{b.n}</div>
                    <h3 className="text-2xl md:text-3xl font-semibold mb-4">{b.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{b.body}</p>
                  </div>
                  <div className="[direction:ltr] relative h-64 md:h-80">
                    <div className="absolute inset-0 rounded-2xl bg-gradient-ocean opacity-10" />
                    <div className="absolute inset-0 rounded-2xl border border-border overflow-hidden bg-card flex items-center justify-center">
                      <StoryGraphic index={i} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function StoryGraphic({ index }: { index: number }) {
  if (index === 0) {
    return (
      <svg viewBox="0 0 400 240" className="w-full h-full p-8">
        {Array.from({ length: 24 }).map((_, i) => {
          const x = (i % 8) * 50 + 20;
          const y = Math.floor(i / 8) * 70 + 30;
          const h = 30 + ((i * 13) % 60);
          return (
            <g key={i}>
              <rect x={x} y={y + (70 - h)} width="30" height={h} rx="4" fill="var(--accent)" opacity={0.5 + (i % 4) * 0.1} />
            </g>
          );
        })}
      </svg>
    );
  }
  if (index === 1) {
    return (
      <svg viewBox="0 0 400 240" className="w-full h-full p-8">
        <path
          d={`M0,180 ${Array.from({ length: 20 }).map((_, i) => {
            const x = i * 21;
            const y = 120 + Math.sin(i * 0.6) * 50 - i * 1.5;
            return `L${x},${y}`;
          }).join(" ")} L400,200 L0,200 Z`}
          fill="var(--secondary)"
          opacity="0.3"
        />
        <path
          d={`M0,180 ${Array.from({ length: 20 }).map((_, i) => {
            const x = i * 21;
            const y = 120 + Math.sin(i * 0.6) * 50 - i * 1.5;
            return `L${x},${y}`;
          }).join(" ")}`}
          fill="none"
          stroke="var(--secondary)"
          strokeWidth="3"
        />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 400 240" className="w-full h-full p-8">
      {Array.from({ length: 60 }).map((_, i) => {
        const cx = 30 + (i % 12) * 32;
        const cy = 30 + Math.floor(i / 12) * 40;
        const r = 3 + ((i * 7) % 8);
        return <circle key={i} cx={cx} cy={cy} r={r} fill="var(--accent)" opacity={0.3 + ((i * 5) % 7) * 0.1} />;
      })}
    </svg>
  );
}
