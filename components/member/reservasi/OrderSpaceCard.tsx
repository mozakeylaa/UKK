import type { Space } from "@/lib/types/space";
import { formatRupiah, getSpaceImageUrl } from "@/lib/utils/format";
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
    <Card className="p-5">
      <div className="flex gap-4 items-center">
        <img
          src={getSpaceImageUrl(space)}
          alt={space.nama_space}
          className="h-20 w-24 rounded-xl object-cover border border-surface-200 shrink-0 shadow-sm"
        />
        <div>
          <h2 className="font-display text-base font-medium text-ink-950">{space.nama_space}</h2>
          <p className="text-sm text-ink-600">{space.owner?.nama_coworking}</p>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4 border-t border-surface-200/60 pt-3">
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
