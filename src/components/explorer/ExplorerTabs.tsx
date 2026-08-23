import { BarChart3, Flame, Globe2, Sprout, Beef } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export const EXPLORER_TABS = [
  { id: "overview", label: "Overview", icon: BarChart3 },
  { id: "crops", label: "Crops", icon: Sprout },
  { id: "livestock", label: "Livestock", icon: Beef },
  { id: "compare", label: "Compare", icon: Globe2 },
  { id: "heatmap", label: "Heatmap", icon: Flame },
] as const;

export type ExplorerTabId = (typeof EXPLORER_TABS)[number]["id"];

export function ExplorerTabs({
  value,
  onValueChange,
  children,
}: {
  value: ExplorerTabId;
  onValueChange: (value: ExplorerTabId) => void;
  children: ReactNode;
}) {
  return (
    <Tabs value={value} onValueChange={(next) => onValueChange(next as ExplorerTabId)} className="space-y-6">
      <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1 bg-muted/80 p-1">
        {EXPLORER_TABS.map(({ id, label, icon: Icon }) => (
          <TabsTrigger
            key={id}
            value={id}
            className={cn(
              "gap-2 px-3 py-2 data-[state=active]:shadow-sm",
              id === "crops" && "data-[state=active]:text-emerald-700",
              id === "livestock" && "data-[state=active]:text-orange-700",
              id === "heatmap" && "data-[state=active]:text-violet-700",
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </TabsTrigger>
        ))}
      </TabsList>
      {children}
    </Tabs>
  );
}

export function ExplorerTabPanel({ value, children }: { value: ExplorerTabId; children: ReactNode }) {
  return (
    <TabsContent value={value} className="mt-0 space-y-6">
      {children}
    </TabsContent>
  );
}
