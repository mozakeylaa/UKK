"use client";

import { useState, useEffect, FormEvent } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export interface AdminProfileData {
  nama_coworking: string;
  nama_pemilik: string;
  telp: string;
}

interface AdminProfileFormProps {
  initialData: AdminProfileData;
  onSubmit: (data: AdminProfileData) => void;
  isSubmitting: boolean;
  submitError: string | null;
  successMessage: string | null;
}

export default function AdminProfileForm({
  initialData,
  onSubmit,
  isSubmitting,
  submitError,
  successMessage,
}: AdminProfileFormProps) {
  const [namaCoworking, setNamaCoworking] = useState(initialData.nama_coworking);
  const [namaPemilik, setNamaPemilik] = useState(initialData.nama_pemilik);
  const [telp, setTelp] = useState(initialData.telp);
  const [errors, setErrors] = useState<{
    nama_coworking?: string;
    nama_pemilik?: string;
    telp?: string;
  }>({});

  useEffect(() => {
    setNamaCoworking(initialData.nama_coworking);
    setNamaPemilik(initialData.nama_pemilik);
    setTelp(initialData.telp);
  }, [initialData]);

  function validate(): boolean {
    const newErrors: typeof errors = {};
    if (!namaCoworking.trim()) newErrors.nama_coworking = "Nama coworking wajib diisi";
    if (!namaPemilik.trim()) newErrors.nama_pemilik = "Nama pemilik wajib diisi";
    if (!telp.trim()) newErrors.telp = "No telp wajib diisi";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      nama_coworking: namaCoworking,
      nama_pemilik: namaPemilik,
      telp,
    });
  }

  return (
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
  );
}
