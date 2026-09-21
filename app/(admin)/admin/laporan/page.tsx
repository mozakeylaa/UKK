"use client";

import { useEffect, useState } from "react";
import { getMonthlyReport } from "@/lib/api/admin-reports";
import { isApiSuccess } from "@/lib/types/api";
import type { MonthlyReport } from "@/lib/types/admin";
import EmptyState from "@/components/ui/EmptyState";
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
    } catch (err) {
      setError("Gagal memuat laporan pendapatan");
    } finally {
      setLoading(false);
    }
  }

  const rincian = report?.rincian_per_tipe_space ?? [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-ink-950">Rekapitulasi Pendapatan</h1>
      </div>

      <LaporanFilterCard
        month={month}
        year={year}
        onMonthChange={setMonth}
        onYearChange={setYear}
      />

      {error && (
        <div className="rounded-md bg-status-cancelled/10 p-3 text-sm text-status-cancelled">
          {error}
        </div>
      )}

      {loading ? (
        <Spinner label="Memuat laporan..." />
      ) : !report ? (
        <EmptyState title="Data tidak tersedia" description="Coba pilih periode lain" />
      ) : (
        <>
          <LaporanStatCards report={report} />
          <LaporanChartCard rincian={rincian} />
          <LaporanTableCard rincian={rincian} />
        </>
      )}
    </div>
  );
}