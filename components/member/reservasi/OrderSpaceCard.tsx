import type { Space } from "@/lib/types/space";
import { formatRupiah } from "@/lib/utils/format";
import { Card } from "@/components/ui/Card";

interface OrderSpaceCardProps {
  space: Space;
  tanggal: string;
  jamMulai: string;
  durasiJam: number;
}

export default function OrderSpaceCard({
  space,
  tanggal,
  jamMulai,
  durasiJam,
}: OrderSpaceCardProps) {
  return (
    <Card>
      <h2 className="font-display text-base font-medium text-ink-950">{space.nama_space}</h2>
      <p className="text-sm text-ink-600">{space.owner?.nama_coworking}</p>
      <div className="mt-3 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
        <div>
          <p className="text-xs text-ink-600">Tanggal</p>
          <p className="font-medium text-ink-950">{tanggal}</p>
        </div>
        <div>
          <p className="text-xs text-ink-600">Jam mulai</p>
          <p className="font-medium text-ink-950">{jamMulai}</p>
        </div>
        <div>
          <p className="text-xs text-ink-600">Durasi</p>
          <p className="font-medium text-ink-950">{durasiJam} jam</p>
        </div>
        <div>
          <p className="text-xs text-ink-600">Harga/jam</p>
          <p className="font-medium text-ink-950">{formatRupiah(space.harga_per_jam)}</p>
        </div>
      </div>
    </Card>
  );
}
