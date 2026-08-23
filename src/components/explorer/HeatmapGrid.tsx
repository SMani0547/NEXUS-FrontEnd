export type HeatmapGridCell = {
  row: string;
  col: string;
  value: number | null;
  count?: number;
};

export function HeatmapGrid({
  rows,
  cols,
  cells,
  emptyLabel = "No heatmap cells for these filters.",
}: {
  rows: string[];
  cols: string[];
  cells: HeatmapGridCell[];
  emptyLabel?: string;
}) {
  const lookup = new Map(cells.map((cell) => [`${cell.row}::${cell.col}`, cell]));
  const max = Math.max(...cells.map((cell) => cell.value ?? 0), 1);

  if (!rows.length || !cols.length) {
    return <p className="text-sm text-muted-foreground py-10 text-center">{emptyLabel}</p>;
  }

  return (
    <div className="overflow-auto max-h-[420px]">
      <table className="text-[10px] border-separate border-spacing-0.5">
        <thead>
          <tr>
            <th className="sticky left-0 top-0 z-20 bg-card" />
            {cols.map((col) => (
              <th key={col} className="sticky top-0 bg-card px-1 py-1 text-muted-foreground font-normal whitespace-nowrap text-left">
                <div className="origin-bottom-left -rotate-45 translate-y-2 w-4">{col.slice(0, 10)}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row}>
              <td className="sticky left-0 bg-card pr-2 text-muted-foreground whitespace-nowrap">{row.slice(0, 14)}</td>
              {cols.map((col) => {
                const cell = lookup.get(`${row}::${col}`);
                const value = cell?.value ?? 0;
                const intensity = value / max;
                return (
                  <td
                    key={col}
                    title={`${row} · ${col}: ${cell?.value == null ? "no data" : Math.round(cell.value).toLocaleString()}`}
                    className="w-7 h-7 rounded"
                    style={{
                      backgroundColor: cell?.count || cell?.value != null
                        ? `oklch(0.7 0.16 230 / ${0.12 + intensity * 0.85})`
                        : "var(--muted)",
                    }}
                  />
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
