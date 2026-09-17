"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createAdminMember } from "@/lib/api/admin-members";
import { isApiSuccess } from "@/lib/types/api";
import type { CreateMemberPayload } from "@/lib/types/member";
import Button from "@/components/ui/Button";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import ImageUpload from "@/components/ui/ImageUpload";
import Input from "@/components/ui/Input";

export default function TambahMemberPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateMemberPayload>({
    username: "",
    password: "",
    nama_member: "",
    instansi: "",
    alamat: "",
    telp: "",
    foto: undefined,
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await createAdminMember(formData);
      if (isApiSuccess(res)) {
        router.push("/admin/members");
      } else {
        setError(res.message);
      }
    } catch (err) {
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

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Username"
            name="username"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            placeholder="Misal: budi123"
            required
          />

          <Input
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            placeholder="Minimal 6 karakter"
            minLength={6}
            required
          />

          <Input
            label="Nama Lengkap"
            name="nama_member"
            value={formData.nama_member}
            onChange={(e) => setFormData({ ...formData, nama_member: e.target.value })}
            placeholder="Misal: Budi Santoso"
            required
          />

          <Input
            label="Instansi"
            name="instansi"
            value={formData.instansi}
            onChange={(e) => setFormData({ ...formData, instansi: e.target.value })}
            placeholder="Misal: PT Maju Jaya"
            required
          />

          <Input
            label="Alamat"
            name="alamat"
            value={formData.alamat}
            onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
            placeholder="Alamat lengkap"
            required
          />

          <Input
            label="Nomor Telepon"
            name="telp"
            type="tel"
            value={formData.telp}
            onChange={(e) => setFormData({ ...formData, telp: e.target.value })}
            placeholder="Misal: 08123456789"
            required
          />

          <ImageUpload
            target="members"
            onUploaded={(filename) => setFormData({ ...formData, foto: filename })}
            label="Foto Member (opsional)"
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
              Buat Member
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}