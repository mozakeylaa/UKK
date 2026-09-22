"use client";

import { useEffect, useState, useRef } from "react";
import { UserCheck, Shield, AlertTriangle, CheckCircle2 } from "lucide-react";
import { getProfile, updateMemberProfile } from "@/lib/api/auth";
import { uploadFile } from "@/lib/api/upload";
import { isApiSuccess } from "@/lib/types/api";
import { useAuth } from "@/lib/context/AuthContext";
import type { ProfileData } from "@/lib/types/auth";
import { getImageUrl, getMemberAvatarUrl } from "@/lib/utils/format";
import Spinner from "@/components/ui/Spinner";
import ProfileAvatarCard from "@/components/member/profile/ProfileAvatarCard";
import ProfileDetailView from "@/components/member/profile/ProfileDetailView";
import ProfileEditForm from "@/components/member/profile/ProfileEditForm";

function getStoredAvatar(memberId?: number | string): string | null {
  if (typeof window === "undefined" || !memberId) return null;
  try {
    return localStorage.getItem(`coworking_member_avatar_${memberId}`);
  } catch {
    return null;
  }
}

function setStoredAvatar(memberId: number | string | undefined, filename: string) {
  if (typeof window === "undefined" || !memberId || !filename) return;
  try {
    localStorage.setItem(`coworking_member_avatar_${memberId}`, filename);
    // Hapus key global lama jika ada agar tidak mencemari akun lain
    localStorage.removeItem("coworking_member_avatar");
  } catch {
    // Ignore localStorage errors
  }
}

