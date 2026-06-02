function LinkedinLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M4.983 3.5C4.983 4.88 3.87 6 2.495 6A2.5 2.5 0 0 1 0 3.5C0 2.12 1.113 1 2.495 1s2.488 1.12 2.488 2.5ZM.33 8.5h4.33V23H.33V8.5Zm7.17 0h4.15v1.98h.06c.58-1.1 2-2.26 4.12-2.26 4.4 0 5.21 2.9 5.21 6.67V23h-4.33v-7.01c0-1.67-.03-3.82-2.33-3.82-2.34 0-2.7 1.83-2.7 3.7V23H7.5V8.5Z" />
    </svg>
  );
}

function GithubLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.2 11.39.6.11.82-.26.82-.58v-2.04c-3.34.73-4.04-1.41-4.04-1.41-.55-1.38-1.33-1.75-1.33-1.75-1.09-.74.09-.73.09-.73 1.2.08 1.83 1.24 1.83 1.24 1.08 1.84 2.83 1.31 3.52 1 .1-.78.42-1.31.77-1.62-2.66-.31-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.23-3.22-.12-.31-.53-1.57.12-3.27 0 0 1.01-.32 3.3 1.23a11.4 11.4 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.7.25 2.96.13 3.27.77.84 1.23 1.91 1.23 3.22 0 4.61-2.81 5.62-5.49 5.92.43.37.82 1.1.82 2.23v3.3c0 .32.22.7.83.58A12 12 0 0 0 24 12.5C24 5.87 18.63.5 12 .5Z" />
    </svg>
  );
}

type TeamMember = {
  name: string;
  role: string;
  bio: string;
  photo?: string;
  linkedin?: string;
  github?: string;
};

const team: TeamMember[] = [
  {
    name: "Abhishek Swamy",
    role: "Project Lead",
    bio: "Drives product strategy, timelines, and cross-functional alignment between engineering, data, and research.",
    photo: "/abhishek-swamy.jpg",
    linkedin: "#",
    github: "#",
  },
  {
    name: "Shiva Goundar",
    role: "System Architect",
    bio: "Architects and implements the backend infrastructure, secure data engineering pipelines, and core APIs.",
    photo: "/shiva.jpg",
    linkedin: "#",
    github: "#",
  },
  {
    name: "Shainesh Nand",
    role: "System Architect",
    bio: "Architects and implements the user interface framework, high-performance visual layers, and client-side systems.",
    photo: "/shainesh.jpg",
    linkedin: "#",
    github: "#",
  },
  {
    name: "Pranshu Nadan",
    role: "Data Analyst",
    bio: "Extracts, models, and analyzes agricultural datasets to uncover key patterns and statistical trends.",
    photo: "/Pranshu.jpg",
    linkedin: "#",
    github: "#",
  },
  {
    name: "Parth Badgujar",
    role: "Data Analyst",
    bio: "Analyzes climate data models to quantify impacts on food security and human environmental systems.",
    photo: "/parth.jpg",
    linkedin: "#",
    github: "#",
  },
  {
    name: "Pranav Kumar",
    role: "Research & Storytelling",
    bio: "Engineers the Nexus AI conversational layer, contextual intelligence models, and text-based data narratives.",
    photo: "/team/pranav-kumar.jpg",
    linkedin: "#",
    github: "#",
  },
];

const colors = [
  "from-sky-400 to-teal-400",
  "from-emerald-400 to-cyan-400",
  "from-indigo-400 to-sky-400",
  "from-teal-400 to-emerald-400",
  "from-blue-500 to-indigo-400",
  "from-cyan-400 to-blue-500",
];

export function Team() {
  return (
    <section id="team" className="relative py-24 bg-background scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-3xl mb-16">
          <p className="text-sm uppercase tracking-widest text-accent font-medium mb-3">
            Team Nexus
          </p>
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
              <div
                className={`w-full aspect-[4/3] rounded-xl bg-gradient-to-br ${colors[i]} mb-5 relative overflow-hidden`}
              >
                {m.photo ? (
                  <img
                    src={m.photo}
                    alt={m.name}
                    className="absolute inset-0 h-full w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-white font-display text-6xl font-bold opacity-90">
                    {m.name
                      .split(" ")
                      .map((p) => p[0])
                      .join("")}
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
              <h3 className="font-display text-lg font-semibold">{m.name}</h3>
              <p className="mb-3 text-sm font-medium text-accent">{m.role}</p>
              <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                {m.bio}
              </p>
              <div className="flex gap-2">
                <a
                  href={m.linkedin ?? "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${m.name} LinkedIn`}
                  className="flex h-8 w-8 items-center justify-center rounded-md bg-[#0A66C2] text-white transition-colors hover:bg-[#0A66C2]/15 hover:text-[#0A66C2]"
                >
                  <LinkedinLogo className="h-4 w-4" />
                </a>
                <a
                  href={m.github ?? "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${m.name} GitHub`}
                  className="flex h-8 w-8 items-center justify-center rounded-md bg-[#181717] text-white transition-colors hover:bg-[#181717]/15 hover:text-[#181717] dark:hover:bg-white/20 dark:hover:text-white"
                >
                  <GithubLogo className="h-4 w-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
