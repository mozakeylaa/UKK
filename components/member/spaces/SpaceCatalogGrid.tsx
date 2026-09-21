import Link from "next/link";
import { Users, Building2 } from "lucide-react";
import type { Space } from "@/lib/types/space";
import { formatRupiah } from "@/lib/utils/format";

interface SpaceCatalogGridProps {
  spaces: Space[];
}

export default function SpaceCatalogGrid({ spaces }: SpaceCatalogGridProps) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {spaces.map((space, index) => (
        <Link
          key={space.id}
          href={`/member/spaces/${space.id}`}
          className="group block opacity-0"
          style={{
            animation: `fadeUp 0.5s ease ${0.05 + Math.min(index, 8) * 0.05}s forwards`,
          }}
        >
          <div className="flex h-full flex-col overflow-hidden rounded-3xl bg-white border border-slate-100 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-[#6367FF]/10">
            {/* Image Preview Container */}
            <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
              {space.foto_url ? (
                <img
                  src={space.foto_url}
                  alt={space.nama_space}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 bg-[#EEEFFF]/60 text-slate-400">
                  <Building2 size={24} className="text-[#8494FF]" />
                  <span className="text-[11px] font-medium">Foto belum tersedia</span>
                </div>
              )}

              {/* Badge Pemilik / Coworking Space */}
              {space.owner?.nama_coworking && (
                <span className="absolute left-3 top-3 rounded-full bg-[#12132E]/85 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-md shadow-sm">
                  {space.owner.nama_coworking}
                </span>
              )}
            </div>

            {/* Space Details */}
            <div className="flex flex-1 flex-col justify-between p-5">
              <div>
                <h3 className="font-display text-base font-bold text-slate-900 group-hover:text-[#6367FF] transition-colors">
                  {space.nama_space}
                </h3>
                <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-slate-500">
                  {space.deskripsi || "Ruang kerja nyaman dengan fasilitas lengkap siap pakai."}
                </p>
              </div>

              {/* Bottom Info: Kapasitas & Harga */}
              <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3.5">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFDBFD] px-2.5 py-1 text-[11px] font-bold text-[#FF5DA2]">
                  <Users size={12} />
                  {space.kapasitas} orang
                </span>

                <div className="text-right">
                  <span className="font-display text-base font-bold text-[#6367FF]">
                    {formatRupiah(space.harga_per_jam)}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">/jam</span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}