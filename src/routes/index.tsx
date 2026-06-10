import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/sections/Hero";
import { Stats } from "@/components/sections/Stats";
import { About } from "@/components/sections/About";
import { Story } from "@/components/sections/Story";
import { Insights } from "@/components/sections/Insights";
import { Team } from "@/components/sections/Team";
import { DataSources } from "@/components/sections/DataSources";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NEXUS — Connecting Pacific Agriculture, Climate, and Data" },
      {
        name: "description",
        content:
          "Explore Pacific crop and livestock yield trends through data visualization, storytelling, and AI. Built for the Pacific Dataviz Challenge 2026.",
      },
    ],
    links: [
      {
        rel: "preconnect",
        href: "https://fonts.googleapis.com",
      },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Space+Grotesk:wght@300;400;500;600;700&display=swap",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      {/* Global scoped CSS for this page */}
      <style>{`
        /* Force dark background throughout — no theme flash */
        body {
          background-color: #03001C;
        }

        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }

        /* Nexus custom selection color */
        ::selection {
          background: rgba(0, 255, 209, 0.25);
          color: #00FFD1;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: #03001C;
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(0, 255, 209, 0.3);
          border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 255, 209, 0.6);
        }

        /* Orbitron fallback chain */
        .font-orbitron {
          font-family: 'Orbitron', 'Space Grotesk', ui-monospace, monospace;
        }
      `}</style>

      <Hero />
      <Stats />
      <About />
      <Story />
      <Insights />
      <Team />
      <DataSources />
    </>
  );
}
