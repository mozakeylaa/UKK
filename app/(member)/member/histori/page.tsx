"use client";

import { useEffect, useState } from "react";
import { getMyHistory } from "@/lib/api/reservasi";
import { isApiSuccess } from "@/lib/types/api";
import type { HistoryResponse } from "@/lib/types/reservasi";
import { formatRupiah, formatDate } from "@/lib/utils/format";
import { Card } from "@/components/ui/Card";
import Select from "@/components/ui/Select";
import Badge from "@/components/ui/Badge";
import Spinner from "@/components/ui/Spinner";
import EmptyState from "@/components/ui/EmptyState";

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

      <div className="grid grid-cols-2 gap-4 sm:w-96">
        <Select label="Bulan" options={MONTH_OPTIONS} value={month} onChange={(e) => setMonth(e.target.value)} />
        <Select label="Tahun" options={YEAR_OPTIONS} value={year} onChange={(e) => setYear(e.target.value)} />
      </div>

      {isLoading && <Spinner label="Memuat histori..." />}

      {!isLoading && error && (
        <EmptyState title="Gagal memuat data" description={error} />
      )}

      {!isLoading && !error && data && (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Card>
              <p className="text-sm text-ink-600">Total reservasi</p>
              <p className="mt-2 font-display text-2xl font-medium text-ink-950">
                {data.total_reservasi}
              </p>
            </Card>
            <Card>
              <p className="text-sm text-ink-600">Total pengeluaran</p>
              <p className="mt-2 font-display text-2xl font-medium text-brand-700">
                {formatRupiah(data.total_pengeluaran)}
              </p>
            </Card>
          </div>

          {data.items.length === 0 ? (
            <EmptyState
              title="Tidak ada riwayat"
              description="Belum ada reservasi pada periode ini."
            />
          ) : (
            <div className="flex flex-col gap-3">
              {data.items.map((r) => (
                <Card key={r.id} className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-ink-950">
                      {r.space?.nama_space ?? `Space #${r.id_space}`}
                    </p>
                    <p className="text-xs text-ink-600">
                      {formatDate(r.tanggal_reservasi)} · {r.jam_mulai}–{r.jam_selesai}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-ink-950">
                      {formatRupiah(r.total_bayar)}
                    </span>
                    <Badge status={r.status} />
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}