"use client";

import { useEffect, useState } from "react";
import { Building2, ShieldCheck, AlertTriangle } from "lucide-react";
import { getAdminProfile, updateAdminProfile } from "@/lib/api/admin-profile";
import { isApiSuccess } from "@/lib/types/api";
import Spinner from "@/components/ui/Spinner";
import AdminProfileForm, {
  AdminProfileData,
} from "@/components/admin/profil/AdminProfileForm";
import AdminAvatarCard from "@/components/admin/profil/AdminAvatarCard";

export default function AdminProfilPage() {
  const [profileData, setProfileData] = useState<AdminProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    getAdminProfile().then((res) => {
      if (isApiSuccess(res)) {
        setProfileData({
          nama_coworking: res.data.nama_coworking ?? "",
          nama_pemilik: res.data.nama_pemilik ?? "",
          telp: res.data.telp ?? "",
        });
      } else {
        setLoadError(res.message);
      }
      setIsLoading(false);
    });
  }, []);

  async function handleSubmit(data: AdminProfileData) {
    setSubmitError(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    try {
      const res = await updateAdminProfile(data);
      if (isApiSuccess(res)) {
        setSuccessMessage("Profil coworking space berhasil diperbarui.");
        setProfileData(data);
      } else {
        setSubmitError(res.message);
      }
    } catch {
      setSubmitError("Terjadi kesalahan sistem saat memperbarui profil. Coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <Spinner label="Memuat profil coworking space..." />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl flex flex-col gap-6 pb-12">
      {/* Header Info */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            Profil Pengelola & Lokasi
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Kelola foto profil akun pengelola, nama coworking space, dan nomor kontak resmi.
          </p>
        </div>

        <div className="hidden sm:flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FF8FC2] to-[#FF5DA2] text-white shadow-md shadow-[#FF5DA2]/25">
          <Building2 size={22} />
        </div>
      </div>

      {/* Error State */}
      {loadError && (
        <div className="flex items-center gap-3 rounded-2xl bg-rose-50 border border-rose-200 p-4 text-xs font-medium text-rose-600">
          <AlertTriangle size={18} className="shrink-0" />
          <span>{loadError}</span>
        </div>
      )}

      {/* Avatar & Identitas Admin Card */}
      {profileData && (
        <AdminAvatarCard
          namaPemilik={profileData.nama_pemilik}
          namaCoworking={profileData.nama_coworking}
        />
      )}

      {/* Main Profile Form Card */}
      {profileData && (
        <div className="rounded-3xl bg-white p-6 sm:p-8 border border-slate-100 shadow-xl shadow-slate-900/5">
          <div className="mb-5 pb-4 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900">
              Informasi Coworking Space
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Data usaha dan kontak yang ditampilkan pada tiket digital member.
            </p>
          </div>
          <AdminProfileForm
            initialData={profileData}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            submitError={submitError}
            successMessage={successMessage}
          />
        </div>
      )}

      {/* Info Badge Keamanan */}
      <div className="flex items-center gap-3 rounded-2xl bg-white p-4 border border-slate-100 shadow-sm text-xs text-slate-500">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
          <ShieldCheck size={16} />
        </div>
        <p className="leading-relaxed">
          Nama coworking space dan nomor kontak akan otomatis tertera pada tiket reservasi digital member.
        </p>
      </div>
    </div>
  );
}