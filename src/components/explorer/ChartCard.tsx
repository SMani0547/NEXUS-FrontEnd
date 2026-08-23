import { ClientOnly } from "@tanstack/react-router";
import { Download } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

export function ClientChart({ children, height = 260 }: { children: ReactNode; height?: number }) {
  return (
    <ClientOnly
      fallback={
        <div className="grid place-items-center text-sm text-muted-foreground" style={{ height }}>
          Preparing chart...
        </div>
      }
    >
      {children}
    </ClientOnly>
  );
}

export function ChartCard({
  title,
  subtitle,
  children,
  loading,
  onDownload,
  minHeight = 260,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  loading?: boolean;
  onDownload?: () => void;
  minHeight?: number;
}) {
  return (
    <div className="bg-card border border-border rounded-2xl p-5 shadow-card">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-display font-semibold">{title}</h3>
          {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>
        {onDownload && (
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-muted-foreground" onClick={onDownload}>
            <Download className="w-3.5 h-3.5" />
          </Button>
        )}
      </div>
      <div className="relative" style={{ minHeight }}>
        {children}
        {loading && (
          <div className="absolute inset-0 grid place-items-center rounded-xl bg-card/70 text-sm text-muted-foreground backdrop-blur-sm">
            Loading...
          </div>
        )}
      </div>
    </div>
  );
}
