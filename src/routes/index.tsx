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
        /* Let the shared app theme control the page background */
        body {
          background-color: var(--color-background);
          color: var(--color-foreground);
        }

        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }

        /* Nexus custom selection color */
        ::selection {
          background: color-mix(in oklab, var(--color-accent) 25%, transparent);
          color: var(--color-accent);
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: var(--color-background);
        }
        ::-webkit-scrollbar-thumb {
          background: var(--color-border);
          border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: var(--color-muted-foreground);
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
