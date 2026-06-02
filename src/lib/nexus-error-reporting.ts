type NexusErrorOptions = {
  mechanism?: "manual" | "onerror" | "unhandledrejection" | "react_error_boundary";
  handled?: boolean;
  severity?: "error" | "warning" | "info";
};

type NexusEvents = {
  captureException?: (
    error: unknown,
    context?: Record<string, unknown>,
    options?: NexusErrorOptions,
  ) => void;
};

declare global {
  interface Window {
    __nexusEvents?: NexusEvents;
  }
}

export function reportNexusError(error: unknown, context: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  window.__nexusEvents?.captureException?.(
    error,
    {
      source: "react_error_boundary",
      route: window.location.pathname,
      ...context,
    },
    {
      mechanism: "react_error_boundary",
      handled: false,
      severity: "error",
    },
  );
}
