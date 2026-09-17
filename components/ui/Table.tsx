import { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

interface Column<T> {
  header: string;
  accessor: (row: T) => ReactNode;
  className?: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string | number;
  className?: string;
}

function Table<T>({ columns, data, keyExtractor, className }: TableProps<T>) {
  return (
    <div className={cn("overflow-x-auto rounded-lg border border-surface-200", className)}>
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-surface-200 bg-surface-50">
            {columns.map((col, i) => (
              <th key={i} className={cn("px-4 py-3 font-medium text-ink-600", col.className)}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr
              key={keyExtractor(row)}
              className="border-b border-surface-200 last:border-0 hover:bg-surface-50"
            >
              {columns.map((col, i) => (
                <td key={i} className={cn("px-4 py-3 text-ink-800", col.className)}>
                  {col.accessor(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;