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

const now = new Date();
const YEAR_OPTIONS = Array.from({ length: 5 }, (_, i) => {
  const year = now.getFullYear() - i;
  return { label: String(year), value: String(year) };
});

interface HistoriPeriodFilterProps {
  month: string;
  year: string;
  onChangeMonth: (month: string) => void;
  onChangeYear: (year: string) => void;
}

export default function HistoriPeriodFilter({
  month,
  year,
  onChangeMonth,
  onChangeYear,
}: HistoriPeriodFilterProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:w-96">
      <Select
        label="Bulan"
        options={MONTH_OPTIONS}
        value={month}
        onChange={(e) => onChangeMonth(e.target.value)}
      />
      <Select
        label="Tahun"
        options={YEAR_OPTIONS}
        value={year}
        onChange={(e) => onChangeYear(e.target.value)}
      />
    </div>
  );
}
