import { Card } from "@/components/ui/Card";
import Select from "@/components/ui/Select";

const MONTH_OPTIONS = [
  { label: "Januari", value: "1" },
  { label: "Februari", value: "2" },
  { label: "Maret", value: "3" },
  { label: "April", value: "4" },
  { label: "Mei", value: "5" },
  { label: "Juni", value: "6" },
  { label: "Juli", value: "7" },
  { label: "Agustus", value: "8" },
  { label: "September", value: "9" },
  { label: "Oktober", value: "10" },
  { label: "November", value: "11" },
  { label: "Desember", value: "12" },
];

interface LaporanFilterCardProps {
  month: number;
  year: number;
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
}

export default function LaporanFilterCard({
  month,
  year,
  onMonthChange,
  onYearChange,
}: LaporanFilterCardProps) {
  return (
    <Card>
      <div className="grid grid-cols-2 gap-3 md:w-1/2">
        <Select
          label="Bulan"
          options={MONTH_OPTIONS}
          value={String(month)}
          onChange={(e) => onMonthChange(Number(e.target.value))}
        />
        <input
          type="number"
          value={year}
          onChange={(e) => onYearChange(Number(e.target.value))}
          className="mt-6 h-10 rounded-md border border-surface-200 bg-white px-3 text-sm text-ink-950 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
        />
      </div>
    </Card>
  );
}
