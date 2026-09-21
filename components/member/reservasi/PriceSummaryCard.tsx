import { formatRupiah } from "@/lib/utils/format";
import { Card } from "@/components/ui/Card";
import Button from "@/components/ui/Button";

interface PriceSummaryCardProps {
  subtotal: number;
  potongan: number;
  totalBayar: number;
  durasiJam: number;
  submitError: string | null;
  isSubmitting: boolean;
  onSubmit: () => void;
}

export default function PriceSummaryCard({
  subtotal,
  potongan,
  totalBayar,
  durasiJam,
  submitError,
  isSubmitting,
  onSubmit,
}: PriceSummaryCardProps) {
  return (
    <Card>
      <h2 className="font-display text-base font-medium text-ink-950">Ringkasan Biaya</h2>
      <div className="mt-3 flex flex-col gap-2 text-sm">
        <div className="flex justify-between">
          <span className="text-ink-600">Subtotal ({durasiJam} jam)</span>
          <span className="text-ink-950">{formatRupiah(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-ink-600">Potongan diskon</span>
          <span className="text-status-cancelled">- {formatRupiah(potongan)}</span>
        </div>
        <div className="flex justify-between border-t border-surface-200 pt-2 font-medium">
          <span className="text-ink-950">Total bayar</span>
          <span className="text-brand-700">{formatRupiah(totalBayar)}</span>
        </div>
      </div>

      {submitError && <p className="mt-3 text-sm text-status-cancelled">{submitError}</p>}

      <Button
        type="button"
        className="mt-4 w-full"
        isLoading={isSubmitting}
        onClick={onSubmit}
      >
        Buat Reservasi
      </Button>
    </Card>
  );
}
