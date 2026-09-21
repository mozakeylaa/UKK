"use client";

import { useEffect, useState } from "react";
import { Sparkles, Building2, AlertTriangle, SearchX } from "lucide-react";
import { getSpaces, getSpaceTypes } from "@/lib/api/space";
import { isApiSuccess } from "@/lib/types/api";
import type { Space, SpaceType, SpaceTipe } from "@/lib/types/space";
import Spinner from "@/components/ui/Spinner";
import SpaceCategoryTabs from "@/components/member/spaces/SpaceCategoryTabs";
import SpaceCatalogGrid from "@/components/member/spaces/SpaceCatalogGrid";

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

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Header Banner Ringkas & Mewah */}
      <div className="relative overflow-hidden rounded-3xl bg-navy-gradient p-6 sm:p-8 text-white shadow-xl shadow-slate-900/10">
        <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-[#8494FF]/25 blur-3xl" />
        <div className="pointer-events-none absolute -left-12 -bottom-12 h-44 w-44 rounded-full bg-[#FF8FC2]/20 blur-3xl" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-slate-200 backdrop-blur-md border border-white/10">
              <Sparkles size={13} className="text-[#FF8FC2]" />
              Pilihan Ruang Terbaik
            </div>
            <h1 className="mt-3 font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Katalog Space
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-300 max-w-lg">
              Temukan workstation, meja personal fokus, hingga meeting room berfasilitas lengkap sesuai kebutuhan kerjamu.
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-3 rounded-2xl bg-white/10 p-3.5 backdrop-blur-md border border-white/15">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF8FC2] to-[#FF5DA2] text-white shadow-md">
              <Building2 size={20} />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-300">Tersedia</p>
              <p className="text-base font-bold font-display text-white">{spaces.length} Ruang</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="rounded-3xl bg-white p-4 sm:p-6 border border-slate-100 shadow-sm">
        <SpaceCategoryTabs
          spaceTypes={spaceTypes}
          activeTipe={activeTipe}
          search={search}
          onSelectTipe={setActiveTipe}
          onSearchChange={setSearch}
        />
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20">
          <Spinner label="Memuat katalog space..." />
        </div>
      )}

      {/* Error State */}
      {!isLoading && error && (
        <div className="flex flex-col items-center justify-center rounded-3xl bg-white p-12 text-center border border-rose-100 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
            <AlertTriangle size={24} />
          </div>
          <h3 className="mt-4 font-display text-base font-bold text-slate-900">Gagal Memuat Data</h3>
          <p className="mt-1 text-xs text-slate-500 max-w-sm">{error}</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && spaces.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-3xl bg-white p-12 text-center border border-slate-100 shadow-sm">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EEEFFF] text-[#6367FF]">
            <SearchX size={26} />
          </div>
          <h3 className="mt-4 font-display text-base font-bold text-slate-900">Space Tidak Ditemukan</h3>
          <p className="mt-1 text-xs text-slate-500 max-w-sm">
            Tidak ada space yang cocok dengan filter atau kata kunci pencarianmu saat ini. Coba ganti kata kunci lain.
          </p>
        </div>
      )}

      {/* Grid List Data Space */}
      {!isLoading && !error && spaces.length > 0 && (
        <SpaceCatalogGrid spaces={spaces} />
      )}
    </div>
  );
}