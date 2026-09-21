"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, UserPlus } from "lucide-react";
import { createAdminMember } from "@/lib/api/admin-members";
import { isApiSuccess } from "@/lib/types/api";
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
      setError("Gagal membuat member baru. Silakan coba lagi.");
    } finally {
      setSubmitting(false);
    }
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
            Tambah Member Baru
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Buat data profil akun member baru untuk akses reservasi coworking.
          </p>
        </div>

        <div className="hidden sm:flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EEEFFF] text-[#6367FF]">
          <UserPlus size={22} />
        </div>
      </div>

      {/* Form Container */}
      <div className="rounded-3xl bg-white p-6 sm:p-8 border border-slate-100 shadow-xl shadow-slate-900/5">
        <MemberForm
          onSubmit={handleSubmit}
          submitting={submitting}
          error={error}
          onCancel={() => router.push("/admin/members")}
        />
      </div>
    </div>
  );
}