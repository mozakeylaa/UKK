"use client";

import { useState, FormEvent, useEffect } from "react";
import type { SpaceTipe } from "@/lib/types/space";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import ImageUpload from "@/components/ui/ImageUpload";

const TIPE_OPTIONS = [
  { label: "Personal Desk", value: "desk" },
  { label: "Meeting Room", value: "meeting_room" },
  { label: "Private Office", value: "private_office" },
];

export interface SpaceFormData {
  nama_space: string;
  tipe: SpaceTipe;
  harga_per_jam: number;
  kapasitas: number;
  deskripsi: string;
  foto?: string;
  foto_url?: string;
}

interface SpaceFormProps {
  initialData?: Partial<SpaceFormData>;
  onSubmit: (data: {
    nama_space: string;
    tipe: SpaceTipe;
    harga_per_jam: number;
    kapasitas: number;
    deskripsi: string;
    foto?: string;
  }) => void;
  isSubmitting: boolean;
  serverError: string | null;
  submitLabel: string;
}

export default function SpaceForm({
  initialData,
  onSubmit,
  isSubmitting,
  serverError,
  submitLabel,
}: SpaceFormProps) {
  const [namaSpace, setNamaSpace] = useState(initialData?.nama_space ?? "");
  const [tipe, setTipe] = useState<SpaceTipe | "">(initialData?.tipe ?? "");
  const [hargaPerJam, setHargaPerJam] = useState(
    initialData?.harga_per_jam ? String(initialData.harga_per_jam) : ""
  );
  const [kapasitas, setKapasitas] = useState(
    initialData?.kapasitas ? String(initialData.kapasitas) : ""
  );
  const [deskripsi, setDeskripsi] = useState(initialData?.deskripsi ?? "");
  const [foto, setFoto] = useState<string | undefined>(initialData?.foto);
  const [fotoUrl, setFotoUrl] = useState<string | undefined>(initialData?.foto_url);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      if (initialData.nama_space !== undefined) setNamaSpace(initialData.nama_space);
      if (initialData.tipe !== undefined) setTipe(initialData.tipe);
      if (initialData.harga_per_jam !== undefined)
        setHargaPerJam(String(initialData.harga_per_jam));
      if (initialData.kapasitas !== undefined) setKapasitas(String(initialData.kapasitas));
      if (initialData.deskripsi !== undefined) setDeskripsi(initialData.deskripsi);
      if (initialData.foto !== undefined) setFoto(initialData.foto);
      if (initialData.foto_url !== undefined) setFotoUrl(initialData.foto_url);
    }
  }, [initialData]);

  function validate(): boolean {
    const newErrors: Record<string, string> = {};
    if (!namaSpace.trim()) newErrors.nama_space = "Nama space wajib diisi";
    if (!tipe) newErrors.tipe = "Tipe wajib dipilih";
    if (!hargaPerJam || Number(hargaPerJam) <= 0) newErrors.harga_per_jam = "Harga wajib diisi";
    if (!kapasitas || Number(kapasitas) <= 0) newErrors.kapasitas = "Kapasitas wajib diisi";
    if (!deskripsi.trim()) newErrors.deskripsi = "Deskripsi wajib diisi";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      nama_space: namaSpace,
      tipe: tipe as SpaceTipe,
      harga_per_jam: Number(hargaPerJam),
      kapasitas: Number(kapasitas),
      deskripsi,
      foto: foto?.trim() ? foto.trim() : undefined,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Nama space"
        value={namaSpace}
        onChange={(e) => setNamaSpace(e.target.value)}
        error={errors.nama_space}
      />
      <Select
        label="Tipe"
        placeholder="Pilih tipe"
        options={TIPE_OPTIONS}
        value={tipe}
        onChange={(e) => setTipe(e.target.value as SpaceTipe)}
        error={errors.tipe}
      />
      <Input
        label="Harga per jam"
        type="number"
        value={hargaPerJam}
        onChange={(e) => setHargaPerJam(e.target.value)}
        error={errors.harga_per_jam}
      />
      <Input
        label="Kapasitas (orang)"
        type="number"
        value={kapasitas}
        onChange={(e) => setKapasitas(e.target.value)}
        error={errors.kapasitas}
      />
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-ink-950">Deskripsi</label>
        <textarea
          value={deskripsi}
          onChange={(e) => setDeskripsi(e.target.value)}
          rows={3}
          className="rounded-2xl border border-surface-200 bg-surface-50 px-4 py-2.5 text-sm text-ink-950 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-100"
        />
        {errors.deskripsi && <p className="text-xs text-status-cancelled">{errors.deskripsi}</p>}
      </div>
      <ImageUpload
        target="spaces"
        label="Foto space"
        value={fotoUrl || foto}
        onUploaded={(filename) => {
          setFoto(filename);
          setFotoUrl(filename);
        }}
      />

      {serverError && <p className="text-sm text-status-cancelled">{serverError}</p>}

      <Button type="submit" isLoading={isSubmitting} className="mt-2 w-fit">
        {submitLabel}
      </Button>
    </form>
  );
}
