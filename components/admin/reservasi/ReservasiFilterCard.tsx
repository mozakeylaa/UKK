import type { AdminReservasiFilter } from "@/lib/types/reservasi";
import type { AdminSpace } from "@/lib/types/admin";
import type { ReservasiStatus } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";

const STATUS_OPTIONS: { label: string; value: ReservasiStatus }[] = [
  { label: "Belum Dikonfirmasi", value: "belum_dikonfirm" },
  { label: "Disetujui", value: "disetujui" },
  { label: "Aktif", value: "aktif" },
  { label: "Selesai", value: "selesai" },
  { label: "Dibatalkan", value: "dibatalkan" },
];

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

interface ReservasiFilterCardProps {
  filter: AdminReservasiFilter;
  spaces: AdminSpace[];
  onFilterChange: (newFilter: AdminReservasiFilter) => void;
}

export default function ReservasiFilterCard({
  filter,
  spaces,
  onFilterChange,
}: ReservasiFilterCardProps) {
  return (
    <Card>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        <Select
          label="Bulan"
          options={MONTH_OPTIONS}
          value={String(filter.month ?? "")}
          onChange={(e) =>
            onFilterChange({
              ...filter,
              month: e.target.value ? Number(e.target.value) : undefined,
            })
          }
        />
        <Input
          label="Tahun"
          type="number"
          value={filter.year ?? ""}
          onChange={(e) =>
            onFilterChange({
              ...filter,
              year: e.target.value ? Number(e.target.value) : undefined,
            })
          }
        />
        <Select
          label="Status"
          placeholder="Semua status"
          options={STATUS_OPTIONS}
          value={filter.status ?? ""}
          onChange={(e) =>
            onFilterChange({
              ...filter,
              status: (e.target.value || undefined) as ReservasiStatus | undefined,
            })
          }
        />
        <Select
          label="Ruangan"
          placeholder="Semua ruangan"
          options={spaces.map((s) => ({ label: s.nama_space, value: String(s.id) }))}
          value={filter.id_space ? String(filter.id_space) : ""}
          onChange={(e) =>
            onFilterChange({
              ...filter,
              id_space: e.target.value ? Number(e.target.value) : undefined,
            })
          }
        />
        <Input
          label="Tanggal Spesifik"
          type="date"
          value={filter.tanggal ?? ""}
          onChange={(e) =>
            onFilterChange({ ...filter, tanggal: e.target.value || undefined })
          }
        />
      </div>
    </Card>
  );
}
