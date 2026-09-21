"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createAdminDiskon } from "@/lib/api/admin-diskon";
import { isApiSuccess } from "@/lib/types/api";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
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
      setError("Gagal membuat diskon");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Tambah Diskon Baru</CardTitle>
        </CardHeader>

        <DiskonForm
          onSubmit={handleSubmit}
          submitting={submitting}
          error={error}
          submitLabel="Buat Diskon"
          onCancel={() => router.back()}
        />
      </Card>
    </div>
  );
}