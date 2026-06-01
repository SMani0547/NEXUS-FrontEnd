import { Target, Eye, Compass } from "lucide-react";

const cards = [
  {
    icon: Target,
    title: "Mission",
    body: "To make Pacific agricultural data accessible, explorable, and meaningful for researchers, policymakers, and communities.",
  },
  {
    icon: Eye,
    title: "Vision",
    body: "A Pacific where every farmer, government, and citizen can understand the future of their food systems through data.",
  },
  {
    icon: Compass,
    title: "Objectives",
    body: "Connect climate, agriculture, and AI to surface trends, comparisons, and stories hidden in the official datasets.",
  },
];

export function About() {
  return (
    <section id="about" className="relative py-24 bg-gradient-soft scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-3xl mb-16">
          <p className="text-sm uppercase tracking-widest text-accent font-medium mb-3">About Nexus</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            What is <span className="text-gradient-ocean">Nexus</span>?
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Nexus is an AI-powered interactive data visualization platform that
            connects climate, agriculture, and decision-making across the Pacific.
            By combining agricultural datasets, interactive visualizations, geographic
            exploration, and conversational AI, Nexus enables users to uncover patterns,
            compare countries, and better understand the future of Pacific food systems.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {cards.map((c) => (
            <div
              key={c.title}
              className="group bg-card rounded-2xl p-8 border border-border shadow-card hover:shadow-elegant transition-all hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-gradient-ocean transition-all">
                <c.icon className="w-5 h-5 text-accent group-hover:text-white transition-colors" />
              </div>
              <h3 className="font-display text-2xl font-semibold mb-3">{c.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{c.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
