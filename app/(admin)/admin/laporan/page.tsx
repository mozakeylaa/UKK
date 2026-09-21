"use client";

import { useEffect, useState } from "react";
import { BarChart3, AlertTriangle, FileSpreadsheet } from "lucide-react";
import { getMonthlyReport } from "@/lib/api/admin-reports";
import { isApiSuccess } from "@/lib/types/api";
import type { MonthlyReport } from "@/lib/types/admin";
import Spinner from "@/components/ui/Spinner";
import LaporanFilterCard from "@/components/admin/laporan/LaporanFilterCard";
import LaporanStatCards from "@/components/admin/laporan/LaporanStatCards";
import LaporanChartCard from "@/components/admin/laporan/LaporanChartCard";
import LaporanTableCard from "@/components/admin/laporan/LaporanTableCard";

export default function AdminLaporanPage() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [report, setReport] = useState<MonthlyReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchReport();
  }, [month, year]);

  async function fetchReport() {
    try {
      setLoading(true);
      setError(null);
      const res = await getMonthlyReport({ month, year });
      if (isApiSuccess(res)) {
        setReport(res.data);
      } else {
        setError(res.message);
      }
    } catch {
      setError("Gagal memuat laporan pendapatan dari server.");
    } finally {
      setLoading(false);
    }
  }

  const rincian = report?.rincian_per_tipe_space ?? [];

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            Rekapitulasi Pendapatan
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Ringkasan omzet, okupansi per jam, dan performa reservasi tiap tipe space.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 self-start rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-600 border border-slate-200/80 shadow-sm">
          <BarChart3 size={14} className="text-[#6367FF]" />
          Laporan Bulanan
        </div>
      </div>

      {/* Filter Periode Container */}
      <div className="rounded-3xl bg-white p-5 sm:p-6 border border-slate-100 shadow-sm">
        <LaporanFilterCard
          month={month}
          year={year}
          onMonthChange={setMonth}
          onYearChange={setYear}
        />
      </div>

      {/* Error State */}
      {error && (
        <div className="flex items-center gap-3 rounded-2xl bg-rose-50 border border-rose-200 p-4 text-xs font-medium text-rose-600">
          <AlertTriangle size={18} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main View Area */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Spinner label="Memuat rekapitulasi data..." />
        </div>
      ) : !report ? (
        <div className="flex flex-col items-center justify-center rounded-3xl bg-white p-12 text-center border border-slate-100 shadow-sm">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EEEFFF] text-[#6367FF]">
            <FileSpreadsheet size={26} />
          </div>
          <h3 className="mt-4 font-display text-base font-bold text-slate-900">Data Tidak Tersedia</h3>
          <p className="mt-1 text-xs text-slate-500 max-w-sm">
            Tidak ada transaksi atau data okupansi pada periode yang dipilih. Silakan ubah bulan atau tahun.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <LaporanStatCards report={report} />
          <div className="rounded-3xl bg-white p-5 sm:p-6 border border-slate-100 shadow-sm">
            <LaporanChartCard rincian={rincian} />
          </div>
          <div className="rounded-3xl bg-white p-5 sm:p-6 border border-slate-100 shadow-sm overflow-hidden">
            <LaporanTableCard rincian={rincian} />
          </div>
        </div>
      )}
    </div>
  );
}