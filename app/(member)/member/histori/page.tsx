"use client";

import { useEffect, useState } from "react";
import { History, Calendar, AlertTriangle } from "lucide-react";
import { getMyHistory } from "@/lib/api/reservasi";
import { isApiSuccess } from "@/lib/types/api";
import type { HistoryResponse } from "@/lib/types/reservasi";
import Spinner from "@/components/ui/Spinner";
import HistoriPeriodFilter from "@/components/member/histori/HistoriPeriodFilter";
import HistoriSummaryCards from "@/components/member/histori/HistoriSummaryCards";
import HistoriItemList from "@/components/member/histori/HistoriItemList";

const now = new Date();

export default function HistoriPage() {
  const [month, setMonth] = useState(String(now.getMonth() + 1));
  const [year, setYear] = useState(String(now.getFullYear()));
  const [data, setData] = useState<HistoryResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    getMyHistory({ month: Number(month), year: Number(year) }).then((res) => {
      if (isApiSuccess(res)) {
        setData({
          total_reservasi: res.data.total_reservasi ?? 0,
          total_pengeluaran: res.data.total_pengeluaran ?? 0,
          items: res.data.items ?? [],
        });
      } else {
        setError(res.message);
      }
      setIsLoading(false);
    });
  }, [month, year]);

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            Histori Pemesanan
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Lihat rekapitulasi dan catatan riwayat penggunaan ruang kerjamu berdasarkan periode bulan dan tahun.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 self-start rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-600 border border-slate-200/80 shadow-sm">
          <History size={14} className="text-[#6367FF]" />
          Arsip Reservasi
        </div>
      </div>

      {/* Filter Periode Container */}
      <div className="rounded-2xl bg-white p-4 sm:p-5 border border-slate-100 shadow-sm">
        <HistoriPeriodFilter
          month={month}
          year={year}
          onChangeMonth={setMonth}
          onChangeYear={setYear}
        />
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20">
          <Spinner label="Memuat histori reservasi..." />
        </div>
      )}

      {/* Error State */}
      {!isLoading && error && (
        <div className="flex flex-col items-center justify-center rounded-3xl bg-white p-12 text-center border border-rose-100 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
            <AlertTriangle size={24} />
          </div>
          <h3 className="mt-4 font-display text-base font-bold text-slate-900">Gagal Memuat Histori</h3>
          <p className="mt-1 text-xs text-slate-500 max-w-sm">{error}</p>
        </div>
      )}

      {/* Content View: Summary Cards & Item List */}
      {!isLoading && !error && data && (
        <div className="flex flex-col gap-6">
          <HistoriSummaryCards
            totalReservasi={data.total_reservasi}
            totalPengeluaran={data.total_pengeluaran}
          />

          <HistoriItemList items={data.items} />
        </div>
      )}
    </div>
  );
}