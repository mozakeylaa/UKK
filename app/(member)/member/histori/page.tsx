"use client";

import { useEffect, useState } from "react";
import { getMyHistory } from "@/lib/api/reservasi";
import { isApiSuccess } from "@/lib/types/api";
import type { HistoryResponse } from "@/lib/types/reservasi";
import Spinner from "@/components/ui/Spinner";
import EmptyState from "@/components/ui/EmptyState";
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
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-medium text-ink-950">Histori Pemesanan</h1>
        <p className="mt-1 text-sm text-ink-600">
          Lihat riwayat reservasi berdasarkan periode.
        </p>
      </div>

      <HistoriPeriodFilter
        month={month}
        year={year}
        onChangeMonth={setMonth}
        onChangeYear={setYear}
      />

      {isLoading && <Spinner label="Memuat histori..." />}

      {!isLoading && error && (
        <EmptyState title="Gagal memuat data" description={error} />
      )}

      {!isLoading && !error && data && (
        <>
          <HistoriSummaryCards
            totalReservasi={data.total_reservasi}
            totalPengeluaran={data.total_pengeluaran}
          />

          <HistoriItemList items={data.items} />
        </>
      )}
    </div>
  );
}