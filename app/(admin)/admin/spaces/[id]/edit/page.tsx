"use client";

import { useEffect, useState, use as usePromise } from "react";
import { useRouter } from "next/navigation";
import { getAdminSpaceById, updateAdminSpace } from "@/lib/api/admin-spaces";
import { isApiSuccess } from "@/lib/types/api";
import { Card } from "@/components/ui/Card";
import Spinner from "@/components/ui/Spinner";
import EmptyState from "@/components/ui/EmptyState";
import SpaceForm, { SpaceFormData } from "@/components/admin/spaces/SpaceForm";

export default function EditSpacePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = usePromise(params);
  const spaceId = Number(id);
  const router = useRouter();

  const [initialData, setInitialData] = useState<Partial<SpaceFormData> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!spaceId) return;
    getAdminSpaceById(spaceId).then((res) => {
      if (isApiSuccess(res)) {
        setInitialData({
          nama_space: res.data.nama_space,
          tipe: res.data.tipe,
          harga_per_jam: res.data.harga_per_jam,
          kapasitas: res.data.kapasitas,
          deskripsi: res.data.deskripsi,
          foto: res.data.foto ?? undefined,
          foto_url: res.data.foto_url ?? undefined,
        });
      } else {
        setLoadError(res.message);
      }
      setIsLoading(false);
    });
  }, [spaceId]);

  async function handleSubmit(data: Omit<SpaceFormData, "foto_url">) {
    setServerError(null);
    setIsSubmitting(true);
    try {
      const res = await updateAdminSpace(spaceId, data);
      if (isApiSuccess(res)) {
        router.push("/admin/spaces");
      } else {
        setServerError(res.message);
      }
    } catch {
      setServerError("Terjadi kesalahan. Coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) return <Spinner label="Memuat data space..." />;
  if (loadError || !initialData) {
    return (
      <EmptyState
        title="Space tidak ditemukan"
        description={loadError ?? "Data tidak tersedia."}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink-950">Edit Space</h1>
        <p className="mt-1 text-sm text-ink-600">Perbarui detail ruangan/meja.</p>
      </div>

      <Card className="max-w-lg">
        <SpaceForm
          initialData={initialData}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          serverError={serverError}
          submitLabel="Simpan Perubahan"
        />
      </Card>
    </div>
  );
}