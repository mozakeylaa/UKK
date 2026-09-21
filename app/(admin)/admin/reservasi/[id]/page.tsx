"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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
import Button from "@/components/ui/Button";
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
    } catch (err) {
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
    } catch (err) {
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
    } catch (err) {
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
    } catch (err) {
      setError("Gagal melakukan check-out");
    } finally {
      setCheckActionLoading(false);
    }
  }

  if (loading) return <Spinner label="Memuat detail reservasi..." />;
  if (!reservasi)
    return <div className="text-center text-ink-600">Reservasi tidak ditemukan</div>;

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-ink-950">
          Detail Reservasi — {reservasi.kode_booking}
        </h1>
        <Badge status={reservasi.status} />
      </div>

      {error && (
        <div className="rounded-md bg-status-cancelled/10 p-3 text-sm text-status-cancelled">
          {error}
        </div>
      )}

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

      <Button variant="ghost" onClick={() => router.back()}>
        Kembali
      </Button>
    </div>
  );
}