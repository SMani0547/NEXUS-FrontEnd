import { useEffect, useState } from "react";

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
    role: "Project Lead / Predictive Architect",
    bio: "Drives product strategy, timelines, and cross-functional alignment between engineering, data, and research.",
    photo: "/abhishek.jpg",
    linkedin: "https://www.linkedin.com/in/abhishek-swamy-983b86217/",
    github: "https://github.com/Amanimal",
  },
  {
    name: "Shiva Goundar",
    role: "Data & Infrastructure Architect",
    bio: "Architects and implements the backend infrastructure, secure data engineering pipelines, and core APIs.",
    photo: "/shiva.jpg",
    linkedin: "https://www.linkedin.com/in/shiva-goundar-270a901b9/",
    github: "https://github.com/SMani0547",
  },
  {
    name: "Shainesh Nand",
    role: "UI/UX Systems Architect",
    bio: "Architects and implements the user interface framework, high-performance visual layers, and client-side systems.",
    photo: "/shainesh.jpg",
    linkedin: "https://www.linkedin.com/in/shainesh-nand-80a954313/",
    github: "https://github.com/shaineshnand",
  },
  {
    name: "Pranshu Nadan",
    role: "Agricultural Data Analyst",
    bio: "Extracts, models, and analyzes agricultural datasets to uncover key patterns and statistical trends.",
    photo: "/Pranshu.jpg",
    linkedin: "#",
    github: "https://github.com/NotPranshu",
  },
  {
    name: "Parth Badgujar",
    role: "Climate Data Analyst",
    bio: "Analyzes climate data models to quantify impacts on food security and human environmental systems.",
    photo: "/parth.jpg",
    linkedin: "https://www.linkedin.com/in/parth-badgujar-6a255a2a6/",
    github: "https://github.com/Parth-PSB",
  },
  {
    name: "Pranav Kumar",
    role: "Generative AI Engineer",
    bio: "Engineers the Nexus AI conversational layer, contextual intelligence models, and text-based data narratives.",
    photo: "/pranav.jpg",
    linkedin: "https://www.linkedin.com/in/pranav-kumar-16b950260/",
    github: "https://github.com/PranavKumar590",
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
  const [activeCard, setActiveCard] = useState<string | null>(null);

  const toggleCardForTouch = (name: string) => {
    const isTouchLike =
      typeof window !== "undefined" &&
      window.matchMedia("(hover: none), (pointer: coarse)").matches;

    if (!isTouchLike) return;
    setActiveCard((current) => (current === name ? null : name));
  };

  useEffect(() => {
    if (!activeCard) return;

    const resetActiveCard = () => setActiveCard(null);
    window.addEventListener("scroll", resetActiveCard, { passive: true });
    return () => window.removeEventListener("scroll", resetActiveCard);
  }, [activeCard]);

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

        <div className="mx-auto grid max-w-6xl sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {team.map((m, i) => {
            const isActive = activeCard === m.name;

            return (
            <div
              key={m.name}
              className="group relative pt-7 [perspective:1200px]"
              onClick={() => toggleCardForTouch(m.name)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  toggleCardForTouch(m.name);
                }
              }}
              tabIndex={0}
            >
              <div
                className={`relative h-full rounded-2xl border border-border bg-card p-5 shadow-card transition-all duration-500 ease-out [transform-style:preserve-3d] [transform:rotateX(0deg)_translateY(0)] [@media(hover:hover)]:group-hover:shadow-elegant [@media(hover:hover)]:group-hover:[transform:rotateX(52deg)_translateY(12px)] motion-reduce:transition-none motion-reduce:transform-none ${isActive ? "shadow-elegant [transform:rotateX(34deg)_translateY(6px)]" : ""}`}
              >
                <div className={`pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 via-transparent to-accent/10 opacity-0 transition-opacity duration-500 [@media(hover:hover)]:group-hover:opacity-100 ${isActive ? "opacity-100" : ""}`} />

                <div
                  className={`relative z-10 mb-5 aspect-[6/7] w-full rounded-xl bg-gradient-to-br ${colors[i]} shadow-card transition-all duration-500 ease-out [transform-origin:center_bottom] [transform-style:preserve-3d] [transform:translateZ(0)_rotateX(0deg)_scale(1)] [@media(hover:hover)]:group-hover:z-20 [@media(hover:hover)]:group-hover:[transform:translateZ(58px)_rotateX(-32deg)_scale(1.02)] [@media(hover:hover)]:group-hover:shadow-glow motion-reduce:transition-none motion-reduce:transform-none ${isActive ? "z-20 shadow-glow [transform:translateZ(34px)_rotateX(-32deg)_scale(1)]" : ""}`}
                >
                  <div className="absolute inset-0 rounded-xl">
                    {m.photo ? (
                      <img
                        src={m.photo}
                        alt={m.name}
                        className="absolute inset-0 h-full w-full rounded-xl object-cover object-center transition-transform duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <div className="absolute inset-0 flex h-full w-full items-center justify-center rounded-xl text-white font-display text-6xl font-bold opacity-90">
                        {m.name
                          .split(" ")
                          .map((p) => p[0])
                          .join("")}
                      </div>
                    )}
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/35 via-transparent to-white/10" />
                  </div>
                </div>

                <div className={`relative transition-transform duration-500 ease-out [transform:translateZ(0)] [@media(hover:hover)]:group-hover:[transform:translateZ(34px)] motion-reduce:transition-none motion-reduce:transform-none ${isActive ? "[transform:translateZ(20px)]" : ""}`}>
                  <h3 className="font-display text-lg font-semibold">{m.name}</h3>
                  <p className="mb-3 text-sm font-medium text-accent">{m.role}</p>
                  <p className="mb-4 min-h-14 text-sm leading-relaxed text-muted-foreground">
                    {m.bio}
                  </p>
                </div>

                <div className={`relative flex gap-2 transition-transform duration-500 ease-out [transform:translateZ(0)] [@media(hover:hover)]:group-hover:[transform:translateZ(46px)] motion-reduce:transition-none motion-reduce:transform-none ${isActive ? "[transform:translateZ(26px)]" : ""}`}>
                  <a
                    href={m.linkedin ?? "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${m.name} LinkedIn`}
                    className="flex h-8 w-8 items-center justify-center rounded-md bg-[#0A66C2] text-white transition-colors hover:bg-[#0A66C2]/15 hover:text-[#0A66C2]"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <LinkedinLogo className="h-4 w-4" />
                  </a>
                  <a
                    href={m.github ?? "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${m.name} GitHub`}
                    className="flex h-8 w-8 items-center justify-center rounded-md bg-[#181717] text-white transition-colors hover:bg-[#181717]/15 hover:text-[#181717] dark:hover:bg-white/20 dark:hover:text-white"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <GithubLogo className="h-4 w-4" />
                  </a>
                </div>

                <div
                  aria-hidden="true"
                  className={`pointer-events-none absolute inset-x-8 bottom-0 h-8 rounded-full bg-primary/15 blur-2xl transition-all duration-500 [@media(hover:hover)]:group-hover:translate-y-5 [@media(hover:hover)]:group-hover:scale-110 [@media(hover:hover)]:group-hover:bg-primary/25 ${isActive ? "translate-y-5 scale-110 bg-primary/25" : ""}`}
                >
                </div>
              </div>
            </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
