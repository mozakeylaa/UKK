import type { ETicket } from "@/lib/types/reservasi";
import { formatRupiah, formatDate } from "@/lib/utils/format";
import { Card } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

interface ETicketCardProps {
  tiket: ETicket;
  qrImageUrl: string;
}

export default function ETicketCard({ tiket, qrImageUrl }: ETicketCardProps) {
  return (
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
  );
}
