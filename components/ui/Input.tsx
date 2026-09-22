"use client";

import { InputHTMLAttributes, forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, id, type = "text", ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputId = id ?? props.name;
    const isPassword = type === "password";

    // Tentukan tipe input aktif (text ketika mata aktif, password ketika tertutup)
    const activeType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
      <div className="flex flex-col gap-1.5 w-full text-left">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-ink-950">
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          <input
            ref={ref}
            id={inputId}
            type={activeType}
            className={cn(
              "h-11 w-full rounded-2xl border border-surface-200 bg-surface-50 px-4 text-sm text-ink-950 placeholder:text-ink-600/50",
              "focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-100 transition-colors",
              isPassword && "pr-11", // Ruang padding kanan agar teks tidak tertutup icon mata
              error && "border-status-cancelled focus:border-status-cancelled focus:ring-status-cancelled/20",
              className
            )}
            aria-invalid={!!error}
            {...props}
          />

          {isPassword && (
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Sembunyikan sandi" : "Lihat sandi"}
              className="absolute right-3.5 flex h-7 w-7 items-center justify-center rounded-lg text-ink-600/60 hover:text-ink-950 hover:bg-surface-200/50 transition-colors focus:outline-none"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
        </div>

        {error && <p className="text-xs text-status-cancelled">{error}</p>}
        {!error && hint && <p className="text-xs text-ink-600">{hint}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;