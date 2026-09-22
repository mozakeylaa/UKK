import { RefObject } from "react";
import { Camera, Loader2 } from "lucide-react";

interface ProfileAvatarCardProps {
  photoUrl: string | null;
  namaMember: string;
  username: string;
  isEditing: boolean;
  isUploading: boolean;
  imgFailed: boolean;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onImgError: () => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ProfileAvatarCard({
  photoUrl,
  namaMember,
  username,
  isEditing,
  isUploading,
  imgFailed,
  fileInputRef,
  onImgError,
  onFileChange,
}: ProfileAvatarCardProps) {
  return (
    <div className="flex items-center gap-5">
      <div className="relative group">
        <div className="relative h-20 w-20 overflow-hidden rounded-3xl border-2 border-white shadow-md shadow-slate-900/10 ring-2 ring-slate-100 transition-transform group-hover:scale-105">
          {photoUrl && !imgFailed ? (
            <img
              src={photoUrl}
              alt={namaMember}
              className="h-full w-full object-cover"
              onError={onImgError}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#6367FF] to-[#8494FF] font-display text-2xl font-bold text-white">
              {(namaMember || "M").charAt(0).toUpperCase()}
            </div>
          )}

          {/* Overlay saat mengunggah */}
          {isUploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-xs">
              <Loader2 className="h-6 w-6 animate-spin text-white" />
            </div>
          )}
        </div>

        {/* Tombol Ubah Foto Kamera */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          title="Ubah Foto Profil"
          className="absolute -bottom-1.5 -right-1.5 flex h-8 w-8 items-center justify-center rounded-2xl bg-[#6367FF] text-white shadow-md shadow-[#6367FF]/30 ring-2 ring-white hover:bg-[#4A4FE0] hover:scale-110 active:scale-95 transition-all cursor-pointer disabled:opacity-60"
        >
          {isUploading ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Camera size={14} />
          )}
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onFileChange}
      />

      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <h2 className="font-display text-xl font-bold text-slate-900 truncate">
            {namaMember}
          </h2>
        </div>
        <p className="text-xs font-semibold text-[#6367FF]">@{username}</p>
        <p className="mt-1 text-[11px] text-slate-400">
          Klik tombol kamera untuk mengganti foto profil
        </p>
      </div>
    </div>
  );
}
