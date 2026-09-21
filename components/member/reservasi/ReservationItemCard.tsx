import Link from "next/link";
import { Ticket } from "lucide-react";
import type { Reservasi } from "@/lib/types/reservasi";
import { formatRupiah, formatDate } from "@/lib/utils/format";
import { Card } from "@/components/ui/Card";
import Badge, { ReservasiStatus } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

const CANCELLABLE: ReservasiStatus[] = ["belum_dikonfirm", "disetujui"];

interface ReservationItemCardProps {
  reservasi: Reservasi;
  onCancel: (reservasi: Reservasi) => void;
}

export default function ReservationItemCard({
  reservasi: r,
  onCancel,
}: ReservationItemCardProps) {
  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-display text-base font-medium text-ink-950">
            {r.space?.nama_space ?? `Space #${r.id_space}`}
          </p>
          <p className="text-xs text-ink-600">
            {formatDate(r.tanggal_reservasi)} · {r.jam_mulai}–{r.jam_selesai}
          </p>
          <p className="mt-1 text-xs text-ink-600">Kode: {r.kode_booking}</p>
        </div>
        <Badge status={r.status} />
      </div>

      <div className="flex items-center justify-between border-t border-surface-200 pt-3">
        <span className="font-display text-sm font-medium text-brand-700">
          {formatRupiah(r.total_bayar)}
        </span>
        <div className="flex gap-2">
          <Link href={`/member/reservasi/${r.id}/tiket`}>
            <Button variant="outline" size="sm">
              <Ticket size={14} className="mr-1" />
              E-Ticket
            </Button>
          </Link>
          {CANCELLABLE.includes(r.status) && (
            <Button
              variant="danger"
              size="sm"
              onClick={() => onCancel(r)}
            >
              Batalkan
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
