import { cn } from "@/lib/utils/cn";
import type { ReservasiStatus } from "@/components/ui/Badge";

export const STATUS_TABS: { label: string; value: ReservasiStatus | "semua" }[] = [
  { label: "Semua", value: "semua" },
  { label: "Belum dikonfirmasi", value: "belum_dikonfirm" },
  { label: "Disetujui", value: "disetujui" },
  { label: "Aktif", value: "aktif" },
  { label: "Selesai", value: "selesai" },
  { label: "Dibatalkan", value: "dibatalkan" },
];

interface ReservationTabsProps {
  activeTab: ReservasiStatus | "semua";
  onTabChange: (tab: ReservasiStatus | "semua") => void;
}

export default function ReservationTabs({
  activeTab,
  onTabChange,
}: ReservationTabsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto">
      {STATUS_TABS.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onTabChange(tab.value)}
          className={cn(
            "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors",
            activeTab === tab.value
              ? "bg-brand-600 text-white"
              : "bg-white text-ink-600 hover:bg-surface-100"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
