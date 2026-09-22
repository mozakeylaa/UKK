"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, UserCog, AlertTriangle } from "lucide-react";
import { getAdminMemberDetail, updateAdminMember } from "@/lib/api/admin-members";
import { isApiSuccess } from "@/lib/types/api";
import { getStoredMemberAvatar, setStoredMemberAvatar } from "@/lib/utils/format";
import type { Member, UpdateMemberPayload } from "@/lib/types/member";
import Spinner from "@/components/ui/Spinner";
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
        if (data.foto) {
          setStoredMemberAvatar(memberId, data.foto);
        }
        router.push("/admin/members");
      } else {
        setError(res.message);
      }
    } catch {
      setError("Gagal memperbarui data member. Silakan coba lagi.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <Spinner label="Memuat data member..." />
      </div>
    );
  }

  if (!member) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center justify-center rounded-3xl bg-white p-12 text-center border border-rose-100 shadow-sm">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
          <AlertTriangle size={28} />
        </div>
        <h2 className="mt-4 font-display text-lg font-bold text-slate-900">Member Tidak Ditemukan</h2>
        <p className="mt-1 text-xs sm:text-sm text-slate-500">
          {error ?? "Data member tidak tersedia atau telah dihapus."}
        </p>
        <Link
          href="/admin/members"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#12132E] px-5 py-2.5 text-xs font-semibold text-white hover:bg-slate-800 transition-colors"
        >
          <ChevronLeft size={16} /> Kembali ke Kelola Member
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl flex flex-col gap-6 pb-12">
      {/* Back Button */}
      <div>
        <Link
          href="/admin/members"
          className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-semibold text-slate-600 border border-slate-200/80 shadow-sm hover:bg-slate-50 hover:text-[#6367FF] transition-all"
        >
          <ChevronLeft size={16} />
          Kembali ke Kelola Member
        </Link>
      </div>

      {/* Header Info */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            Edit Member
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Perbarui data member <span className="font-semibold text-slate-800">"{member.nama_member}"</span> (@{member.username}).
          </p>
        </div>

        <div className="hidden sm:flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EEEFFF] text-[#6367FF]">
          <UserCog size={22} />
        </div>
      </div>

      {/* Form Container */}
      <div className="rounded-3xl bg-white p-6 sm:p-8 border border-slate-100 shadow-xl shadow-slate-900/5">
        <MemberForm
          initialData={{
            username: member.username,
            nama_member: member.nama_member,
            instansi: member.instansi,
            alamat: member.alamat,
            telp: member.telp,
            foto: member.foto || getStoredMemberAvatar(member.id) || undefined,
          }}
          isEditMode
          onSubmit={handleSubmit}
          submitting={submitting}
          error={error}
          onCancel={() => router.push("/admin/members")}
        />
      </div>
    </div>
  );
}