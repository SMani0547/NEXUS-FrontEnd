import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { useMemo, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import type { YieldRow } from "@/lib/api/client";

type SortKey = keyof YieldRow;
type SortDir = "asc" | "desc";

const COLUMNS: { key: SortKey; label: string; align?: "right" }[] = [
  { key: "country", label: "Country" },
  { key: "product", label: "Product" },
  { key: "type", label: "Type" },
  { key: "year", label: "Year", align: "right" },
  { key: "yield", label: "Yield", align: "right" },
  { key: "unit", label: "Unit" },
];

export function DataTable({ rows, pageSize = 12 }: { rows: YieldRow[]; pageSize?: number }) {
  const [sortKey, setSortKey] = useState<SortKey>("year");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(0);

  const sorted = useMemo(() => {
    const copy = [...rows];
    copy.sort((a, b) => {
      const left = a[sortKey];
      const right = b[sortKey];
      if (left == null && right == null) return 0;
      if (left == null) return 1;
      if (right == null) return -1;
      if (typeof left === "number" && typeof right === "number") {
        return sortDir === "asc" ? left - right : right - left;
      }
      return sortDir === "asc"
        ? String(left).localeCompare(String(right))
        : String(right).localeCompare(String(left));
    });
    return copy;
  }, [rows, sortKey, sortDir]);

  const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize));
  const safePage = Math.min(page, pageCount - 1);
  const visible = sorted.slice(safePage * pageSize, safePage * pageSize + pageSize);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((current) => (current === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "year" || key === "yield" ? "desc" : "asc");
    }
    setPage(0);
  };

  return (
    <div className="space-y-3">
      <Table>
        <TableHeader>
          <TableRow>
            {COLUMNS.map((column) => (
              <TableHead key={column.key} className={column.align === "right" ? "text-right" : undefined}>
                <button
                  type="button"
                  onClick={() => toggleSort(column.key)}
                  className="inline-flex items-center gap-1 hover:text-foreground"
                >
                  {column.label}
                  {sortKey === column.key ? (
                    sortDir === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                  ) : (
                    <ArrowUpDown className="h-3 w-3 opacity-40" />
                  )}
                </button>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {visible.length === 0 ? (
            <TableRow>
              <TableCell colSpan={COLUMNS.length} className="text-center text-muted-foreground py-8">
                No rows match the current filters.
              </TableCell>
            </TableRow>
          ) : (
            visible.map((row, index) => (
              <TableRow key={`${row.country}-${row.product}-${row.year}-${index}`}>
                <TableCell>{row.country}</TableCell>
                <TableCell>{row.product}</TableCell>
                <TableCell className="capitalize">{row.type}</TableCell>
                <TableCell className="text-right">{row.year}</TableCell>
                <TableCell className="text-right">{Math.round(row.yield).toLocaleString()}</TableCell>
                <TableCell className="text-muted-foreground">{row.unit}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {sorted.length.toLocaleString()} rows · page {safePage + 1} of {pageCount}
        </span>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled={safePage === 0} onClick={() => setPage((current) => Math.max(0, current - 1))}>
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={safePage >= pageCount - 1}
            onClick={() => setPage((current) => Math.min(pageCount - 1, current + 1))}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
