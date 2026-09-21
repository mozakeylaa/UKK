"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createAdminSpace } from "@/lib/api/admin-spaces";
import { isApiSuccess } from "@/lib/types/api";
import { Card } from "@/components/ui/Card";
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
      setServerError("Terjadi kesalahan. Coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink-950">Tambah Space</h1>
        <p className="mt-1 text-sm text-ink-600">Isi detail ruangan/meja baru.</p>
      </div>

      <Card className="max-w-lg">
        <SpaceForm
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          serverError={serverError}
          submitLabel="Simpan Space"
        />
      </Card>
    </div>
  );
}