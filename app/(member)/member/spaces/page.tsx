"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { getSpaces, getSpaceTypes } from "@/lib/api/space";
import { isApiSuccess } from "@/lib/types/api";
import type { Space, SpaceType, SpaceTipe } from "@/lib/types/space";
import { formatRupiah } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import { Card } from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Spinner from "@/components/ui/Spinner";
import EmptyState from "@/components/ui/EmptyState";

export default function SpaceCatalogPage() {
  const [spaceTypes, setSpaceTypes] = useState<SpaceType[]>([]);
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [activeTipe, setActiveTipe] = useState<SpaceTipe | "all">("all");
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getSpaceTypes().then((res) => {
      if (isApiSuccess(res)) setSpaceTypes(res.data);
    });
  }, []);

  useEffect(() => {
    let ignore = false;
    setIsLoading(true);
    setError(null);

    const timeout = setTimeout(() => {
      getSpaces({
        tipe: activeTipe === "all" ? undefined : activeTipe,
        search: search || undefined,
      }).then((res) => {
        if (ignore) return;
        if (isApiSuccess(res)) {
          setSpaces(res.data);
        } else {
          setError(res.message);
        }
        setIsLoading(false);
      });
    }, 300);

    return () => {
      ignore = true;
      clearTimeout(timeout);
    };
  }, [activeTipe, search]);

  const tabs: { label: string; value: SpaceTipe | "all" }[] = [
    { label: "Semua", value: "all" },
    ...spaceTypes.map((t) => ({ label: t.label, value: t.tipe })),
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-medium text-ink-950">Katalog Space</h1>
        <p className="mt-1 text-sm text-ink-600">
          Pilih coworking space yang sesuai kebutuhanmu.
        </p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTipe(tab.value)}
              className={cn(
                "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                activeTipe === tab.value
                  ? "bg-brand-600 text-white"
                  : "bg-white text-ink-600 hover:bg-surface-100"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-600"
          />
          <Input
            placeholder="Cari space..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {isLoading && <Spinner label="Memuat katalog space..." />}

      {!isLoading && error && (
        <EmptyState title="Gagal memuat data" description={error} />
      )}

      {!isLoading && !error && spaces.length === 0 && (
        <EmptyState
          title="Space tidak ditemukan"
          description="Coba ubah kata kunci pencarian atau filter tipe."
        />
      )}

      {!isLoading && !error && spaces.length > 0 && (
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
      )}
    </div>
  );
}