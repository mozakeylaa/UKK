"use client";

import { useRef, useState, useEffect } from "react";
import { uploadFile, UploadTarget } from "@/lib/api/upload";
import { isApiSuccess } from "@/lib/types/api";
import { getImageUrl } from "@/lib/utils/format";
import Button from "@/components/ui/Button";

interface ImageUploadProps {
  target: UploadTarget;
  value?: string;
  onUploaded: (filename: string) => void;
  label?: string;
}

function ImageUpload({ target, value, onUploaded, label = "Foto" }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | undefined>(() =>
    value ? (getImageUrl(value, target) || value) : undefined
  );
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (value) {
      setPreview(getImageUrl(value, target) || value);
    }
  }, [value, target]);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setIsUploading(true);
    setPreview(URL.createObjectURL(file));

    try {
      const res = await uploadFile(file, target);
      if (isApiSuccess(res)) {
        // Ambil nama file atau url foto
        const savedName = res.data.filename || res.data.url || res.data.foto_url;
        if (savedName) {
          onUploaded(savedName);
        }
      } else {
        setError(res.message);
      }
    } catch {
      setError("Gagal mengunggah file. Coba lagi.");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-ink-950">{label}</span>
      <div className="flex items-center gap-3">
        {preview ? (
          <img
            src={preview}
            alt="Preview"
            className="h-16 w-16 rounded-md border border-surface-200 object-cover"
            onError={() => setPreview(undefined)}
          />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-md border border-dashed border-surface-200 text-xs text-ink-600">
            Kosong
          </div>
        )}
        <Button
          type="button"
          variant="outline"
          size="sm"
          isLoading={isUploading}
          onClick={() => inputRef.current?.click()}
        >
          {isUploading ? "Mengunggah..." : preview ? "Ganti foto" : "Unggah foto"}
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
      {error && <p className="text-xs text-status-cancelled">{error}</p>}
    </div>
  );
}

export default ImageUpload;