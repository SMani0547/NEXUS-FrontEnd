import { TrendingUp, MapPinned, Leaf, Trophy, CloudRain, Lightbulb } from "lucide-react";

const insights = [
  { icon: MapPinned, title: "Regional Trends", body: "Patterns of agricultural productivity across geographic zones of the Pacific." },
  { icon: Trophy, title: "Country Performance", body: "How each nation's yield evolves year over year — winners and shifting leaders." },
  { icon: Leaf, title: "Agricultural Diversity", body: "Which countries cultivate the broadest mix of crops and livestock." },
  { icon: TrendingUp, title: "Growth Leaders", body: "Products and regions experiencing the strongest sustained growth." },
  { icon: CloudRain, title: "Climate Vulnerability", body: "Signals of declining yields that may correlate with climate stress." },
  { icon: Lightbulb, title: "Opportunity Areas", body: "Untapped categories where investment could yield meaningful returns." },
];

export function Insights() {
  return (
    <section id="insights" className="relative py-24 bg-gradient-soft scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-3xl mb-16">
          <p className="text-sm uppercase tracking-widest text-accent font-medium mb-3">Insights</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Discover Hidden Patterns</h2>
          <p className="text-lg text-muted-foreground">
            Smart, AI-assisted lenses on the official Pacific Dataviz Challenge datasets.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {insights.map((i, idx) => (
            <div
              key={i.title}
              className="group relative bg-card rounded-2xl p-8 border border-border shadow-card hover:shadow-elegant transition-all hover:-translate-y-1 overflow-hidden"
            >
              <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-gradient-ocean opacity-0 group-hover:opacity-10 transition-opacity" />
              <div className="relative">
                <div className="flex items-start justify-between mb-6">
                  <div className="w-11 h-11 rounded-xl bg-accent/10 flex items-center justify-center">
                    <i.icon className="w-5 h-5 text-accent" />
                  </div>
                  <span className="text-xs font-mono text-muted-foreground">0{idx + 1}</span>
                </div>
                <h3 className="font-display text-xl font-semibold mb-3">{i.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{i.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
