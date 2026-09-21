import type { AdminReservasiFilter } from "@/lib/types/reservasi";
import type { AdminSpace } from "@/lib/types/admin";
import type { ReservasiStatus } from "@/components/ui/Badge";
import { RotateCcw, Filter } from "lucide-react";
import Select from "@/components/ui/Select";

const STATUS_OPTIONS: { label: string; value: ReservasiStatus }[] = [
  { label: "Belum Dikonfirmasi", value: "belum_dikonfirm" },
  { label: "Disetujui", value: "disetujui" },
  { label: "Aktif", value: "aktif" },
  { label: "Selesai", value: "selesai" },
  { label: "Dibatalkan", value: "dibatalkan" },
];

const MONTH_OPTIONS = [
  { label: "Semua Bulan", value: "" },
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
  const isFiltered =
    filter.month !== undefined ||
    filter.year !== undefined ||
    filter.status !== undefined ||
    filter.id_space !== undefined ||
    filter.tanggal !== undefined;

  function handleReset() {
    onFilterChange({
      month: undefined,
      year: undefined,
      status: undefined,
      id_space: undefined,
      tanggal: undefined,
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between pb-1 border-b border-slate-100">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
          <Filter size={14} className="text-[#6367FF]" />
          <span>Filter Reservasi</span>
        </div>
        {isFiltered && (
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#FF5DA2] hover:underline"
          >
            <RotateCcw size={12} />
            Reset Filter
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Filter Bulan */}
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

        {/* Filter Tahun */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-600">Tahun</label>
          <input
            type="number"
            placeholder="Semua Tahun"
            value={filter.year ?? ""}
            onChange={(e) =>
              onFilterChange({
                ...filter,
                year: e.target.value ? Number(e.target.value) : undefined,
              })
            }
            className="w-full rounded-2xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-[#6367FF] focus:outline-none focus:ring-2 focus:ring-[#6367FF]/20"
          />
        </div>

        {/* Filter Status */}
        <Select
          label="Status"
          placeholder="Semua Status"
          options={STATUS_OPTIONS}
          value={filter.status ?? ""}
          onChange={(e) =>
            onFilterChange({
              ...filter,
              status: (e.target.value || undefined) as ReservasiStatus | undefined,
            })
          }
        />

        {/* Filter Ruangan */}
        <Select
          label="Ruangan"
          placeholder="Semua Ruangan"
          options={spaces.map((s) => ({ label: s.nama_space, value: String(s.id) }))}
          value={filter.id_space ? String(filter.id_space) : ""}
          onChange={(e) =>
            onFilterChange({
              ...filter,
              id_space: e.target.value ? Number(e.target.value) : undefined,
            })
          }
        />

        {/* Filter Tanggal */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-600">Tanggal Spesifik</label>
          <input
            type="date"
            value={filter.tanggal ?? ""}
            onChange={(e) =>
              onFilterChange({ ...filter, tanggal: e.target.value || undefined })
            }
            className="w-full rounded-2xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-800 focus:border-[#6367FF] focus:outline-none focus:ring-2 focus:ring-[#6367FF]/20"
          />
        </div>
      </div>
    </div>
  );
}