import { SelectHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils/cn";

interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, placeholder, id, ...props }, ref) => {
    const selectId = id ?? props.name;
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={selectId} className="text-sm font-medium text-ink-950">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={cn(
            "h-11 rounded-2xl border border-surface-200 bg-surface-50 px-4 text-sm text-ink-950",
            "focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-100",
            error && "border-status-cancelled focus:border-status-cancelled focus:ring-status-cancelled/20",
            className
          )}
          aria-invalid={!!error}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="text-xs text-status-cancelled">{error}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";
export default Select;