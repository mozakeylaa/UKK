"use client";

import { useEffect, useState } from "react";
import { CalendarCheck, AlertTriangle, Inbox } from "lucide-react";
import { getAdminReservasiList } from "@/lib/api/admin-reservasi";
import { getAdminSpaces } from "@/lib/api/admin-spaces";
import { isApiSuccess } from "@/lib/types/api";
import type { Reservasi, AdminReservasiFilter } from "@/lib/types/reservasi";
import type { AdminSpace } from "@/lib/types/admin";
import Spinner from "@/components/ui/Spinner";
import ReservasiFilterCard from "@/components/admin/reservasi/ReservasiFilterCard";
import ReservasiTableCard from "@/components/admin/reservasi/ReservasiTableCard";

export default function AdminReservasiPage() {
  const [reservasiList, setReservasiList] = useState<Reservasi[]>([]);
  const [spaces, setSpaces] = useState<AdminSpace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Set default filter ke undefined agar semua data langsung diambil tanpa terpotong bulan/tahun
  const [filter, setFilter] = useState<AdminReservasiFilter>({
    month: undefined,
    year: undefined,
    status: undefined,
    id_space: undefined,
    tanggal: undefined,
  });

  useEffect(() => {
    getAdminSpaces().then((res) => {
      if (isApiSuccess(res)) setSpaces(res.data);
    });
  }, []);

  useEffect(() => {
    fetchReservasi();
  }, [filter]);

  async function fetchReservasi() {
    try {
      setLoading(true);
      setError(null);
      const res = await getAdminReservasiList(filter);
      if (isApiSuccess(res)) {
        setReservasiList(res.data);
      } else {
        setError(res.message);
      }
    } catch {
      setError("Gagal memuat daftar reservasi dari server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            Kelola Reservasi
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Daftar seluruh pemesanan masuk, konfirmasi jadwal, dan status sewa ruangan.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 self-start rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-600 border border-slate-200/80 shadow-sm">
          <CalendarCheck size={14} className="text-[#6367FF]" />
          <span>Total: {reservasiList.length} Reservasi</span>
        </div>
      </div>

      {/* Filter Card */}
      <div className="rounded-3xl bg-white p-5 sm:p-6 border border-slate-100 shadow-sm">
        <ReservasiFilterCard
          filter={filter}
          spaces={spaces}
          onFilterChange={setFilter}
        />
      </div>

      {/* Error State */}
      {error && (
        <div className="flex items-center gap-3 rounded-2xl bg-rose-50 border border-rose-200 p-4 text-xs font-medium text-rose-600">
          <AlertTriangle size={18} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Loading & Content View */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Spinner label="Memuat data reservasi..." />
        </div>
      ) : reservasiList.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl bg-white p-12 text-center border border-slate-100 shadow-sm">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EEEFFF] text-[#6367FF]">
            <Inbox size={26} />
          </div>
          <h3 className="mt-4 font-display text-base font-bold text-slate-900">Tidak Ada Reservasi</h3>
          <p className="mt-1 text-xs text-slate-500 max-w-sm">
            Belum ada data reservasi yang sesuai dengan kriteria filter yang kamu tentukan.
          </p>
        </div>
      ) : (
        <div className="rounded-3xl bg-white p-5 sm:p-6 border border-slate-100 shadow-sm overflow-hidden">
          <ReservasiTableCard reservasiList={reservasiList} />
        </div>
      )}
    </div>
  );
}