"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Ticket, AlertTriangle } from "lucide-react";
import { getReservasiById } from "@/lib/api/reservasi";
import {
  updateReservasiStatus,
  checkInReservasi,
  checkOutReservasi,
} from "@/lib/api/admin-reservasi";
import { isApiSuccess } from "@/lib/types/api";
import type { Reservasi } from "@/lib/types/reservasi";
import type { ReservasiStatus } from "@/components/ui/Badge";
import Badge from "@/components/ui/Badge";
import Spinner from "@/components/ui/Spinner";
import MemberInfoCard from "@/components/admin/reservasi/MemberInfoCard";
import ScheduleInfoCard from "@/components/admin/reservasi/ScheduleInfoCard";
import PaymentInfoCard from "@/components/admin/reservasi/PaymentInfoCard";
import ReservationActionsCard from "@/components/admin/reservasi/ReservationActionsCard";

export default function AdminReservasiDetailPage() {
  const params = useParams();
  const router = useRouter();
  const reservasiId = Number(params.id);

  const [reservasi, setReservasi] = useState<Reservasi | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [checkActionLoading, setCheckActionLoading] = useState(false);

  useEffect(() => {
    fetchDetail();
  }, [reservasiId]);

  async function fetchDetail() {
    try {
      setLoading(true);
      setError(null);
      const res = await getReservasiById(reservasiId);
      if (isApiSuccess(res)) {
        setReservasi(res.data);
      } else {
        setError(res.message);
      }
    } catch {
      setError("Gagal memuat detail reservasi");
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(newStatus: ReservasiStatus) {
    setStatusUpdating(true);
    setError(null);
    try {
      const res = await updateReservasiStatus(reservasiId, newStatus);
      if (isApiSuccess(res)) {
        setReservasi(res.data);
      } else {
        setError(res.message);
      }
    } catch {
      setError("Gagal mengubah status");
    } finally {
      setStatusUpdating(false);
    }
  }

  async function handleCheckIn() {
    setCheckActionLoading(true);
    setError(null);
    try {
      const res = await checkInReservasi(reservasiId);
      if (isApiSuccess(res)) {
        setReservasi(res.data);
      } else {
        setError(res.message);
      }
    } catch {
      setError("Gagal melakukan check-in");
    } finally {
      setCheckActionLoading(false);
    }
  }

  async function handleCheckOut() {
    setCheckActionLoading(true);
    setError(null);
    try {
      const res = await checkOutReservasi(reservasiId);
      if (isApiSuccess(res)) {
        setReservasi(res.data);
      } else {
        setError(res.message);
      }
    } catch {
      setError("Gagal melakukan check-out");
    } finally {
      setCheckActionLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <Spinner label="Memuat detail reservasi..." />
      </div>
    );
  }

  if (!reservasi) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center justify-center rounded-3xl bg-white p-12 text-center border border-rose-100 shadow-sm">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
          <AlertTriangle size={28} />
        </div>
        <h2 className="mt-4 font-display text-lg font-bold text-slate-900">Reservasi Tidak Ditemukan</h2>
        <p className="mt-1 text-xs sm:text-sm text-slate-500">
          Data tidak tersedia atau nomor reservasi tidak valid.
        </p>
        <Link
          href="/admin/reservasi"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#12132E] px-5 py-2.5 text-xs font-semibold text-white hover:bg-slate-800 transition-colors"
        >
          <ChevronLeft size={16} /> Kembali ke Daftar
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl flex flex-col gap-6 pb-12">
      {/* Back Button */}
      <div>
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-semibold text-slate-600 border border-slate-200/80 shadow-sm hover:bg-slate-50 hover:text-[#6367FF] transition-all"
        >
          <ChevronLeft size={16} />
          Kembali ke Daftar Reservasi
        </button>
      </div>

      {/* Header Banner Detail */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl bg-white p-6 sm:p-7 border border-slate-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#EEEFFF] text-[#6367FF]">
            <Ticket size={24} />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              ID #{reservasi.id} &bull; Kode Booking
            </span>
            <h1 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              {reservasi.kode_booking}
            </h1>
          </div>
        </div>

        <div>
          <Badge status={reservasi.status} />
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="flex items-center gap-3 rounded-2xl bg-rose-50 border border-rose-200 p-4 text-xs font-medium text-rose-600">
          <AlertTriangle size={18} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Detail Cards Stack */}
      <div className="flex flex-col gap-5">
        <MemberInfoCard member={reservasi.member} />

        <ScheduleInfoCard
          namaSpace={reservasi.space?.nama_space}
          tanggalReservasi={reservasi.tanggal_reservasi}
          jamMulai={reservasi.jam_mulai}
          jamSelesai={reservasi.jam_selesai}
          durasiJam={reservasi.durasi_jam}
          checkedInAt={reservasi.checked_in_at}
          checkedOutAt={reservasi.checked_out_at}
        />

        <PaymentInfoCard
          totalHargaAwal={reservasi.total_harga_awal}
          namaDiskon={reservasi.nama_diskon}
          potonganDiskon={reservasi.potongan_diskon}
          totalBayar={reservasi.total_bayar}
        />

        <ReservationActionsCard
          status={reservasi.status}
          statusUpdating={statusUpdating}
          checkActionLoading={checkActionLoading}
          onStatusChange={handleStatusChange}
          onCheckIn={handleCheckIn}
          onCheckOut={handleCheckOut}
        />
      </div>
    </div>
  );
}