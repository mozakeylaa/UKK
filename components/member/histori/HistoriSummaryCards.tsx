import { formatRupiah } from "@/lib/utils/format";
import { Card } from "@/components/ui/Card";

interface HistoriSummaryCardsProps {
  totalReservasi: number;
  totalPengeluaran: number;
}

export default function HistoriSummaryCards({
  totalReservasi,
  totalPengeluaran,
}: HistoriSummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Card>
        <p className="text-sm text-ink-600">Total reservasi</p>
        <p className="mt-2 font-display text-2xl font-medium text-ink-950">
          {totalReservasi}
        </p>
      </Card>
      <Card>
        <p className="text-sm text-ink-600">Total pengeluaran</p>
        <p className="mt-2 font-display text-2xl font-medium text-brand-700">
          {formatRupiah(totalPengeluaran)}
        </p>
      </Card>
    </div>
  );
}
