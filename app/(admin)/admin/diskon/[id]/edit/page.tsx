"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getAdminDiskonDetail, updateAdminDiskon } from "@/lib/api/admin-diskon";
import { isApiSuccess } from "@/lib/types/api";
import type { Diskon } from "@/lib/types/reservasi";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import Spinner from "@/components/ui/Spinner";
import EmptyState from "@/components/ui/EmptyState";
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
        setError("Gagal memuat data diskon");
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
      setError("Gagal memperbarui diskon");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <Spinner label="Memuat data diskon..." />;
  if (!diskon) {
    return <EmptyState title="Diskon tidak ditemukan" description={error ?? "Data tidak tersedia."} />;
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Edit Diskon: {diskon.nama_diskon}</CardTitle>
        </CardHeader>

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
          submitLabel="Simpan Perubahan"
          onCancel={() => router.back()}
        />
      </Card>
    </div>
  );
}