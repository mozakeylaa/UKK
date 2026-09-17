import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-surface-200/70 bg-white p-5 shadow-sm shadow-ink-950/[0.03]",
        className
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("mb-4 flex items-center justify-between", className)} {...props} />
  );
}

function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("font-display text-lg font-semibold text-ink-950", className)}
      {...props}
    />
  );
}

export { Card, CardHeader, CardTitle };
export default Card;