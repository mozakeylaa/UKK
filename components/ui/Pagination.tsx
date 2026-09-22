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

  // Hanya tampilkan halaman awal, akhir, dan 1 halaman di kiri-kanan halaman aktif
  const visiblePages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (page) =>
      page === 1 ||
      page === totalPages ||
      Math.abs(page - currentPage) <= 1
  );

  return (
    <div className={cn("flex items-center justify-between gap-2 py-3", className)}>
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="rounded-md border border-surface-200 px-3 py-1.5 text-sm font-medium text-ink-950 hover:bg-surface-100 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Sebelumnya
      </button>

      <div className="flex items-center gap-1">
        {visiblePages.map((page, index) => {
          const prevPage = visiblePages[index - 1];
          const hasGap = prevPage && page - prevPage > 1;

          return (
            <div key={page} className="flex items-center gap-1">
              {hasGap && (
                <span className="px-1 text-sm text-ink-600/50 select-none">...</span>
              )}
              <button
                type="button"
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
            </div>
          );
        })}
      </div>

      <button
        type="button"
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