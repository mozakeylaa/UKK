import { cn } from "@/lib/utils/cn";

export type ReservasiStatus =
  | "belum_dikonfirm"
  | "disetujui"
  | "aktif"
  | "selesai"
  | "dibatalkan";

const statusConfig: Record<
  ReservasiStatus,
  { label: string; dot: string; bg: string; text: string }
> = {
  belum_dikonfirm: {
    label: "Belum dikonfirmasi",
    dot: "bg-status-pending",
    bg: "bg-status-pending/10",
    text: "text-status-pending",
  },
  disetujui: {
    label: "Disetujui",
    dot: "bg-status-approved",
    bg: "bg-status-approved/10",
    text: "text-status-approved",
  },
  aktif: {
    label: "Aktif",
    dot: "bg-status-active",
    bg: "bg-status-active/10",
    text: "text-status-active",
  },
  selesai: {
    label: "Selesai",
    dot: "bg-status-done",
    bg: "bg-status-done/10",
    text: "text-status-done",
  },
  dibatalkan: {
    label: "Dibatalkan",
    dot: "bg-status-cancelled",
    bg: "bg-status-cancelled/10",
    text: "text-status-cancelled",
  },
};

interface BadgeProps {
  status: ReservasiStatus;
  className?: string;
}

function Badge({ status, className }: BadgeProps) {
  const config = statusConfig[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        config.bg,
        config.text,
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", config.dot)} />
      {config.label}
    </span>
  );
}

export default Badge;