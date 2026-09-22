import type { Reservasi } from "@/lib/types/reservasi";
import { formatRupiah, formatDate } from "@/lib/utils/format";
import { Card } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";

interface HistoriItemListProps {
  items: Reservasi[];
}

export default function HistoriItemList({ items }: HistoriItemListProps) {
  if (items.length === 0) {
    return (
      <EmptyState
        title="Tidak ada riwayat"
        description="Belum ada reservasi pada periode ini."
      />
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {items.map((r) => (
        <Card key={r.id} className="flex items-center justify-between gap-3">
          <div>
            <p className="font-medium text-ink-950">
              {r.space?.nama_space ?? `Space #${r.id_space}`}
            </p>
            <p className="text-xs text-ink-600">
              {formatDate(r.tanggal_reservasi)} · {r.jam_mulai}–{r.jam_selesai}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-ink-950">
              {formatRupiah(r.total_bayar)}
            </span>
            <Badge status={r.status} />
          </div>
        </Card>
      ))}
    </div>
  );
}