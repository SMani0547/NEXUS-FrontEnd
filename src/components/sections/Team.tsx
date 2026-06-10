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

const memberColors = [
  { primary: "#00FFD1", secondary: "#00A89A" },
  { primary: "#7B2FFF", secondary: "#5A22CC" },
  { primary: "#FF2D6B", secondary: "#CC1A4F" },
  { primary: "#00FFD1", secondary: "#00A89A" },
  { primary: "#00A8FF", secondary: "#0080CC" },
  { primary: "#7B2FFF", secondary: "#5A22CC" },
];

function HolographicAvatar({ member, color, idx }: { member: TeamMember; color: typeof memberColors[0]; idx: number }) {
  const initials = member.name.split(" ").map((p) => p[0]).join("");
  return (
    <div className="relative w-full aspect-square rounded-lg overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${color.primary}20 0%, ${color.secondary}10 100%)`,
        border: `1px solid ${color.primary}30`,
      }}
    >
      {/* Scan line effect */}
      <div className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: `repeating-linear-gradient(0deg, transparent, transparent 3px, ${color.primary}06 3px, ${color.primary}06 4px)`,
        }}
      />

      {/* Corner brackets */}
      {[
        "top-1 left-1 border-t border-l",
        "top-1 right-1 border-t border-r",
        "bottom-1 left-1 border-b border-l",
        "bottom-1 right-1 border-b border-r",
      ].map((cls, i) => (
        <div key={i} className={`absolute w-5 h-5 ${cls} z-20`}
          style={{ borderColor: color.primary, opacity: 0.7 }} />
      ))}

      {/* Photo or initials */}
      {member.photo ? (
        <img src={member.photo} alt={member.name}
          className="absolute inset-0 w-full h-full object-cover object-center"
          loading="lazy" />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <span style={{
            fontFamily: "'Orbitron', monospace",
            fontSize: "3rem",
            fontWeight: "bold",
            color: color.primary,
            textShadow: `0 0 20px ${color.primary}`,
          }}>{initials}</span>
        </div>
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 z-10"
        style={{ background: "linear-gradient(to top, rgba(3,0,28,0.7) 0%, transparent 40%)" }}
      />

      {/* ID tag at bottom */}
      <div className="absolute bottom-2 left-2 right-2 z-20">
        <div className="font-mono text-[9px] tracking-widest" style={{ color: color.primary, opacity: 0.7 }}>
          NEXUS.ID/{String(idx + 1).padStart(3, "0")}
        </div>
      </div>
    </div>
  );
}

function MemberCard({ member, idx }: { member: TeamMember; idx: number }) {
  const color = memberColors[idx % memberColors.length];
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [activeTouch, setActiveTouch] = useState(false);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: y * -8, y: x * 8 });
  };

  return (
    <div
      className="relative"
      style={{ perspective: "1000px" }}
      onClick={() => {
        const isTouch = window.matchMedia("(hover: none)").matches;
        if (isTouch) setActiveTouch((v) => !v);
      }}
    >
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => { setHovered(false); setTilt({ x: 0, y: 0 }); }}
        onMouseMove={handleMove}
        className="relative rounded-xl overflow-hidden cursor-default"
        style={{
          background: "linear-gradient(135deg, rgba(15,5,40,0.95) 0%, rgba(3,0,20,0.98) 100%)",
          border: `1px solid ${(hovered || activeTouch) ? color.primary + "50" : color.primary + "18"}`,
          boxShadow: (hovered || activeTouch)
            ? `0 0 40px ${color.primary}18, 0 30px 60px rgba(0,0,0,0.6), inset 0 1px 0 ${color.primary}20`
            : "0 4px 20px rgba(0,0,0,0.5)",
          transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(${hovered ? 6 : 0}px)`,
          transformStyle: "preserve-3d",
          transition: "border-color 0.3s, box-shadow 0.3s, transform 0.15s",
        }}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 py-2.5"
          style={{ borderBottom: `1px solid ${color.primary}12` }}>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full"
              style={{ background: color.primary, boxShadow: `0 0 6px ${color.primary}` }} />
            <span className="font-mono text-[9px] tracking-widest uppercase"
              style={{ color: "rgba(255,255,255,0.25)" }}>
              TEAM NEXUS
            </span>
          </div>
          <span className="font-mono text-[9px]" style={{ color: `${color.primary}50` }}>
            {String(idx + 1).padStart(2, "0")}/{team.length}
          </span>
        </div>

        {/* Avatar */}
        <div className="p-4 pb-0">
          <HolographicAvatar member={member} color={color} idx={idx} />
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="font-mono font-bold text-base mb-0.5" style={{ color: "#fff" }}>
            {member.name}
          </h3>
          <p className="font-mono text-xs mb-3 uppercase tracking-wide"
            style={{ color: color.primary }}>
            {member.role}
          </p>
          <p className="text-xs leading-relaxed mb-4"
            style={{ color: "rgba(255,255,255,0.4)", fontFamily: "'Space Grotesk', sans-serif" }}>
            {member.bio}
          </p>

          {/* Links */}
          <div className="flex gap-2">
            <a href={member.linkedin ?? "#"} target="_blank" rel="noopener noreferrer"
              aria-label={`${member.name} LinkedIn`}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center justify-center w-8 h-8 rounded transition-all"
              style={{
                background: "rgba(10,102,194,0.2)",
                border: "1px solid rgba(10,102,194,0.3)",
                color: "#0A66C2",
              }}>
              <LinkedinLogo className="w-3.5 h-3.5" />
            </a>
            <a href={member.github ?? "#"} target="_blank" rel="noopener noreferrer"
              aria-label={`${member.name} GitHub`}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center justify-center w-8 h-8 rounded transition-all"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "rgba(255,255,255,0.7)",
              }}>
              <GithubLogo className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Bottom glow bar */}
        <div className="absolute bottom-0 left-0 right-0 h-px transition-opacity duration-300"
          style={{
            background: `linear-gradient(to right, transparent, ${color.primary}60, transparent)`,
            opacity: hovered ? 1 : 0,
          }}
        />
      </div>
    </div>
  );
}

export function Team() {
  return (
    <section id="team" className="relative py-24 overflow-hidden scroll-mt-20"
      style={{ background: "#03001C" }}>

      {/* Background dots grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(rgba(0,255,209,1) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(123,47,255,0.06) 0%, transparent 70%)" }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="max-w-3xl mb-16">
          <p className="font-mono text-xs uppercase tracking-[0.4em] mb-4" style={{ color: "#00FFD1" }}>
            Team Nexus
          </p>
          <h2
            className="font-bold leading-none mb-4"
            style={{
              fontFamily: "'Orbitron', monospace",
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              color: "#fff",
            }}
          >
            MEET{" "}
            <span style={{ color: "#00FFD1", textShadow: "0 0 20px #00FFD1" }}>TEAM NEXUS</span>
          </h2>
          <p className="text-base" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "'Space Grotesk', sans-serif" }}>
            A multidisciplinary team transforming Pacific agricultural data into actionable intelligence.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
          {team.map((member, idx) => (
            <MemberCard key={member.name} member={member} idx={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}
