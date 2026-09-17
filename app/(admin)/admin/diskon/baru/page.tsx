"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createAdminDiskon } from "@/lib/api/admin-diskon";
import { isApiSuccess } from "@/lib/types/api";
import type { CreateDiskonPayload } from "@/lib/types/reservasi";
import Button from "@/components/ui/Button";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import Input from "@/components/ui/Input";

export default function TambahDiskonPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateDiskonPayload>({
    nama_diskon: "",
    persentase_diskon: 0,
    tanggal_awal: "",
    tanggal_akhir: "",
  });

  function validate(): string | null {
    if (formData.persentase_diskon < 1 || formData.persentase_diskon > 100) {
      return "Persentase diskon harus antara 1-100";
    }
    if (!formData.tanggal_awal || !formData.tanggal_akhir) {
      return "Tanggal awal dan akhir wajib diisi";
    }
    if (new Date(formData.tanggal_akhir) < new Date(formData.tanggal_awal)) {
      return "Tanggal akhir tidak boleh sebelum tanggal awal";
    }
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

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
    } catch (err) {
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

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Nama Diskon"
            name="nama_diskon"
            value={formData.nama_diskon}
            onChange={(e) =>
              setFormData({ ...formData, nama_diskon: e.target.value })
            }
            placeholder="Misal: PROMO17AGUSTUS"
            required
          />

          <Input
            label="Persentase Diskon (%)"
            name="persentase_diskon"
            type="number"
            min="1"
            max="100"
            value={formData.persentase_diskon}
            onChange={(e) =>
              setFormData({
                ...formData,
                persentase_diskon: parseInt(e.target.value) || 0,
              })
            }
            hint="Nilai antara 1-100"
            required
          />

          <Input
            label="Tanggal Awal"
            name="tanggal_awal"
            type="date"
            value={formData.tanggal_awal}
            onChange={(e) =>
              setFormData({ ...formData, tanggal_awal: e.target.value })
            }
            required
          />

          <Input
            label="Tanggal Akhir"
            name="tanggal_akhir"
            type="date"
            value={formData.tanggal_akhir}
            onChange={(e) =>
              setFormData({ ...formData, tanggal_akhir: e.target.value })
            }
            required
          />

          {error && (
            <div className="rounded-md bg-status-cancelled/10 p-3 text-sm text-status-cancelled">
              {error}
            </div>
          )}

          <div className="flex gap-2">
            <Button type="button" variant="ghost" onClick={() => router.back()}>
              Batal
            </Button>
            <Button type="submit" isLoading={submitting}>
              Buat Diskon
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}