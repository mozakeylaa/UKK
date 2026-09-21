"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Tag } from "lucide-react";
import { createAdminDiskon } from "@/lib/api/admin-diskon";
import { isApiSuccess } from "@/lib/types/api";
import DiskonForm, { DiskonFormData } from "@/components/admin/diskon/DiskonForm";

export default function TambahDiskonPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: DiskonFormData) {
    setError(null);
    setSubmitting(true);
    try {
      const res = await createAdminDiskon({
        ...formData,
        tanggal_awal: new Date(formData.tanggal_awal).toISOString(),
        tanggal_akhir: new Date(formData.tanggal_akhir).toISOString(),
      });
      if (isApiSuccess(res)) {
        router.push("/admin/diskon");
      } else {
        setError(res.message);
      }
    } catch {
      setError("Gagal membuat kode diskon. Silakan coba lagi.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl flex flex-col gap-6 pb-12">
      {/* Back Button */}
      <div>
        <Link
          href="/admin/diskon"
          className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-semibold text-slate-600 border border-slate-200/80 shadow-sm hover:bg-slate-50 hover:text-[#6367FF] transition-all"
        >
          <ChevronLeft size={16} />
          Kembali ke Kelola Diskon
        </Link>
      </div>

      {/* Header Info */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            Tambah Diskon Baru
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Tentukan nama promo, kode voucher, persentase potongan, dan masa aktif diskon.
          </p>
        </div>

        <div className="hidden sm:flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFDBFD] text-[#FF5DA2]">
          <Tag size={24} />
        </div>
      </div>

      {/* Form Container */}
      <div className="rounded-3xl bg-white p-6 sm:p-8 border border-slate-100 shadow-xl shadow-slate-900/5">
        <DiskonForm
          onSubmit={handleSubmit}
          submitting={submitting}
          error={error}
          submitLabel="Buat Kode Diskon"
          onCancel={() => router.push("/admin/diskon")}
        />
      </div>
    </div>
  );
}