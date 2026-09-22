import type { AdminReservasiFilter } from "@/lib/types/reservasi";
import type { AdminSpace } from "@/lib/types/admin";
import type { ReservasiStatus } from "@/components/ui/Badge";
import { RotateCcw, Filter, Search } from "lucide-react";
import Select from "@/components/ui/Select";

const STATUS_OPTIONS: { label: string; value: string }[] = [
  { label: "Semua Status", value: "" },
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
  searchQuery?: string;
  onFilterChange: (newFilter: AdminReservasiFilter) => void;
  onSearchQueryChange?: (search: string) => void;
}

export default function ReservasiFilterCard({
  filter,
  spaces,
  searchQuery = "",
  onFilterChange,
  onSearchQueryChange,
}: ReservasiFilterCardProps) {
  const isFiltered =
    Boolean(searchQuery) ||
    filter.month !== undefined ||
    filter.year !== undefined ||
    filter.status !== undefined ||
    filter.id_space !== undefined ||
    filter.tanggal !== undefined;

  function handleReset() {
    if (onSearchQueryChange) onSearchQueryChange("");
    onFilterChange({
      month: undefined,
      year: undefined,
      status: undefined,
      id_space: undefined,
      tanggal: undefined,
    });
  }

  const spaceOptions = [
    { label: "Semua Ruangan", value: "" },
    ...spaces.map((s) => ({ label: s.nama_space, value: String(s.id) })),
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* Header bar filter */}
      <div className="flex items-center justify-between pb-1 border-b border-slate-100">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
          <Filter size={14} className="text-[#6367FF]" />
          <span>Filter & Pencarian Reservasi</span>
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

      {/* Search Input Bar (Cari Member / Kode Booking) */}
      {onSearchQueryChange && (
        <div className="relative rounded-2xl bg-slate-50 border border-slate-200/80 p-1 focus-within:bg-white focus-within:border-[#6367FF] focus-within:ring-2 focus-within:ring-[#6367FF]/20 transition-all">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
            <Search size={15} />
          </div>
          <input
            type="text"
            placeholder="Cari berdasarkan nama member, telepon, instansi, atau kode booking..."
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            className="w-full rounded-xl bg-transparent py-2 pl-9 pr-4 text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
          />
        </div>
      )}

      {/* Grid Filter Options */}
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
          options={spaceOptions}
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