import type { ETicket } from "@/lib/types/reservasi";
import { formatRupiah, formatDate, getSpaceImageUrl } from "@/lib/utils/format";
import { Card } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

interface ETicketCardProps {
  tiket: ETicket;
  qrImageUrl: string;
}

export default function ETicketCard({ tiket, qrImageUrl }: ETicketCardProps) {
  return (
    <Card className="flex flex-col items-center gap-4 text-center overflow-hidden p-6">
      {tiket.space && (
        <div className="w-full h-36 -mt-6 -mx-6 mb-2 overflow-hidden border-b border-surface-200/60">
          <img
            src={getSpaceImageUrl(tiket.space)}
            alt={tiket.space.nama_space}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div>
        <p className="font-display text-lg font-medium text-ink-950">
          {tiket.space?.nama_space || (tiket.id_space ? `Space #${tiket.id_space}` : "Ruang Kerja")}
        </p>
        <p className="text-xs text-ink-600">
          {tiket.space?.owner?.nama_coworking || tiket.coworking_space?.nama || "Moklet Hub Coworking"}
        </p>
      </div>

      <Badge status={tiket.status} />

      <img
        src={qrImageUrl}
        alt="QR Code E-Ticket"
        className="h-44 w-44 rounded-xl border border-surface-200 shadow-sm"
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

        {tiket.potongan_diskon > 0 && (
          <div className="col-span-2 flex items-center justify-between rounded-xl bg-emerald-50 px-3.5 py-2 text-xs font-semibold text-emerald-700 border border-emerald-100">
            <span>Diskon ({tiket.nama_diskon || "Promo Khusus"})</span>
            <span>-{formatRupiah(tiket.potongan_diskon)}</span>
          </div>
        )}
      </div>
    </Card>
  );
}
