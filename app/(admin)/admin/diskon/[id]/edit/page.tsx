"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Edit3, AlertTriangle } from "lucide-react";
import { getAdminDiskonDetail, updateAdminDiskon } from "@/lib/api/admin-diskon";
import { isApiSuccess } from "@/lib/types/api";
import type { Diskon } from "@/lib/types/reservasi";
import Spinner from "@/components/ui/Spinner";
import DiskonForm, { DiskonFormData } from "@/components/admin/diskon/DiskonForm";

function toDateInputValue(iso: string): string {
  return iso ? iso.split("T")[0] : "";
}

export default function EditDiskonPage() {
  const params = useParams();
  const router = useRouter();
  const diskonId = Number(params.id);

  const [diskon, setDiskon] = useState<Diskon | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDiskon() {
      try {
        const res = await getAdminDiskonDetail(diskonId);
        if (isApiSuccess(res)) {
          setDiskon(res.data);
        } else {
          setError(res.message);
        }
      } catch {
        setError("Gagal memuat data diskon dari server.");
      } finally {
        setLoading(false);
      }
    }

    fetchDiskon();
  }, [diskonId]);

  async function handleSubmit(formData: DiskonFormData) {
    setError(null);
    setSubmitting(true);
    try {
      const res = await updateAdminDiskon(diskonId, {
        ...formData,
        tanggal_awal: formData.tanggal_awal
          ? new Date(formData.tanggal_awal).toISOString()
          : undefined,
        tanggal_akhir: formData.tanggal_akhir
          ? new Date(formData.tanggal_akhir).toISOString()
          : undefined,
      });
      if (isApiSuccess(res)) {
        router.push("/admin/diskon");
      } else {
        setError(res.message);
      }
    } catch {
      setError("Gagal memperbarui diskon. Silakan coba lagi.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <Spinner label="Memuat data diskon..." />
      </div>
    );
  }

  if (!diskon) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center justify-center rounded-3xl bg-white p-12 text-center border border-rose-100 shadow-sm">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
          <AlertTriangle size={28} />
        </div>
        <h2 className="mt-4 font-display text-lg font-bold text-slate-900">Diskon Tidak Ditemukan</h2>
        <p className="mt-1 text-xs sm:text-sm text-slate-500">
          {error ?? "Data kode promo tidak tersedia atau telah dihapus."}
        </p>
        <Link
          href="/admin/diskon"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#12132E] px-5 py-2.5 text-xs font-semibold text-white hover:bg-slate-800 transition-colors"
        >
          <ChevronLeft size={16} /> Kembali ke Kelola Diskon
        </Link>
      </div>
    );
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
            Edit Diskon
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Perbarui nama promo <span className="font-semibold text-slate-800 font-mono">"{diskon.nama_diskon}"</span>, persentase potongan, atau periode aktif voucher.
          </p>
        </div>

        <div className="hidden sm:flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EEEFFF] text-[#6367FF]">
          <Edit3 size={22} />
        </div>
      </div>

      {/* Form Container */}
      <div className="rounded-3xl bg-white p-6 sm:p-8 border border-slate-100 shadow-xl shadow-slate-900/5">
        <DiskonForm
          initialData={{
            nama_diskon: diskon.nama_diskon,
            persentase_diskon: diskon.persentase_diskon,
            tanggal_awal: toDateInputValue(diskon.tanggal_awal),
            tanggal_akhir: toDateInputValue(diskon.tanggal_akhir),
          }}
          onSubmit={handleSubmit}
          submitting={submitting}
          error={error}
          submitLabel="Simpan Perubahan Diskon"
          onCancel={() => router.push("/admin/diskon")}
        />
      </div>
    </div>
  );
}