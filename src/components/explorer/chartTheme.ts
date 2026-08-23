export const tooltipStyle = {
  backgroundColor: "var(--card)",
  border: "1px solid var(--border)",
  borderRadius: 8,
  fontSize: 12,
};

export const COUNTRY_COLORS = [
  "#0EA5E9",
  "#14B8A6",
  "#6366F1",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#10B981",
  "#F97316",
  "#06B6D4",
  "#EC4899",
  "#84CC16",
  "#3B82F6",
  "#A855F7",
  "#0F766E",
];

export const TYPE_COLORS = {
  crop: "#059669",
  livestock: "#EA580C",
} as const;

export function colorForIndex(index: number) {
  return COUNTRY_COLORS[index % COUNTRY_COLORS.length];
}
