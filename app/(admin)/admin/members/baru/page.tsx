"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createAdminMember } from "@/lib/api/admin-members";
import { isApiSuccess } from "@/lib/types/api";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import MemberForm, { MemberFormData } from "@/components/admin/members/MemberForm";

export default function TambahMemberPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(data: MemberFormData) {
    setSubmitting(true);
    setError(null);

    try {
      const res = await createAdminMember({
        username: data.username,
        password: data.password || "",
        nama_member: data.nama_member,
        instansi: data.instansi,
        alamat: data.alamat,
        telp: data.telp,
        foto: data.foto,
      });
      if (isApiSuccess(res)) {
        router.push("/admin/members");
      } else {
        setError(res.message);
      }
    } catch {
      setError("Gagal membuat member");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Tambah Member Baru</CardTitle>
        </CardHeader>

        <MemberForm
          onSubmit={handleSubmit}
          submitting={submitting}
          error={error}
          onCancel={() => router.back()}
        />
      </Card>
    </div>
  );
}