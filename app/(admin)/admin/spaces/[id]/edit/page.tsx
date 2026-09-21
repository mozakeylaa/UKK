"use client";

import { useEffect, useState, use as usePromise } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Edit3, AlertTriangle } from "lucide-react";
import { getAdminSpaceById, updateAdminSpace } from "@/lib/api/admin-spaces";
import { isApiSuccess } from "@/lib/types/api";
import Spinner from "@/components/ui/Spinner";
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
      setServerError("Terjadi kesalahan sistem saat memperbarui space. Coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <Spinner label="Memuat data space..." />
      </div>
    );
  }

  if (loadError || !initialData) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center justify-center rounded-3xl bg-white p-12 text-center border border-rose-100 shadow-sm">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
          <AlertTriangle size={28} />
        </div>
        <h2 className="mt-4 font-display text-lg font-bold text-slate-900">Space Tidak Ditemukan</h2>
        <p className="mt-1 text-xs sm:text-sm text-slate-500">
          {loadError ?? "Data space tidak tersedia atau telah dihapus."}
        </p>
        <Link
          href="/admin/spaces"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#12132E] px-5 py-2.5 text-xs font-semibold text-white hover:bg-slate-800 transition-colors"
        >
          <ChevronLeft size={16} /> Kembali ke Kelola Space
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl flex flex-col gap-6 pb-12">
      {/* Back Button */}
      <div>
        <Link
          href="/admin/spaces"
          className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-semibold text-slate-600 border border-slate-200/80 shadow-sm hover:bg-slate-50 hover:text-[#6367FF] transition-all"
        >
          <ChevronLeft size={16} />
          Kembali ke Kelola Space
        </Link>
      </div>

      {/* Header Info */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            Edit Space
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Perbarui informasi detail ruangan, kapasitas, tarif per jam, atau foto space.
          </p>
        </div>

        <div className="hidden sm:flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EEEFFF] text-[#6367FF]">
          <Edit3 size={22} />
        </div>
      </div>

      {/* Form Container */}
      <div className="rounded-3xl bg-white p-6 sm:p-8 border border-slate-100 shadow-xl shadow-slate-900/5">
        <SpaceForm
          initialData={initialData}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          serverError={serverError}
          submitLabel="Simpan Perubahan Space"
        />
      </div>
    </div>
  );
}