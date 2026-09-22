import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import type { AdminSpace } from "@/lib/types/admin";
import { formatRupiah, getSpaceImageUrl } from "@/lib/utils/format";
import { Card } from "@/components/ui/Card";
import Button from "@/components/ui/Button";

const TIPE_LABEL: Record<string, string> = {
  desk: "Personal Desk",
  meeting_room: "Meeting Room",
  private_office: "Private Office",
};

interface SpaceGridCardProps {
  spaces: AdminSpace[];
  onRequestDelete: (space: AdminSpace) => void;
}

export default function SpaceGridCard({
  spaces,
  onRequestDelete,
}: SpaceGridCardProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {spaces.map((space) => {
        const imageUrl = getSpaceImageUrl(space);

        return (
          <Card key={space.id} className="flex flex-col gap-3 p-0 overflow-hidden">
            <div className="aspect-video w-full bg-surface-100">
              <img
                src={imageUrl}
                alt={space.nama_space}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          <div className="flex flex-1 flex-col gap-2 px-4 pb-4">
            <div>
              <p className="font-display text-base font-semibold text-ink-950">
                {space.nama_space}
              </p>
              <p className="text-xs text-ink-600">
                {TIPE_LABEL[space.tipe] ?? space.tipe}
              </p>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-ink-600">Kapasitas {space.kapasitas} orang</span>
              <span className="font-display font-semibold text-brand-700">
                {formatRupiah(space.harga_per_jam)}/jam
              </span>
            </div>
            <div className="mt-2 flex gap-2">
              <Link href={`/admin/spaces/${space.id}/edit`} className="flex-1">
                <Button variant="outline" size="sm" className="w-full">
                  <Pencil size={14} className="mr-1" />
                  Edit
                </Button>
              </Link>
              <Button
                variant="danger"
                size="sm"
                onClick={() => onRequestDelete(space)}
              >
                <Trash2 size={14} />
              </Button>
            </div>
          </div>
        </Card>
      );
    })}
  </div>
  );
}
