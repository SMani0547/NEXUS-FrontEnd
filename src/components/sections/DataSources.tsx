import { Database, ExternalLink, FileSpreadsheet, Info } from "lucide-react";

const dataSourceLinks = [
  {
    name: "Crop Yield - Disaggregated",
    desc: "Crop production data by country, product, and year.",
    href: "https://stats.pacificdata.org/vis?lc=en&df[ds]=SPC2&df[id]=DF_AGRICULTURAL_PRODUCTION&df[ag]=SPC&df[vs]=1.0&av=true&dq=A...&pd=,&to[TIME_PERIOD]=false",
  },
  {
    name: "Livestock Yield - Disaggregated",
    desc: "Livestock head counts and yields across the region.",
    href: "https://stats.pacificdata.org/vis?lc=en&df[ds]=SPC2&df[id]=DF_AGRICULTURAL_PRODUCTION&df[ag]=SPC&df[vs]=1.0&av=true&dq=A...&pd=,&to[TIME_PERIOD]=false",
  },
];

export function DataSources() {
  return (
    <section id="sources" className="relative py-24 bg-gradient-soft scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-3xl mb-16">
          <p className="text-sm uppercase tracking-widest text-accent font-medium mb-3">Data</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Data Sources</h2>
          <p className="text-lg text-muted-foreground">
            Every visualization in Nexus is grounded in the official Pacific Dataviz
            Challenge datasets.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-card rounded-2xl border border-border shadow-card p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-ocean flex items-center justify-center shadow-glow">
                <Database className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-display text-2xl font-semibold">Pacific Dataviz Challenge 2026</h3>
                <p className="text-sm text-muted-foreground">Official datasets provided by the challenge organizers.</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {dataSourceLinks.map((d) => (
                <a
                  key={d.name}
                  href={d.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-xl border border-border p-5 bg-background/50 transition-all hover:-translate-y-0.5 hover:border-accent/50 hover:bg-background hover:shadow-card"
                >
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <FileSpreadsheet className="w-5 h-5 text-accent" />
                    <ExternalLink className="w-4 h-4 text-muted-foreground transition-colors group-hover:text-accent" />
                  </div>
                  <div className="font-semibold text-sm mb-1">{d.name}</div>
                  <div className="text-xs text-muted-foreground">{d.desc}</div>
                </a>
              ))}
            </div>
          </div>

          <div className="bg-navy text-white rounded-2xl p-8 relative overflow-hidden">
            <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-gradient-ocean opacity-30" />
            <div className="relative">
              <Info className="w-5 h-5 text-teal mb-4" />
              <h3 className="font-display text-xl font-semibold mb-4">Data Notes</h3>
              <ul className="space-y-3 text-sm text-white/80">
                <li className="flex gap-2"><span className="text-teal">-</span> Not every country reports every product.</li>
                <li className="flex gap-2"><span className="text-teal">-</span> Not every product exists in every country.</li>
                <li className="flex gap-2"><span className="text-teal">-</span> Missing values are handled gracefully.</li>
                <li className="flex gap-2"><span className="text-teal">-</span> Data availability varies by year.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
