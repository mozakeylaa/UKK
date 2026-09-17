"use client";

import { useEffect, useState, use as usePromise } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { getReservasiById } from "@/lib/api/reservasi";
import { isApiSuccess } from "@/lib/types/api";
import type { Reservasi } from "@/lib/types/reservasi";
import { formatRupiah, formatDate } from "@/lib/utils/format";
import { Card } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import EmptyState from "@/components/ui/EmptyState";

export default function ReservasiSuksesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = usePromise(params);
  const reservasiId = Number(id);

  const [reservasi, setReservasi] = useState<Reservasi | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!reservasiId) return;
    setIsLoading(true);
    getReservasiById(reservasiId).then((res) => {
      if (isApiSuccess(res)) {
        setReservasi(res.data);
      } else {
        setError(res.message);
      }
      setIsLoading(false);
    });
  }, [reservasiId]);

  if (isLoading) return <Spinner label="Memuat konfirmasi..." />;

  if (error || !reservasi) {
    return (
      <EmptyState
        title="Data reservasi tidak ditemukan"
        description={error ?? "Coba cek di halaman status pemesanan."}
      />
    );
  }

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-6 py-8 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-50">
        <CheckCircle2 size={32} className="text-brand-600" />
      </div>

      <div>
        <h1 className="font-display text-xl font-medium text-ink-950">
          Reservasi Berhasil Dibuat
        </h1>
        <p className="mt-1 text-sm text-ink-600">
          Menunggu konfirmasi dari pengelola space.
        </p>
      </div>

      <Card className="w-full text-left">
        <p className="text-xs text-ink-600">Kode Booking</p>
        <p className="font-display text-2xl font-medium tracking-wide text-brand-700">
          {reservasi.kode_booking}
        </p>

        <div className="mt-4 flex flex-col gap-2 border-t border-surface-200 pt-4 text-sm">
          <div className="flex justify-between">
            <span className="text-ink-600">Tanggal</span>
            <span className="text-ink-950">{formatDate(reservasi.tanggal_reservasi)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink-600">Jam</span>
            <span className="text-ink-950">
              {reservasi.jam_mulai} - {reservasi.jam_selesai}
            </span>
          </div>
          <div className="flex justify-between border-t border-surface-200 pt-2 font-medium">
            <span className="text-ink-950">Total bayar</span>
            <span className="text-brand-700">{formatRupiah(reservasi.total_bayar)}</span>
          </div>
        </div>
      </Card>

      <Link href="/member/reservasi" className="w-full">
        <Button className="w-full">Lihat Status Pemesanan</Button>
      </Link>
    </div>
  );
}