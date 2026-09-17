import { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-surface-200 px-6 py-12 text-center">
      <p className="font-display text-base font-medium text-ink-950">{title}</p>
      {description && <p className="max-w-sm text-sm text-ink-600">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

export default EmptyState;