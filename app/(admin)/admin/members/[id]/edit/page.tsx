"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getAdminMemberDetail, updateAdminMember } from "@/lib/api/admin-members";
import { isApiSuccess } from "@/lib/types/api";
import type { Member, UpdateMemberPayload } from "@/lib/types/member";
import Button from "@/components/ui/Button";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import ImageUpload from "@/components/ui/ImageUpload";
import Input from "@/components/ui/Input";
import Spinner from "@/components/ui/Spinner";

export default function EditMemberPage() {
  const params = useParams();
  const router = useRouter();
  const memberId = Number(params.id);

  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [formData, setFormData] = useState<UpdateMemberPayload>({
    username: "",
    nama_member: "",
    instansi: "",
    alamat: "",
    telp: "",
    foto: undefined,
  });

  useEffect(() => {
    async function fetchMember() {
      try {
        const res = await getAdminMemberDetail(memberId);
        if (isApiSuccess(res)) {
          setMember(res.data);
          setFormData({
            username: res.data.username,
            nama_member: res.data.nama_member,
            instansi: res.data.instansi,
            alamat: res.data.alamat,
            telp: res.data.telp,
            foto: res.data.foto || undefined,
          });
        } else {
          setError(res.message);
        }
      } catch (err) {
        setError("Gagal memuat data member");
      } finally {
        setLoading(false);
      }
    }

    fetchMember();
  }, [memberId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const payload: UpdateMemberPayload = { ...formData };
    if (newPassword.trim()) {
      payload.password = newPassword;
    }

    try {
      const res = await updateAdminMember(memberId, payload);
      if (isApiSuccess(res)) {
        router.push("/admin/members");
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError("Gagal memperbarui member");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <Spinner label="Memuat data member..." />;
  if (!member) return <div className="text-center text-ink-600">Member tidak ditemukan</div>;

  return (
    <div className="mx-auto max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Edit Member: {member.nama_member}</CardTitle>
        </CardHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Username"
            name="username"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            required
          />

          <Input
            label="Reset Password (opsional)"
            name="password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Kosongkan jika tidak ingin mengubah"
            minLength={6}
            hint="Isi hanya jika ingin mereset password member"
          />

          <Input
            label="Nama Lengkap"
            name="nama_member"
            value={formData.nama_member}
            onChange={(e) => setFormData({ ...formData, nama_member: e.target.value })}
            required
          />

          <Input
            label="Instansi"
            name="instansi"
            value={formData.instansi}
            onChange={(e) => setFormData({ ...formData, instansi: e.target.value })}
            required
          />

          <Input
            label="Alamat"
            name="alamat"
            value={formData.alamat}
            onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
            required
          />

          <Input
            label="Nomor Telepon"
            name="telp"
            type="tel"
            value={formData.telp}
            onChange={(e) => setFormData({ ...formData, telp: e.target.value })}
            required
          />

          <ImageUpload
            target="members"
            value={formData.foto || undefined}
            onUploaded={(filename) => setFormData({ ...formData, foto: filename })}
            label="Foto Member"
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
              Simpan Perubahan
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}