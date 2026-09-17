import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils/cn";

type ButtonVariant = "primary" | "secondary" | "outline" | "danger" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-sm shadow-brand-600/20 hover:from-brand-600 hover:to-brand-700 disabled:from-brand-100 disabled:to-brand-100 disabled:text-ink-600",
  secondary: "bg-navy-800 text-white hover:bg-navy-900 disabled:bg-ink-600",
  outline:
    "border border-surface-200 text-ink-950 hover:bg-surface-100 disabled:text-ink-600",
  danger:
    "bg-status-cancelled text-white hover:bg-red-700 disabled:bg-red-200",
  ghost: "text-ink-950 hover:bg-surface-100 disabled:text-ink-600",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-8 px-4 text-sm",
  md: "h-10 px-5 text-sm",
  lg: "h-12 px-7 text-base",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "primary", size = "md", isLoading, children, disabled, ...props },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-full font-display font-semibold transition-colors disabled:cursor-not-allowed",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {isLoading && (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;