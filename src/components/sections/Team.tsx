import { Github, Linkedin } from "lucide-react";

const team = [
  { name: "Alex Tukana", role: "Project Lead", bio: "Leads vision and coordination across data, design, and engineering." },
  { name: "Noa Vaitupu", role: "Backend Developer", bio: "Builds the data pipelines and APIs powering the Nexus platform." },
  { name: "Lani Moana", role: "Frontend Developer", bio: "Crafts the interface and interactions across the Nexus experience." },
  { name: "Sione Kalama", role: "Data Analyst", bio: "Translates raw agricultural data into actionable patterns and stories." },
  { name: "Mere Tagi", role: "Research & Storytelling", bio: "Frames the narrative threads connecting climate, food, and people." },
  { name: "Kai Nakamura", role: "AI Integration Lead", bio: "Builds Nexus AI — the conversational assistant on top of the datasets." },
];

const colors = ["from-sky-400 to-teal-400", "from-emerald-400 to-cyan-400", "from-indigo-400 to-sky-400", "from-teal-400 to-emerald-400", "from-blue-500 to-indigo-400", "from-cyan-400 to-blue-500"];

export function Team() {
  return (
    <section id="team" className="relative py-24 bg-background scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-3xl mb-16">
          <p className="text-sm uppercase tracking-widest text-accent font-medium mb-3">Team Nexus</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Meet Team Nexus</h2>
          <p className="text-lg text-muted-foreground">
            A team dedicated to transforming Pacific data into meaningful insights.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {team.map((m, i) => (
            <div
              key={m.name}
              className="group bg-card rounded-2xl p-6 border border-border shadow-card hover:shadow-elegant transition-all hover:-translate-y-1"
            >
              <div className={`w-full aspect-[4/3] rounded-xl bg-gradient-to-br ${colors[i]} mb-5 relative overflow-hidden`}>
                <div className="absolute inset-0 flex items-center justify-center text-white font-display text-6xl font-bold opacity-90">
                  {m.name.split(" ").map((p) => p[0]).join("")}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
              <h3 className="font-display text-lg font-semibold">{m.name}</h3>
              <p className="text-sm text-accent font-medium mb-3">{m.role}</p>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">{m.bio}</p>
              <div className="flex gap-2">
                <a href="#" className="w-8 h-8 rounded-md bg-muted hover:bg-accent hover:text-white flex items-center justify-center transition-colors">
                  <Linkedin className="w-4 h-4" />
                </a>
                <a href="#" className="w-8 h-8 rounded-md bg-muted hover:bg-accent hover:text-white flex items-center justify-center transition-colors">
                  <Github className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
