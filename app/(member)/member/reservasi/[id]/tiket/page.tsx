"use client";

import { useEffect, useState, use as usePromise } from "react";
import { Printer } from "lucide-react";
import { getETicket } from "@/lib/api/reservasi";
import { isApiSuccess } from "@/lib/types/api";
import type { ETicket } from "@/lib/types/reservasi";
import { formatRupiah, formatDate } from "@/lib/utils/format";
import { Card } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import EmptyState from "@/components/ui/EmptyState";

export default function ETicketPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = usePromise(params);
  const reservasiId = Number(id);

  const [tiket, setTiket] = useState<ETicket | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!reservasiId) return;
    setIsLoading(true);
    getETicket(reservasiId).then((res) => {
      if (isApiSuccess(res)) {
        setTiket(res.data);
      } else {
        setError(res.message);
      }
      setIsLoading(false);
    });
  }, [reservasiId]);

  if (isLoading) return <Spinner label="Memuat e-ticket..." />;

  if (error || !tiket) {
    return (
      <EmptyState
        title="E-ticket tidak ditemukan"
        description={error ?? "Data reservasi tidak tersedia."}
      />
    );
  }

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
    tiket.qr_code_payload
  )}`;

  return (
    <div className="mx-auto flex max-w-md flex-col gap-4">
      <div className="flex items-center justify-between print:hidden">
        <h1 className="font-display text-xl font-medium text-ink-950">E-Ticket</h1>
        <Button variant="outline" size="sm" onClick={() => window.print()}>
          <Printer size={14} className="mr-1" />
          Cetak
        </Button>
      </div>

      <Card className="flex flex-col items-center gap-4 text-center">
        <div>
          <p className="font-display text-lg font-medium text-ink-950">
            {tiket.space?.nama_space ?? `Space #${tiket.id_space}`}
          </p>
          <p className="text-xs text-ink-600">{tiket.space?.owner?.nama_coworking}</p>
        </div>

        <Badge status={tiket.status} />

        <img
          src={qrImageUrl}
          alt="QR Code E-Ticket"
          className="h-44 w-44 rounded-md border border-surface-200"
        />

        <div className="w-full">
          <p className="text-xs text-ink-600">Kode Booking</p>
          <p className="font-display text-xl font-medium tracking-wide text-brand-700">
            {tiket.kode_booking}
          </p>
        </div>

        <div className="grid w-full grid-cols-2 gap-3 border-t border-surface-200 pt-4 text-left text-sm">
          <div>
            <p className="text-xs text-ink-600">Tanggal</p>
            <p className="font-medium text-ink-950">{formatDate(tiket.tanggal_reservasi)}</p>
          </div>
          <div>
            <p className="text-xs text-ink-600">Jam</p>
            <p className="font-medium text-ink-950">
              {tiket.jam_mulai}–{tiket.jam_selesai}
            </p>
          </div>
          <div>
            <p className="text-xs text-ink-600">Durasi</p>
            <p className="font-medium text-ink-950">{tiket.durasi_jam} jam</p>
          </div>
          <div>
            <p className="text-xs text-ink-600">Total bayar</p>
            <p className="font-medium text-ink-950">{formatRupiah(tiket.total_bayar)}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}