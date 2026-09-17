"use client";

import { useEffect, useState, FormEvent } from "react";
import { getAdminProfile, updateAdminProfile } from "@/lib/api/admin-profile";
import { isApiSuccess } from "@/lib/types/api";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import Spinner from "@/components/ui/Spinner";

export default function AdminProfilPage() {
  const [namaCoworking, setNamaCoworking] = useState("");
  const [namaPemilik, setNamaPemilik] = useState("");
  const [telp, setTelp] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ nama_coworking?: string; nama_pemilik?: string; telp?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    getAdminProfile().then((res) => {
      if (isApiSuccess(res)) {
        setNamaCoworking(res.data.nama_coworking ?? "");
        setNamaPemilik(res.data.nama_pemilik ?? "");
        setTelp(res.data.telp ?? "");
      } else {
        setLoadError(res.message);
      }
      setIsLoading(false);
    });
  }, []);

  function validate(): boolean {
    const newErrors: typeof errors = {};
    if (!namaCoworking.trim()) newErrors.nama_coworking = "Nama coworking wajib diisi";
    if (!namaPemilik.trim()) newErrors.nama_pemilik = "Nama pemilik wajib diisi";
    if (!telp.trim()) newErrors.telp = "No telp wajib diisi";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitError(null);
    setSuccessMessage(null);
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const res = await updateAdminProfile({
        nama_coworking: namaCoworking,
        nama_pemilik: namaPemilik,
        telp,
      });
      if (isApiSuccess(res)) {
        setSuccessMessage("Profil berhasil diperbarui.");
      } else {
        setSubmitError(res.message);
      }
    } catch {
      setSubmitError("Terjadi kesalahan. Coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) return <Spinner label="Memuat profil..." />;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink-950">Profil Lokasi</h1>
        <p className="mt-1 text-sm text-ink-600">Kelola informasi coworking space kamu.</p>
      </div>

      <Card className="max-w-lg">
        {loadError && <p className="mb-4 text-sm text-status-cancelled">{loadError}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Nama coworking"
            value={namaCoworking}
            onChange={(e) => setNamaCoworking(e.target.value)}
            error={errors.nama_coworking}
          />
          <Input
            label="Nama pemilik"
            value={namaPemilik}
            onChange={(e) => setNamaPemilik(e.target.value)}
            error={errors.nama_pemilik}
          />
          <Input
            label="No telp"
            value={telp}
            onChange={(e) => setTelp(e.target.value)}
            error={errors.telp}
          />

          {submitError && <p className="text-sm text-status-cancelled">{submitError}</p>}
          {successMessage && <p className="text-sm text-status-active">{successMessage}</p>}

          <Button type="submit" isLoading={isSubmitting} className="mt-2 w-fit">
            Simpan Perubahan
          </Button>
        </form>
      </Card>
    </div>
  );
}