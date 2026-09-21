"use client";

import { useEffect, useState } from "react";
import { getSpaces, getSpaceTypes } from "@/lib/api/space";
import { isApiSuccess } from "@/lib/types/api";
import type { Space, SpaceType, SpaceTipe } from "@/lib/types/space";
import Spinner from "@/components/ui/Spinner";
import EmptyState from "@/components/ui/EmptyState";
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
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-medium text-ink-950">Katalog Space</h1>
        <p className="mt-1 text-sm text-ink-600">
          Pilih coworking space yang sesuai kebutuhanmu.
        </p>
      </div>

      <SpaceCategoryTabs
        spaceTypes={spaceTypes}
        activeTipe={activeTipe}
        search={search}
        onSelectTipe={setActiveTipe}
        onSearchChange={setSearch}
      />

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
        <SpaceCatalogGrid spaces={spaces} />
      )}
    </div>
  );
}