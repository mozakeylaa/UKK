"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getAdminMemberDetail, updateAdminMember } from "@/lib/api/admin-members";
import { isApiSuccess } from "@/lib/types/api";
import type { Member, UpdateMemberPayload } from "@/lib/types/member";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import Spinner from "@/components/ui/Spinner";
import EmptyState from "@/components/ui/EmptyState";
import MemberForm, { MemberFormData } from "@/components/admin/members/MemberForm";

export default function EditMemberPage() {
  const params = useParams();
  const router = useRouter();
  const memberId = Number(params.id);

  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMember() {
      try {
        const res = await getAdminMemberDetail(memberId);
        if (isApiSuccess(res)) {
          setMember(res.data);
        } else {
          setError(res.message);
        }
      } catch {
        setError("Gagal memuat data member");
      } finally {
        setLoading(false);
      }
    }

    fetchMember();
  }, [memberId]);

  async function handleSubmit(data: MemberFormData) {
    setSubmitting(true);
    setError(null);

    const payload: UpdateMemberPayload = {
      username: data.username,
      nama_member: data.nama_member,
      instansi: data.instansi,
      alamat: data.alamat,
      telp: data.telp,
      foto: data.foto,
    };
    if (data.password?.trim()) {
      payload.password = data.password;
    }

    try {
      const res = await updateAdminMember(memberId, payload);
      if (isApiSuccess(res)) {
        router.push("/admin/members");
      } else {
        setError(res.message);
      }
    } catch {
      setError("Gagal memperbarui member");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <Spinner label="Memuat data member..." />;
  if (!member) {
    return <EmptyState title="Member tidak ditemukan" description={error ?? "Data tidak tersedia."} />;
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Edit Member: {member.nama_member}</CardTitle>
        </CardHeader>

        <MemberForm
          initialData={{
            username: member.username,
            nama_member: member.nama_member,
            instansi: member.instansi,
            alamat: member.alamat,
            telp: member.telp,
            foto: member.foto || undefined,
          }}
          isEditMode
          onSubmit={handleSubmit}
          submitting={submitting}
          error={error}
          onCancel={() => router.back()}
        />
      </Card>
    </div>
  );
}