import { cn } from "@/lib/utils/cn";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className={cn("flex items-center justify-between gap-2 py-3", className)}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="rounded-md border border-surface-200 px-3 py-1.5 text-sm font-medium text-ink-950 hover:bg-surface-100 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Sebelumnya
      </button>

      <div className="flex items-center gap-1">
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={cn(
              "h-8 w-8 rounded-md text-sm font-medium transition-colors",
              page === currentPage
                ? "bg-brand-600 text-white"
                : "text-ink-700 hover:bg-surface-100"
            )}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="rounded-md border border-surface-200 px-3 py-1.5 text-sm font-medium text-ink-950 hover:bg-surface-100 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Selanjutnya
      </button>
    </div>
  );
}

export default Pagination;