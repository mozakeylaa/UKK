import type { MonthlyReport } from "@/lib/types/admin";
import { formatRupiah } from "@/lib/utils/format";
import { 
  Coins, 
  CalendarCheck, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  Layers
} from "lucide-react";

interface LaporanStatCardsProps {
  report: MonthlyReport;
}

export default function LaporanStatCards({ report }: LaporanStatCardsProps) {
  const totalTransaksi = report.ringkasan?.total_reservasi ?? report.total_transaksi ?? 0;
  const realisasiPendapatan = report.ringkasan?.realisasi_pendapatan ?? report.realisasi_pendapatan_bersih ?? 0;
  const estimasiPendapatan = report.ringkasan?.estimasi_pendapatan_total ?? report.estimasi_pendapatan_kotor ?? 0;
  const status = report.ringkasan?.status_reservasi;

  return (
    <div className="flex flex-col gap-4">
      {/* Top 3 Primary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Card 1: Realisasi Pendapatan Bersih */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#12132E] to-[#1E2048] p-6 text-white shadow-xl shadow-slate-900/10 flex flex-col justify-between">
          <div className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full bg-[#6367FF]/30 blur-xl" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Realisasi Pendapatan
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Coins size={20} />
            </div>
          </div>
          <div className="mt-4">
            <p className="font-display text-3xl font-bold tracking-tight text-white">
              {formatRupiah(realisasiPendapatan)}
            </p>
            <p className="mt-1 text-xs text-slate-400 flex items-center gap-1">
              <TrendingUp size={13} className="text-emerald-400" />
              Dari transaksi reservasi yang telah selesai
            </p>
          </div>
        </div>

        {/* Card 2: Estimasi Pendapatan Total */}
        <div className="rounded-3xl bg-white p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Estimasi Pendapatan
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#EEEFFF] text-[#6367FF]">
              <TrendingUp size={20} />
            </div>
          </div>
          <div className="mt-4">
            <p className="font-display text-3xl font-bold tracking-tight text-slate-900">
              {formatRupiah(estimasiPendapatan)}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Termasuk reservasi aktif & disetujui
            </p>
          </div>
        </div>

        {/* Card 3: Total Reservasi */}
        <div className="rounded-3xl bg-white p-6 border border-slate-100 shadow-sm flex flex-col justify-between sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total Reservasi
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#FFDBFD] text-[#FF5DA2]">
              <CalendarCheck size={20} />
            </div>
          </div>
          <div className="mt-4">
            <p className="font-display text-3xl font-bold tracking-tight text-slate-900">
              {totalTransaksi}{" "}
              <span className="text-sm font-medium text-slate-500">Booking</span>
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Pada periode bulan yang dipilih
            </p>
          </div>
        </div>
      </div>

      {/* Status Breakdown Bar */}
      {status && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-2xl bg-white p-4 border border-slate-100 shadow-sm flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 size={18} />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-400">Selesai</p>
              <p className="text-base font-bold text-slate-800">{status.selesai ?? 0}</p>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-4 border border-slate-100 shadow-sm flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Clock size={18} />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-400">Aktif / Berjalan</p>
              <p className="text-base font-bold text-slate-800">{status.aktif ?? 0}</p>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-4 border border-slate-100 shadow-sm flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-[#6367FF]">
              <Layers size={18} />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-400">Disetujui</p>
              <p className="text-base font-bold text-slate-800">{status.disetujui ?? 0}</p>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-4 border border-slate-100 shadow-sm flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Clock size={18} />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-400">Menunggu Konfirmasi</p>
              <p className="text-base font-bold text-slate-800">{status.belum_dikonfirm ?? 0}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

