import { cn } from "@/lib/utils/cn";

interface SpinnerProps {
  className?: string;
  label?: string;
}

function Spinner({ className, label = "Memuat..." }: SpinnerProps) {
  return (
    <div className="flex items-center justify-center gap-2 py-8 text-ink-600">
      <span
        className={cn(
          "h-5 w-5 animate-spin rounded-full border-2 border-surface-200 border-t-brand-600",
          className
        )}
      />
      <span className="text-sm">{label}</span>
    </div>
  );
}

export default Spinner;