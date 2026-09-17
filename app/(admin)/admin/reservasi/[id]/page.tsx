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
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import Select from "@/components/ui/Select";
import Spinner from "@/components/ui/Spinner";

const STATUS_OPTIONS: { label: string; value: ReservasiStatus }[] = [
  { label: "Belum Dikonfirmasi", value: "belum_dikonfirm" },
  { label: "Disetujui", value: "disetujui" },
  { label: "Aktif", value: "aktif" },
  { label: "Selesai", value: "selesai" },
  { label: "Dibatalkan", value: "dibatalkan" },
];

function formatRupiah(value: number): string {
  return `Rp ${value.toLocaleString("id-ID")}`;
}

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

      <Card>
        <CardHeader>
          <CardTitle>Info Member</CardTitle>
        </CardHeader>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-ink-600">Nama</p>
            <p className="font-medium text-ink-950">
              {reservasi.member?.nama_member ?? "-"}
            </p>
          </div>
          <div>
            <p className="text-ink-600">Username</p>
            <p className="font-medium text-ink-950">
              {reservasi.member?.username ?? "-"}
            </p>
          </div>
          <div>
            <p className="text-ink-600">Instansi</p>
            <p className="font-medium text-ink-950">
              {reservasi.member?.instansi ?? "-"}
            </p>
          </div>
          <div>
            <p className="text-ink-600">Telepon</p>
            <p className="font-medium text-ink-950">
              {reservasi.member?.telp ?? "-"}
            </p>
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Info Ruangan & Jadwal</CardTitle>
        </CardHeader>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-ink-600">Ruangan</p>
            <p className="font-medium text-ink-950">
              {reservasi.space?.nama_space ?? "-"}
            </p>
          </div>
          <div>
            <p className="text-ink-600">Tanggal</p>
            <p className="font-medium text-ink-950">{reservasi.tanggal_reservasi}</p>
          </div>
          <div>
            <p className="text-ink-600">Jam</p>
            <p className="font-medium text-ink-950">
              {reservasi.jam_mulai} - {reservasi.jam_selesai}
            </p>
          </div>
          <div>
            <p className="text-ink-600">Durasi</p>
            <p className="font-medium text-ink-950">{reservasi.durasi_jam} jam</p>
          </div>
          {reservasi.checked_in_at && (
            <div>
              <p className="text-ink-600">Check-In</p>
              <p className="font-medium text-ink-950">{reservasi.checked_in_at}</p>
            </div>
          )}
          {reservasi.checked_out_at && (
            <div>
              <p className="text-ink-600">Check-Out</p>
              <p className="font-medium text-ink-950">{reservasi.checked_out_at}</p>
            </div>
          )}
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pembayaran</CardTitle>
        </CardHeader>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-ink-600">Harga Awal</p>
            <p className="font-medium text-ink-950">
              {formatRupiah(reservasi.total_harga_awal)}
            </p>
          </div>
          <div>
            <p className="text-ink-600">Diskon</p>
            <p className="font-medium text-ink-950">
              {reservasi.nama_diskon
                ? `${reservasi.nama_diskon} (-${formatRupiah(reservasi.potongan_diskon)})`
                : "-"}
            </p>
          </div>
          <div className="col-span-2 border-t border-surface-200 pt-3">
            <p className="text-ink-600">Total Bayar</p>
            <p className="text-lg font-semibold text-ink-950">
              {formatRupiah(reservasi.total_bayar)}
            </p>
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Aksi</CardTitle>
        </CardHeader>
        <div className="flex flex-col gap-4">
          <Select
            label="Ubah Status"
            options={STATUS_OPTIONS}
            value={reservasi.status}
            onChange={(e) => handleStatusChange(e.target.value as ReservasiStatus)}
            disabled={statusUpdating}
          />

          <div className="flex gap-2">
            <Button
              onClick={handleCheckIn}
              disabled={reservasi.status !== "disetujui"}
              isLoading={checkActionLoading}
            >
              Check-In
            </Button>
            <Button
              onClick={handleCheckOut}
              disabled={reservasi.status !== "aktif"}
              isLoading={checkActionLoading}
            >
              Check-Out
            </Button>
          </div>
        </div>
      </Card>

      <Button variant="ghost" onClick={() => router.back()}>
        Kembali
      </Button>
    </div>
  );
}