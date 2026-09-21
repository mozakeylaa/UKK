"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, PlusCircle, Building2 } from "lucide-react";
import { createAdminSpace } from "@/lib/api/admin-spaces";
import { isApiSuccess } from "@/lib/types/api";
import SpaceForm, { SpaceFormData } from "@/components/admin/spaces/SpaceForm";

export default function TambahSpacePage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(data: Omit<SpaceFormData, "foto_url">) {
    setServerError(null);
    setIsSubmitting(true);
    try {
      const res = await createAdminSpace(data);
      if (isApiSuccess(res)) {
        router.push("/admin/spaces");
      } else {
        setServerError(res.message);
      }
    } catch {
      setServerError("Terjadi kesalahan sistem saat menyimpan space. Coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
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
            Tambah Space Baru
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Lengkapi data detail ruangan, kapasitas, tipe, dan tarif sewa per jam.
          </p>
        </div>

        <div className="hidden sm:flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EEEFFF] text-[#6367FF]">
          <Building2 size={24} />
        </div>
      </div>

      {/* Form Container */}
      <div className="rounded-3xl bg-white p-6 sm:p-8 border border-slate-100 shadow-xl shadow-slate-900/5">
        <SpaceForm
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          serverError={serverError}
          submitLabel="Simpan Space Baru"
        />
      </div>
    </div>
  );
}