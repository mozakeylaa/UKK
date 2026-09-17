"use client";

import { useEffect, useState, useRef } from "react";
import { getProfile } from "@/lib/api/auth";
import { uploadFile } from "@/lib/api/upload";
import apiClient from "@/lib/api/client";
import { isApiSuccess } from "@/lib/types/api";
import { useAuth } from "@/lib/context/AuthContext";
import type { ProfileData } from "@/lib/types/auth";
import { Card } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Spinner from "@/components/ui/Spinner";
import EmptyState from "@/components/ui/EmptyState";

function getPhotoUrl(fotoName?: string | null): string | null {
  if (!fotoName) return null;
  if (fotoName.startsWith("http://") || fotoName.startsWith("https://") || fotoName.startsWith("data:")) {
    return fotoName;
  }
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const clean = fotoName.replace(/^\/+/, "");
  if (clean.startsWith("uploads/")) {
    return `${baseUrl}/${clean}`;
  }
  return `${baseUrl}/uploads/members/${clean}`;
}

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
      // 1. Coba endpoint anggota langsung: /api/members/:id
      let success = false;
      try {
        const res = await apiClient.put(`/api/members/${memberId}`, payload);
        if (res.status === 200 || res.data?.status) success = true;
      } catch {
        // 2. Jika 404, gunakan route /api/admin/members/:id yang ada di admin-members.ts
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

  if (isLoading) return <Spinner label="Memuat profil..." />;
  if (error || !profile?.member) {
    return <EmptyState title="Gagal memuat profil" description={error ?? "Data tidak ditemukan."} />;
  }

  const member = profile.member;
  const currentPhoto = isEditing ? editForm.foto : (member.foto || member.foto_profil || member.foto_url);
  const photoUrl = getPhotoUrl(currentPhoto);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink-950">Akun Saya</h1>
        <p className="mt-1 text-sm text-ink-600">Informasi profil member kamu.</p>
      </div>

      <Card className="max-w-lg shadow-sm">
        <div className="flex items-center gap-4">
          <div className="relative">
            {photoUrl && !imgFailed ? (
              <img
                src={photoUrl}
                alt={member.nama_member}
                className="h-16 w-16 rounded-full border border-surface-200 object-cover shadow-sm"
                onError={() => setImgFailed(true)}
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 font-display text-lg font-semibold text-brand-600">
                {(editForm.nama_member || member.nama_member || "M").charAt(0).toUpperCase()}
              </div>
            )}

            {isEditing && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="absolute -bottom-1 -right-1 rounded-full bg-brand-600 px-2 py-1 text-[10px] font-medium text-white shadow hover:bg-brand-700"
              >
                {isUploading ? "..." : "Ubah"}
              </button>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />

          <div>
            <p className="font-display text-lg font-semibold text-ink-950">
              {isEditing ? editForm.nama_member : member.nama_member}
            </p>
            <p className="text-sm text-ink-600">@{profile.username}</p>
          </div>
        </div>

        {isEditing ? (
          <form onSubmit={handleSaveProfile} className="mt-6 flex flex-col gap-4 border-t border-surface-200 pt-4">
            <Input
              label="Nama Lengkap"
              value={editForm.nama_member}
              onChange={(e) => setEditForm({ ...editForm, nama_member: e.target.value })}
              required
            />
            <Input
              label="Instansi"
              value={editForm.instansi}
              onChange={(e) => setEditForm({ ...editForm, instansi: e.target.value })}
            />
            <Input
              label="Alamat"
              value={editForm.alamat}
              onChange={(e) => setEditForm({ ...editForm, alamat: e.target.value })}
              required
            />
            <Input
              label="No Telepon"
              value={editForm.telp}
              onChange={(e) => setEditForm({ ...editForm, telp: e.target.value })}
              required
            />

            <div className="mt-2 flex gap-2">
              <Button type="submit" isLoading={isSaving} className="flex-1">
                Simpan Perubahan
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditing(false)}
                disabled={isSaving}
              >
                Batal
              </Button>
            </div>
          </form>
        ) : (
          <>
            <div className="mt-5 flex flex-col gap-3 border-t border-surface-200 pt-4 text-sm">
              <div className="flex justify-between">
                <span className="text-ink-600">Instansi</span>
                <span className="text-ink-950">{member.instansi || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-600">Alamat</span>
                <span className="text-ink-950">{member.alamat || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-600">No telp</span>
                <span className="text-ink-950">{member.telp || member.no_telepon || "-"}</span>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-2">
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                Edit Profil & Foto
              </Button>
              <Button variant="outline" className="text-status-cancelled hover:bg-red-50" onClick={logout}>
                Keluar
              </Button>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}