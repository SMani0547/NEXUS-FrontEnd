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
      { name: "description", content: "Explore Pacific crop and livestock yield trends through data visualization, storytelling, and AI. Built for the Pacific Dataviz Challenge 2026." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
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
