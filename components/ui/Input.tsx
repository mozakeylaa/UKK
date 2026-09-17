import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils/cn";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const inputId = id ?? props.name;
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-ink-950">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "h-11 rounded-2xl border border-surface-200 bg-surface-50 px-4 text-sm text-ink-950 placeholder:text-ink-600/50",
            "focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-100",
            error && "border-status-cancelled focus:border-status-cancelled focus:ring-status-cancelled/20",
            className
          )}
          aria-invalid={!!error}
          {...props}
        />
        {error && <p className="text-xs text-status-cancelled">{error}</p>}
        {!error && hint && <p className="text-xs text-ink-600">{hint}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;