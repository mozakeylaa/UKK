"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarCheck, Plus, AlertTriangle, Inbox } from "lucide-react";
import { getMyReservasi, cancelReservasi } from "@/lib/api/reservasi";
import { isApiSuccess } from "@/lib/types/api";
import type { Reservasi } from "@/lib/types/reservasi";
import type { ReservasiStatus } from "@/components/ui/Badge";
import Spinner from "@/components/ui/Spinner";
import ReservationTabs from "@/components/member/reservasi/ReservationTabs";
import ReservationItemCard from "@/components/member/reservasi/ReservationItemCard";
import CancelReservationModal from "@/components/member/reservasi/CancelReservationModal";

export default function StatusPemesananPage() {
  const [reservasiList, setReservasiList] = useState<Reservasi[]>([]);
  const [activeFilter, setActiveFilter] = useState<ReservasiStatus | "semua">("semua");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [cancelTarget, setCancelTarget] = useState<Reservasi | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);

  function loadData() {
    setIsLoading(true);
    setError(null);
    getMyReservasi().then((res) => {
      if (isApiSuccess(res)) {
        setReservasiList(res.data);
      } else {
        setError(res.message);
      }
      setIsLoading(false);
    });
  }

  useEffect(() => {
    loadData();
  }, []);

  const filtered =
    activeFilter === "semua"
      ? reservasiList
      : reservasiList.filter((r) => r.status === activeFilter);

  async function handleConfirmCancel() {
    if (!cancelTarget) return;
    setIsCancelling(true);
    setCancelError(null);
    try {
      const res = await cancelReservasi(cancelTarget.id);
      if (isApiSuccess(res)) {
        setCancelTarget(null);
        loadData();
      } else {
        setCancelError(res.message);
      }
    } catch {
      setCancelError("Terjadi kesalahan sistem saat membatalkan. Silakan coba lagi.");
    } finally {
      setIsCancelling(false);
    }
  }

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Header Banner Ringkas */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Status Pemesanan
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Pantau status reservasi aktif, jadwal mendatang, dan e-tiket kamu di sini.
          </p>
        </div>

        <Link
          href="/member/spaces"
          className="inline-flex items-center gap-2 self-start rounded-full bg-gradient-to-r from-[#FF5DA2] to-[#FF8FC2] px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-[#FF5DA2]/25 hover:opacity-95 transition-opacity"
        >
          <Plus size={15} />
          Reservasi Baru
        </Link>
      </div>

      {/* Filter Tabs Container */}
      <div className="rounded-2xl bg-white p-3 sm:p-4 border border-slate-100 shadow-sm">
        <ReservationTabs activeTab={activeFilter} onTabChange={setActiveFilter} />
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20">
          <Spinner label="Memuat riwayat reservasi..." />
        </div>
      )}

      {/* Error State */}
      {!isLoading && error && (
        <div className="flex flex-col items-center justify-center rounded-3xl bg-white p-12 text-center border border-rose-100 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
            <AlertTriangle size={24} />
          </div>
          <h3 className="mt-4 font-display text-base font-bold text-slate-900">Gagal Memuat Data</h3>
          <p className="mt-1 text-xs text-slate-500 max-w-sm">{error}</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-3xl bg-white p-12 text-center border border-slate-100 shadow-sm">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-[#EEEFFF] text-[#6367FF]">
            <Inbox size={28} />
          </div>
          <h3 className="mt-4 font-display text-base font-bold text-slate-900">Belum Ada Reservasi</h3>
          <p className="mt-1 text-xs text-slate-500 max-w-sm">
            {activeFilter === "semua"
              ? "Kamu belum memiliki pesanan reservasi. Temukan ruang kerja yang kamu butuhkan sekarang!"
              : `Tidak ada reservasi dengan status "${activeFilter}".`}
          </p>
          <Link
            href="/member/spaces"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#6367FF] px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-[#6367FF]/25 hover:bg-[#4A4FE0] transition-colors"
          >
            <CalendarCheck size={15} /> Cari Space Sekarang
          </Link>
        </div>
      )}

      {/* List Reservasi Cards */}
      {!isLoading && !error && filtered.length > 0 && (
        <div className="flex flex-col gap-4">
          {filtered.map((r) => (
            <ReservationItemCard
              key={r.id}
              reservasi={r}
              onCancel={setCancelTarget}
            />
          ))}
        </div>
      )}

      {/* Modal Batal Reservasi */}
      <CancelReservationModal
        cancelTarget={cancelTarget}
        isCancelling={isCancelling}
        cancelError={cancelError}
        onClose={() => setCancelTarget(null)}
        onConfirm={handleConfirmCancel}
      />
    </div>
  );
}