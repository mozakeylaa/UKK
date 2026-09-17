"use client";

import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getMonthlyReport } from "@/lib/api/admin-reports";
import { isApiSuccess } from "@/lib/types/api";
import type { MonthlyReport } from "@/lib/types/admin";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";
import Select from "@/components/ui/Select";
import Spinner from "@/components/ui/Spinner";
import Table from "@/components/ui/Table";

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

function formatRupiah(value: number | null | undefined): string {
  return `Rp ${(value ?? 0).toLocaleString("id-ID")}`;
}

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

      <Card>
        <div className="grid grid-cols-2 gap-3 md:w-1/2">
          <Select
            label="Bulan"
            options={MONTH_OPTIONS}
            value={String(month)}
            onChange={(e) => setMonth(Number(e.target.value))}
          />
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="mt-6 h-10 rounded-md border border-surface-200 bg-white px-3 text-sm text-ink-950 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>
      </Card>

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
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            <Card>
              <p className="text-sm text-ink-600">Total Transaksi</p>
              <p className="mt-1 text-2xl font-semibold text-ink-950">
                {report.total_transaksi ?? 0}
              </p>
            </Card>
            <Card>
              <p className="text-sm text-ink-600">Total Jam Terpakai</p>
              <p className="mt-1 text-2xl font-semibold text-ink-950">
                {report.total_jam_terpakai ?? 0} jam
              </p>
            </Card>
            <Card>
              <p className="text-sm text-ink-600">Pendapatan Kotor</p>
              <p className="mt-1 text-2xl font-semibold text-ink-950">
                {formatRupiah(report.estimasi_pendapatan_kotor)}
              </p>
            </Card>
            <Card>
              <p className="text-sm text-ink-600">Total Potongan Diskon</p>
              <p className="mt-1 text-2xl font-semibold text-status-cancelled">
                -{formatRupiah(report.total_potongan_diskon)}
              </p>
            </Card>
            <Card className="col-span-2 md:col-span-1">
              <p className="text-sm text-ink-600">Pendapatan Bersih</p>
              <p className="mt-1 text-2xl font-semibold text-status-active">
                {formatRupiah(report.realisasi_pendapatan_bersih)}
              </p>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Pendapatan per Tipe Ruangan</CardTitle>
            </CardHeader>
            {rincian.length === 0 ? (
              <EmptyState
                title="Belum ada data"
                description="Belum ada transaksi pada periode ini"
              />
            ) : (
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={rincian}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip
                      formatter={(value: any) =>
                        typeof value === "number" ? formatRupiah(value) : ""
                      }
                    />
                    <Legend />
                    <Bar
                      dataKey="total_pendapatan"
                      name="Total Pendapatan"
                      fill="#6366f1"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Rincian per Tipe Ruangan</CardTitle>
            </CardHeader>
            {rincian.length === 0 ? (
              <EmptyState
                title="Belum ada data"
                description="Belum ada transaksi pada periode ini"
              />
            ) : (
              <Table
                columns={[
                  { header: "Tipe", accessor: (row) => row.label },
                  { header: "Total Booking", accessor: (row) => row.total_booking },
                  { header: "Total Jam", accessor: (row) => `${row.total_jam} jam` },
                  {
                    header: "Total Pendapatan",
                    accessor: (row) => formatRupiah(row.total_pendapatan),
                  },
                ]}
                data={rincian}
                keyExtractor={(row) => row.tipe}
              />
            )}
          </Card>
        </>
      )}
    </div>
  );
}