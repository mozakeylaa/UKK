import Link from "next/link";
import type { Space } from "@/lib/types/space";
import { formatRupiah } from "@/lib/utils/format";
import { Card } from "@/components/ui/Card";

interface SpaceCatalogGridProps {
  spaces: Space[];
}

export default function SpaceCatalogGrid({ spaces }: SpaceCatalogGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {spaces.map((space) => (
        <Link key={space.id} href={`/member/spaces/${space.id}`}>
          <Card className="flex h-full flex-col gap-3 p-0 overflow-hidden transition-shadow hover:shadow-md">
            <div className="aspect-video w-full bg-surface-100">
              {space.foto_url ? (
                <img
                  src={space.foto_url}
                  alt={space.nama_space}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs text-ink-600">
                  Tidak ada foto
                </div>
              )}
            </div>
            <div className="flex flex-1 flex-col gap-2 px-4 pb-4">
              <div>
                <p className="font-display text-base font-medium text-ink-950">
                  {space.nama_space}
                </p>
                <p className="text-xs text-ink-600">{space.owner?.nama_coworking}</p>
              </div>
              <p className="line-clamp-2 text-sm text-ink-600">{space.deskripsi}</p>
              <div className="mt-auto flex items-center justify-between pt-2">
                <span className="text-xs text-ink-600">
                  Kapasitas {space.kapasitas} orang
                </span>
                <span className="font-display text-sm font-medium text-brand-700">
                  {formatRupiah(space.harga_per_jam)}/jam
                </span>
              </div>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}