export default function MemberAkunPage() {
  const { user, updateUser, logout } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);
  const [localPreview, setLocalPreview] = useState<string | null>(null);

  const [editForm, setEditForm] = useState({
    nama_member: "",
    instansi: "",
    alamat: "",
    telp: "",
    foto: "",
  });

  async function fetchProfileData() {
    const res = await getProfile();
    if (isApiSuccess(res)) {
      setProfile(res.data);
      if (res.data.member) {
        const storedAvatar = getStoredAvatar(res.data.member.id);
        const initialFoto =
          res.data.member.foto ||
          res.data.member.foto_profil ||
          storedAvatar ||
          "";

        setEditForm({
          nama_member: res.data.member.nama_member || "",
          instansi: res.data.member.instansi || "",
          alamat: res.data.member.alamat || "",
          telp: res.data.member.telp || res.data.member.no_telepon || "",
          foto: initialFoto,
        });

        // Sinkronisasi dengan AuthContext jika ada avatar tersimpan
        if (storedAvatar && (!user?.foto || user.foto !== storedAvatar)) {
          updateUser({ foto: storedAvatar });
        }
      }
    } else {
      setError(res.message);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    try {
      localStorage.removeItem("coworking_member_avatar");
    } catch {
      // ignore
    }
    fetchProfileData();
  }, []);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Tampilkan preview lokal instan
    const previewUrl = URL.createObjectURL(file);
    setLocalPreview(previewUrl);
    setImgFailed(false);
    setIsUploading(true);
    setError(null);

    try {
      const res = await uploadFile(file, "members");
      if (isApiSuccess(res)) {
        const uploadedName = res.data.filename || res.data.foto_url;
        if (uploadedName) {
          setEditForm((prev) => ({ ...prev, foto: uploadedName }));

          // Simpan ke hybrid storage
          if (profile?.member?.id) {
            setStoredAvatar(profile.member.id, uploadedName);
          }
          updateUser({ foto: uploadedName });
          setSuccessMsg("Foto profil berhasil diunggah! Klik 'Simpan Perubahan' untuk memperbarui data.");
          setTimeout(() => setSuccessMsg(null), 5000);
        }
      } else {
        alert(res.message || "Gagal mengunggah foto profil.");
        setLocalPreview(null);
      }
    } catch {
      alert("Gagal mengunggah foto profil. Silakan coba lagi.");
      setLocalPreview(null);
    } finally {
      setIsUploading(false);
    }
  }

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!profile?.member?.id) return;

    setIsSaving(true);
    setError(null);

    try {
      const res = await updateMemberProfile({
        nama_member: editForm.nama_member,
        instansi: editForm.instansi,
        alamat: editForm.alamat,
        telp: editForm.telp,
        foto: editForm.foto,
      });

      if (isApiSuccess(res) || res.status) {
        // Simpan foto ke hybrid persistence
        if (editForm.foto) {
          setStoredAvatar(profile.member.id, editForm.foto);
        }

        // Sinkronisasi state global user di AuthContext
        updateUser({
          nama: editForm.nama_member,
          foto: editForm.foto || undefined,
        });

        setSuccessMsg("Profil berhasil diperbarui!");
        setTimeout(() => setSuccessMsg(null), 4000);

        await fetchProfileData();
        setLocalPreview(null);
        setIsEditing(false);
      } else {
        alert(res.message || "Gagal memperbarui profil.");
      }
    } catch (err: any) {
      alert(err?.message || "Gagal memperbarui data profil.");
    } finally {
      setIsSaving(false);
    }
  }

  function handleFormChange(field: string, value: string) {
    setEditForm((prev) => ({ ...prev, [field]: value }));
    if (field === "foto" && value) {
      setImgFailed(false);
      if (profile?.member?.id) {
        setStoredAvatar(profile.member.id, value);
      }
      updateUser({ foto: value });
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <Spinner label="Memuat informasi akun..." />
      </div>
    );
  }

  if (error || !profile?.member) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center justify-center rounded-3xl bg-white p-12 text-center border border-rose-100 shadow-sm">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
          <AlertTriangle size={28} />
        </div>
        <h2 className="mt-4 font-display text-lg font-bold text-slate-900">Gagal Memuat Profil</h2>
        <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-sm">
          {error ?? "Data member tidak ditemukan. Silakan masuk kembali."}
        </p>
      </div>
    );
  }

  const member = profile.member;
  const storedAvatar = getStoredAvatar(member.id);

  // Prioritas foto: local preview > editForm.foto saat editing > member.foto > stored avatar
  const currentPhoto = isEditing
    ? editForm.foto || storedAvatar
    : member.foto || member.foto_profil || member.foto_url || storedAvatar;

  const photoUrl =
    localPreview ||
    getImageUrl(currentPhoto, "members") ||
    getMemberAvatarUrl(member);

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            Akun Saya
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Kelola data profil pribadi, foto, instansi, dan kontak terhubung.
          </p>
        </div>

        <div className="inline-flex items-center gap-1.5 self-start rounded-full bg-[#EEEFFF] px-3.5 py-1.5 text-xs font-bold text-[#6367FF]">
          <UserCheck size={14} />
          Member Terverifikasi
        </div>
      </div>

      {/* Success Notification */}
      {successMsg && (
        <div className="max-w-xl flex items-center gap-3 rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-xs font-semibold text-emerald-700 shadow-xs">
          <CheckCircle2 size={18} className="shrink-0 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Main Profile Card */}
      <div className="max-w-xl rounded-3xl bg-white p-6 sm:p-8 border border-slate-100 shadow-xl shadow-slate-900/5">
        <ProfileAvatarCard
          photoUrl={photoUrl}
          namaMember={isEditing ? editForm.nama_member : member.nama_member}
          username={profile.username}
          isEditing={isEditing}
          isUploading={isUploading}
          imgFailed={imgFailed}
          fileInputRef={fileInputRef}
          onImgError={() => setImgFailed(true)}
          onFileChange={handleFileChange}
        />

        <div className="mt-6 pt-6 border-t border-slate-100">
          {isEditing ? (
            <ProfileEditForm
              editForm={editForm}
              isSaving={isSaving}
              onChangeForm={handleFormChange}
              onSubmit={handleSaveProfile}
              onCancel={() => {
                setLocalPreview(null);
                setIsEditing(false);
              }}
            />
          ) : (
            <ProfileDetailView
              instansi={member.instansi}
              alamat={member.alamat}
              telp={member.telp || member.no_telepon}
              onEdit={() => setIsEditing(true)}
              onLogout={logout}
            />
          )}
        </div>
      </div>

      {/* Keamanan Akun Badge */}
      <div className="max-w-xl flex items-center gap-3 rounded-2xl bg-white p-4 border border-slate-100 shadow-sm text-xs text-slate-500">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
          <Shield size={16} />
        </div>
        <p className="leading-relaxed">
          Data privasi kamu terlindungi dengan enkripsi standar industri. Informasi kontak hanya digunakan untuk keperluan konfirmasi reservasi ruang.
        </p>
      </div>
    </div>
  );
}