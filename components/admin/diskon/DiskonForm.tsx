"use client";

import { useState, useEffect, FormEvent } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export interface DiskonFormData {
  nama_diskon: string;
  persentase_diskon: number;
  tanggal_awal: string;
  tanggal_akhir: string;
}

interface DiskonFormProps {
  initialData?: Partial<DiskonFormData>;
  onSubmit: (data: DiskonFormData) => void;
  submitting: boolean;
  error: string | null;
  submitLabel: string;
  onCancel: () => void;
}

export default function DiskonForm({
  initialData,
  onSubmit,
  submitting,
  error: externalError,
  submitLabel,
  onCancel,
}: DiskonFormProps) {
  const [formData, setFormData] = useState<DiskonFormData>({
    nama_diskon: initialData?.nama_diskon ?? "",
    persentase_diskon: initialData?.persentase_diskon ?? 0,
    tanggal_awal: initialData?.tanggal_awal ?? "",
    tanggal_akhir: initialData?.tanggal_akhir ?? "",
  });
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        nama_diskon: initialData.nama_diskon ?? "",
        persentase_diskon: initialData.persentase_diskon ?? 0,
        tanggal_awal: initialData.tanggal_awal ?? "",
        tanggal_akhir: initialData.tanggal_akhir ?? "",
      });
    }
  }, [initialData]);

  function validate(): string | null {
    const persentase = formData.persentase_diskon;
    if (persentase < 1 || persentase > 100) {
      return "Persentase diskon harus antara 1-100";
    }
    if (!formData.tanggal_awal || !formData.tanggal_akhir) {
      return "Tanggal awal dan akhir wajib diisi";
    }
    if (new Date(formData.tanggal_akhir) < new Date(formData.tanggal_awal)) {
      return "Tanggal akhir tidak boleh sebelum tanggal awal";
    }
    return null;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setValidationError(null);

    const valErr = validate();
    if (valErr) {
      setValidationError(valErr);
      return;
    }

    onSubmit(formData);
  }

  const displayError = validationError || externalError;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Nama Diskon"
        name="nama_diskon"
        value={formData.nama_diskon}
        onChange={(e) => setFormData({ ...formData, nama_diskon: e.target.value })}
        placeholder="Misal: PROMO17AGUSTUS"
        required
      />

      <Input
        label="Persentase Diskon (%)"
        name="persentase_diskon"
        type="number"
        min="1"
        max="100"
        value={formData.persentase_diskon}
        onChange={(e) =>
          setFormData({
            ...formData,
            persentase_diskon: parseInt(e.target.value) || 0,
          })
        }
        hint="Nilai antara 1-100"
        required
      />

      <Input
        label="Tanggal Awal"
        name="tanggal_awal"
        type="date"
        value={formData.tanggal_awal}
        onChange={(e) => setFormData({ ...formData, tanggal_awal: e.target.value })}
        required
      />

      <Input
        label="Tanggal Akhir"
        name="tanggal_akhir"
        type="date"
        value={formData.tanggal_akhir}
        onChange={(e) => setFormData({ ...formData, tanggal_akhir: e.target.value })}
        required
      />

      {displayError && (
        <div className="rounded-md bg-status-cancelled/10 p-3 text-sm text-status-cancelled">
          {displayError}
        </div>
      )}

      <div className="flex gap-2">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Batal
        </Button>
        <Button type="submit" isLoading={submitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
