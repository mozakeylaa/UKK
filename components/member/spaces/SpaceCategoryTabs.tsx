import { Search } from "lucide-react";
import type { SpaceType, SpaceTipe } from "@/lib/types/space";
import { cn } from "@/lib/utils/cn";
import Input from "@/components/ui/Input";

interface SpaceCategoryTabsProps {
  spaceTypes: SpaceType[];
  activeTipe: SpaceTipe | "all";
  search: string;
  onSelectTipe: (tipe: SpaceTipe | "all") => void;
  onSearchChange: (search: string) => void;
}

export default function SpaceCategoryTabs({
  spaceTypes,
  activeTipe,
  search,
  onSelectTipe,
  onSearchChange,
}: SpaceCategoryTabsProps) {
  const tabs: { label: string; value: SpaceTipe | "all" }[] = [
    { label: "Semua", value: "all" },
    ...spaceTypes.map((t) => ({ label: t.label, value: t.tipe })),
  ];

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex gap-2 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => onSelectTipe(tab.value)}
            className={cn(
              "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors",
              activeTipe === tab.value
                ? "bg-brand-600 text-white"
                : "bg-white text-ink-600 hover:bg-surface-100"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="relative w-full sm:w-64">
        <Search
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-600"
        />
        <Input
          placeholder="Cari space..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>
    </div>
  );
}
