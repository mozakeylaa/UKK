"use client";

import { useRef, useState } from "react";
import { Camera, Loader2, Trash2, CheckCircle2, AlertCircle } from "lucide-react";
import { uploadFile } from "@/lib/api/upload";
import { isApiSuccess } from "@/lib/types/api";
import { useAuth } from "@/lib/context/AuthContext";
import {
  getImageUrl,
  getAdminAvatarUrl,
  getStoredAdminAvatar,
  setStoredAdminAvatar,
  removeStoredAdminAvatar,
} from "@/lib/utils/format";

interface AdminAvatarCardProps {
  namaPemilik: string;
  namaCoworking: string;
}

export default function AdminAvatarCard({
  namaPemilik,
  namaCoworking,
}: AdminAvatarCardProps) {
  const { user, updateUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const adminId = user?.id;
  const storedAvatar = getStoredAdminAvatar(adminId);
  const currentPhoto = user?.foto || storedAvatar || null;

  // Selesaikan URL gambar tampilan
  const resolvedPhotoUrl = currentPhoto
    ? getImageUrl(currentPhoto, "members")
    : getAdminAvatarUrl({
        id: adminId,
        foto: null,
        nama_member: namaPemilik || user?.nama,
        username: user?.username,
      });

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setStatusMessage({
        type: "error",
        text: "Hanya file gambar (JPG, PNG, WEBP) yang diperbolehkan.",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setStatusMessage({
        type: "error",
        text: "Ukuran gambar terlalu besar (maksimal 5MB).",
      });
      return;
    }

    setIsUploading(true);
    setStatusMessage(null);
    setImgFailed(false);

    try {
      // 1. Coba unggah ke backend upload endpoint
      const uploadRes = await uploadFile(file, "members");
      let savedIdentifier = "";

      if (isApiSuccess(uploadRes) && uploadRes.data?.filename) {
        savedIdentifier = uploadRes.data.filename;
      } else {
        // Fallback jika API upload offline / limit: konversi ke base64 data URL
        savedIdentifier = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      }

      // 2. Simpan secara persisten untuk Admin ID ini
      if (adminId) {
        setStoredAdminAvatar(adminId, savedIdentifier);
      }
      updateUser({ foto: savedIdentifier });

      setStatusMessage({
        type: "success",
        text: "Foto profil admin berhasil diperbarui!",
      });
    } catch {
      // Robust client fallback
      try {
        const dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        if (adminId) {
          setStoredAdminAvatar(adminId, dataUrl);
        }
        updateUser({ foto: dataUrl });
        setStatusMessage({
          type: "success",
          text: "Foto profil admin berhasil diperbarui!",
        });
      } catch {
        setStatusMessage({
          type: "error",
          text: "Gagal memproses foto. Silakan coba lagi.",
        });
      }
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  function handleResetAvatar() {
    if (!adminId) return;
    removeStoredAdminAvatar(adminId);
    updateUser({ foto: null });
    setImgFailed(false);
    setStatusMessage({
      type: "success",
      text: "Foto profil dikembalikan ke avatar default bawaan.",
    });
  }

  return (
    <div className="flex flex-col gap-3 rounded-3xl bg-white p-6 sm:p-7 border border-slate-100 shadow-xl shadow-slate-900/5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Avatar & Identitas */}
        <div className="flex items-center gap-5">
          <div className="relative group shrink-0">
            <div className="relative h-20 w-20 sm:h-24 sm:w-24 overflow-hidden rounded-3xl border-2 border-white shadow-md shadow-slate-900/10 ring-2 ring-slate-100 transition-transform group-hover:scale-105">
              {resolvedPhotoUrl && !imgFailed ? (
                <img
                  src={resolvedPhotoUrl}
                  alt={namaPemilik || "Admin"}
                  className="h-full w-full object-cover"
                  onError={() => setImgFailed(true)}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#6367FF] to-[#8494FF] font-display text-2xl font-bold text-white">
                  {(namaPemilik || user?.nama || "A").charAt(0).toUpperCase()}
                </div>
              )}

              {/* Overlay saat mengunggah */}
              {isUploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-xs">
                  <Loader2 className="h-7 w-7 animate-spin text-white" />
                </div>
              )}
            </div>

            {/* Tombol Ubah Foto Kamera */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              title="Unggah Foto Profil Baru"
              className="absolute -bottom-1.5 -right-1.5 flex h-9 w-9 items-center justify-center rounded-2xl bg-[#6367FF] text-white shadow-lg shadow-[#6367FF]/35 ring-2 ring-white hover:bg-[#4A4FE0] hover:scale-110 active:scale-95 transition-all cursor-pointer disabled:opacity-60"
            >
              {isUploading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Camera size={16} />
              )}
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-display text-lg sm:text-xl font-bold text-slate-900 truncate">
                {namaPemilik || user?.nama || "Pengelola Coworking"}
              </h2>
              <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-0.5 text-[11px] font-semibold text-indigo-700 ring-1 ring-inset ring-indigo-700/10">
                Admin Space
              </span>
            </div>
            <p className="text-xs font-semibold text-[#6367FF] mt-0.5">
              @{user?.username || "admin"}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Gedung: <span className="font-medium text-slate-700">{namaCoworking || "Coworking Space"}</span>
            </p>
            <p className="mt-1 text-[11px] text-slate-400">
              Format JPG, PNG, atau WEBP. Maksimal 5MB.
            </p>
          </div>
        </div>

        {/* Action Button: Reset foto jika ada foto kustom */}
        {currentPhoto && (
          <div className="sm:self-center">
            <button
              type="button"
              onClick={handleResetAvatar}
              disabled={isUploading}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-colors cursor-pointer"
            >
              <Trash2 size={13} />
              Reset Avatar
            </button>
          </div>
        )}
      </div>

      {/* Alert Status Feedback */}
      {statusMessage && (
        <div
          className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-medium ${
            statusMessage.type === "success"
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-rose-50 text-rose-700 border border-rose-200"
          }`}
        >
          {statusMessage.type === "success" ? (
            <CheckCircle2 size={15} className="shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle size={15} className="shrink-0 text-rose-600" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}
    </div>
  );
}
