"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, MapPin } from "lucide-react";
import { getSpaces, getSpaceTypes } from "@/lib/api/space";
import { isApiSuccess } from "@/lib/types/api";
import { useAuth } from "@/lib/context/AuthContext";
import type { Space, SpaceType, SpaceTipe } from "@/lib/types/space";
import { formatRupiah } from "@/lib/utils/format";
import { Card } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";

export default function MemberDashboardPage() {
  const { user } = useAuth();
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [spaceTypes, setSpaceTypes] = useState<SpaceType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getSpaces(), getSpaceTypes()])
      .then(([spacesRes, typesRes]) => {
        if (isApiSuccess(spacesRes)) {
          setSpaces(spacesRes.data ?? []);
        } else {
          setError(spacesRes.message);
        }
        if (isApiSuccess(typesRes)) {
          setSpaceTypes(typesRes.data ?? []);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err?.message ?? "Gagal memuat data dari server.");
        setIsLoading(false);
      });
  }, []);

  const typeLabel = (tipe: SpaceTipe) =>
    spaceTypes.find((t) => t.tipe === tipe)?.label ?? tipe;

  return (
    <div className="flex flex-col gap-8">
      {/* Hero persuasif */}
      <div className="relative overflow-hidden rounded-3xl bg-navy-gradient px-6 py-10 sm:px-10">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-blue-100 ring-1 ring-white/20">
          <Sparkles size={12} />
          Halo, {user?.nama ?? "Member"}
        </span>
        <h1 className="mt-4 max-w-lg font-display text-2xl font-bold leading-tight text-white sm:text-3xl">
          Ruang kerja favoritmu, tinggal satu klik lagi.
        </h1>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-blue-100/80 sm:text-base">
          Gak perlu telepon, gak perlu nunggu balasan admin. Cek jadwal, pilih
          jam kosong, dan ruang langsung jadi milikmu — hari ini juga.
        </p>
        <Link href="/member/spaces" className="mt-6 inline-block">
          <Button size="lg" className="gap-2 !bg-white !text-navy-900 hover:!bg-blue-50">
            Cari Space Sekarang
            <ArrowRight size={18} />
          </Button>
        </Link>
      </div>

      {/* List semua coworking space */}
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-xl font-semibold text-ink-950">
              Coworking space untukmu
            </h2>
            <p className="mt-1 text-sm text-ink-600">
              Dari desk santai sampai ruang meeting, semua siap dipesan.
            </p>
          </div>
          <Link
            href="/member/spaces"
            className="hidden text-sm font-medium text-brand-600 hover:underline sm:block"
          >
            Lihat semua
          </Link>
        </div>

        {isLoading && <Spinner label="Memuat daftar space..." />}

        {!isLoading && error && (
          <Card className="mt-4">
            <p className="text-sm text-status-cancelled">{error}</p>
          </Card>
        )}

        {!isLoading && !error && spaces.length === 0 && (
          <Card className="mt-4">
            <p className="text-sm text-ink-600">
              Belum ada space yang bisa ditampilkan saat ini.
            </p>
          </Card>
        )}

        {!isLoading && !error && spaces.length > 0 && (
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {spaces.map((space) => (
              <Link key={space.id} href={`/member/spaces/${space.id}`}>
                <Card className="flex h-full flex-col gap-0 overflow-hidden p-0 transition-shadow hover:shadow-md">
                  <div className="relative aspect-video w-full bg-surface-100">
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
                    <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-navy-900/80 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
                      <MapPin size={12} />
                      {typeLabel(space.tipe)}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col gap-2 px-4 py-4">
                    <div>
                      <p className="font-display text-base font-semibold text-ink-950">
                        {space.nama_space}
                      </p>
                      <p className="text-xs text-ink-600">{space.owner?.nama_coworking}</p>
                    </div>
                    <p className="line-clamp-2 text-sm text-ink-600">{space.deskripsi}</p>
                    <div className="mt-auto flex items-end justify-between pt-2">
                      <span className="text-xs text-ink-600">
                        Kapasitas {space.kapasitas} orang
                      </span>
                      <div className="text-right">
                        <span className="font-display text-lg font-bold text-brand-600">
                          {formatRupiah(space.harga_per_jam)}
                        </span>
                        <span className="ml-1 text-xs text-ink-600">/jam</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}

        <Link
          href="/member/spaces"
          className="mt-4 block text-center text-sm font-medium text-brand-600 hover:underline sm:hidden"
        >
          Lihat semua space
        </Link>
      </div>
    </div>
  );
}