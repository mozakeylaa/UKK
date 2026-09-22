import type { Space } from "@/lib/types/space";
import { formatRupiah, getSpaceImageUrl } from "@/lib/utils/format";

interface SpaceInfoCardProps {
  space: Space;
}

export default function SpaceInfoCard({ space }: SpaceInfoCardProps) {
  const imageUrl = getSpaceImageUrl(space);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="aspect-video w-full overflow-hidden rounded-2xl bg-slate-100 shadow-sm border border-slate-100">
        <img
          src={imageUrl}
          alt={space.nama_space}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>

      <div className="flex flex-col gap-3">
        <div>
          <h1 className="font-display text-2xl font-medium text-ink-950">{space.nama_space}</h1>
          <p className="text-sm text-ink-600">{space.owner?.nama_coworking}</p>
        </div>
        <p className="text-sm text-ink-600">{space.deskripsi}</p>
        <div className="flex flex-wrap gap-4 pt-2">
          <div>
            <p className="text-xs text-ink-600">Kapasitas</p>
            <p className="font-medium text-ink-950">{space.kapasitas} orang</p>
          </div>
          <div>
            <p className="text-xs text-ink-600">Harga</p>
            <p className="font-medium text-ink-950">
              {formatRupiah(space.harga_per_jam)}/jam
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
