import { RefObject } from "react";

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
    <div className="flex items-center gap-4">
      <div className="relative">
        {photoUrl && !imgFailed ? (
          <img
            src={photoUrl}
            alt={namaMember}
            className="h-16 w-16 rounded-full border border-surface-200 object-cover shadow-sm"
            onError={onImgError}
          />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 font-display text-lg font-semibold text-brand-600">
            {(namaMember || "M").charAt(0).toUpperCase()}
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
        onChange={onFileChange}
      />

      <div>
        <p className="font-display text-lg font-semibold text-ink-950">
          {namaMember}
        </p>
        <p className="text-sm text-ink-600">@{username}</p>
      </div>
    </div>
  );
}
