"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { 
  BarChart3, 
  AlertTriangle, 
  FileSpreadsheet, 
  RotateCw, 
  ShieldAlert, 
  LogOut 
} from "lucide-react";
import Cookies from "js-cookie";
import { getMonthlyReport } from "@/lib/api/admin-reports";
import { isApiSuccess } from "@/lib/types/api";
import type { MonthlyReport } from "@/lib/types/admin";
import { AUTH_TOKEN_KEY, AUTH_ROLE_KEY, AUTH_USER_KEY } from "@/lib/api/client";
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
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSessionConflict, setIsSessionConflict] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchReport = useCallback(
    async (isBackground = false) => {
      try {
        if (!isBackground) {
          setLoading(true);
        } else {
          setRefreshing(true);
        }
        setError(null);
        setIsSessionConflict(false);

        const res = await getMonthlyReport({ month, year });
        if (isApiSuccess(res) && res.data) {
          setReport(res.data);
          setLastUpdated(new Date());
        } else {
          const errMsg = res.message || "Gagal memuat laporan pendapatan dari server.";
          if (
            errMsg.toLowerCase().includes("akses ditolak") ||
            errMsg.toLowerCase().includes("peran") ||
            errMsg.toLowerCase().includes("403")
          ) {
            setIsSessionConflict(true);
          }
          setError(errMsg);
        }
      } catch (err: any) {
        const errMsg = err?.response?.data?.message || err?.message || "Gagal memuat laporan pendapatan dari server.";
        if (
          err?.response?.status === 403 ||
          errMsg.toLowerCase().includes("akses ditolak") ||
          errMsg.toLowerCase().includes("peran")
        ) {
          setIsSessionConflict(true);
        }
        setError(errMsg);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [month, year]
  );

  // Initial fetch and on month/year change
  useEffect(() => {
    fetchReport(false);
  }, [fetchReport]);

  // Auto-polling every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchReport(true);
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchReport]);

  // Sync on tab visibility and focus
  useEffect(() => {
    const handleSync = () => {
      if (document.visibilityState === "visible") {
        fetchReport(true);
      }
    };

    window.addEventListener("focus", handleSync);
    document.addEventListener("visibilitychange", handleSync);

    return () => {
      window.removeEventListener("focus", handleSync);
      document.removeEventListener("visibilitychange", handleSync);
    };
  }, [fetchReport]);

  function handleReLogin() {
    Cookies.remove(AUTH_TOKEN_KEY);
    Cookies.remove(AUTH_ROLE_KEY);
    Cookies.remove(AUTH_USER_KEY);
    window.location.href = "/login";
  }

  const rincian = report?.rincian_per_tipe_space ?? [];

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Session Conflict Warning (403) */}
      {isSessionConflict && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl bg-amber-50 border border-amber-200 p-4 text-xs text-amber-800">
          <div className="flex items-center gap-2.5">
            <ShieldAlert size={18} className="text-amber-600 shrink-0" />
            <div>
              <p className="font-bold">Sesi Login Tertimpa Akun Lain</p>
              <p className="text-amber-700 mt-0.5">
                Browser Anda saat ini menggunakan token sesi non-admin. Silakan login kembali sebagai Admin untuk mengakses laporan.
              </p>
            </div>
          </div>
          <button
            onClick={handleReLogin}
            className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-xl bg-amber-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-amber-700 transition-colors shadow-sm"
          >
            <LogOut size={14} /> Login Ulang Admin
          </button>
        </div>
      )}

      {/* Header Info & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Rekapitulasi Pendapatan
            </h1>
            <button
              onClick={() => fetchReport(true)}
              disabled={loading || refreshing}
              title="Segarkan data sekarang"
              className="flex h-8 w-8 items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-[#6367FF] hover:border-[#6367FF]/30 transition-all shadow-sm disabled:opacity-50"
            >
              <RotateCw size={14} className={refreshing ? "animate-spin text-[#6367FF]" : ""} />
            </button>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Ringkasan omzet, okupansi, dan performa reservasi tiap tipe space secara otomatis.
            {lastUpdated && (
              <span className="ml-2 text-[11px] text-slate-400">
                • Terakhir sinkron: {lastUpdated.toLocaleTimeString("id-ID")}
              </span>
            )}
          </p>
        </div>

        <div className="inline-flex items-center gap-2 self-start rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-600 border border-slate-200/80 shadow-sm">
          <BarChart3 size={14} className="text-[#6367FF]" />
          Laporan Real-Time
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
      {error && !isSessionConflict && (
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