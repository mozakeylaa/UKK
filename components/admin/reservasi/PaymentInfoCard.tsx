import { Card, CardHeader, CardTitle } from "@/components/ui/Card";

function formatRupiah(value: number): string {
  return `Rp ${value.toLocaleString("id-ID")}`;
}

interface PaymentInfoCardProps {
  totalHargaAwal: number;
  namaDiskon?: string | null;
  potonganDiskon: number;
  totalBayar: number;
}

export default function PaymentInfoCard({
  totalHargaAwal,
  namaDiskon,
  potonganDiskon,
  totalBayar,
}: PaymentInfoCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pembayaran</CardTitle>
      </CardHeader>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-ink-600">Harga Awal</p>
          <p className="font-medium text-ink-950">
            {formatRupiah(totalHargaAwal)}
          </p>
        </div>
        <div>
          <p className="text-ink-600">Diskon</p>
          <p className="font-medium text-ink-950">
            {namaDiskon
              ? `${namaDiskon} (-${formatRupiah(potonganDiskon)})`
              : "-"}
          </p>
        </div>
        <div className="col-span-2 border-t border-surface-200 pt-3">
          <p className="text-ink-600">Total Bayar</p>
          <p className="text-lg font-semibold text-ink-950">
            {formatRupiah(totalBayar)}
          </p>
        </div>
      </div>
    </Card>
  );
}
