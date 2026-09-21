"use client";

import { useEffect, useState, useRef } from "react";
import { getProfile } from "@/lib/api/auth";
import { uploadFile } from "@/lib/api/upload";
import apiClient from "@/lib/api/client";
import { isApiSuccess } from "@/lib/types/api";
import { useAuth } from "@/lib/context/AuthContext";
import type { ProfileData } from "@/lib/types/auth";
import { getImageUrl } from "@/lib/utils/format";
import { Card } from "@/components/ui/Card";
import Spinner from "@/components/ui/Spinner";
import EmptyState from "@/components/ui/EmptyState";
import ProfileAvatarCard from "@/components/member/profile/ProfileAvatarCard";
import ProfileDetailView from "@/components/member/profile/ProfileDetailView";
import ProfileEditForm from "@/components/member/profile/ProfileEditForm";

export default function MemberAkunPage() {
  const { logout } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);

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
        setEditForm({
          nama_member: res.data.member.nama_member || "",
          instansi: res.data.member.instansi || "",
          alamat: res.data.member.alamat || "",
          telp: res.data.member.telp || res.data.member.no_telepon || "",
          foto: res.data.member.foto || res.data.member.foto_profil || "",
        });
      }
    } else {
      setError(res.message);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    fetchProfileData();
  }, []);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const res = await uploadFile(file, "members");
      if (isApiSuccess(res)) {
        const uploadedName = res.data.filename || res.data.foto_url;
        setEditForm((prev) => ({ ...prev, foto: uploadedName || "" }));
        setImgFailed(false);
      } else {
        alert(res.message || "Gagal mengunggah foto.");
      }
    } catch {
      alert("Gagal mengunggah foto.");
    } finally {
      setIsUploading(false);
    }
  }

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!profile?.member?.id) return;

    setIsSaving(true);
    const memberId = profile.member.id;

    const payload = {
      nama_member: editForm.nama_member,
      instansi: editForm.instansi,
      alamat: editForm.alamat,
      telp: editForm.telp,
      no_telepon: editForm.telp,
      foto: editForm.foto,
      foto_profil: editForm.foto,
    };

    try {
      let success = false;
      try {
        const res = await apiClient.put(`/api/members/${memberId}`, payload);
        if (res.status === 200 || res.data?.status) success = true;
      } catch {
        const resFallback = await apiClient.put(`/api/admin/members/${memberId}`, payload);
        if (resFallback.status === 200 || resFallback.data?.status) success = true;
      }

      if (success) {
        await fetchProfileData();
        setIsEditing(false);
      } else {
        alert("Gagal memperbarui profil.");
      }
    } catch (err: any) {
      alert(err?.response?.data?.message || err?.message || "Gagal memperbarui data member.");
    } finally {
      setIsSaving(false);
    }
  }

  function handleFormChange(field: string, value: string) {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  }

  if (isLoading) return <Spinner label="Memuat profil..." />;
  if (error || !profile?.member) {
    return <EmptyState title="Gagal memuat profil" description={error ?? "Data tidak ditemukan."} />;
  }

  const member = profile.member;
  const currentPhoto = isEditing ? editForm.foto : (member.foto || member.foto_profil || member.foto_url);
  const photoUrl = getImageUrl(currentPhoto, "members");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink-950">Akun Saya</h1>
        <p className="mt-1 text-sm text-ink-600">Informasi profil member kamu.</p>
      </div>

      <Card className="max-w-lg shadow-sm">
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

        {isEditing ? (
          <ProfileEditForm
            editForm={editForm}
            isSaving={isSaving}
            onChangeForm={handleFormChange}
            onSubmit={handleSaveProfile}
            onCancel={() => setIsEditing(false)}
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
      </Card>
    </div>
  );
}