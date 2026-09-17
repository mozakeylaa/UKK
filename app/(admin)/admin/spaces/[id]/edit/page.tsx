"use client";

import { useEffect, useState, FormEvent, use as usePromise } from "react";
import { useRouter } from "next/navigation";
import { getAdminSpaceById, updateAdminSpace } from "@/lib/api/admin-spaces";
import { isApiSuccess } from "@/lib/types/api";
import type { SpaceTipe } from "@/lib/types/space";
import { Card } from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import ImageUpload from "@/components/ui/ImageUpload";
import Spinner from "@/components/ui/Spinner";
import EmptyState from "@/components/ui/EmptyState";

const TIPE_OPTIONS = [
  { label: "Personal Desk", value: "desk" },
  { label: "Meeting Room", value: "meeting_room" },
  { label: "Private Office", value: "private_office" },
];

export default function EditSpacePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = usePromise(params);
  const spaceId = Number(id);
  const router = useRouter();

  const [namaSpace, setNamaSpace] = useState("");
  const [tipe, setTipe] = useState<SpaceTipe | "">("");
  const [hargaPerJam, setHargaPerJam] = useState("");
  const [kapasitas, setKapasitas] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [foto, setFoto] = useState<string | undefined>(undefined);
  const [fotoUrl, setFotoUrl] = useState<string | undefined>(undefined);

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!spaceId) return;
    getAdminSpaceById(spaceId).then((res) => {
      if (isApiSuccess(res)) {
        setNamaSpace(res.data.nama_space);
        setTipe(res.data.tipe);
        setHargaPerJam(String(res.data.harga_per_jam));
        setKapasitas(String(res.data.kapasitas));
        setDeskripsi(res.data.deskripsi);
        setFoto(res.data.foto ?? undefined);
        setFotoUrl(res.data.foto_url ?? undefined);
      } else {
        setLoadError(res.message);
      }
      setIsLoading(false);
    });
  }, [spaceId]);

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

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setServerError(null);
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const res = await updateAdminSpace(spaceId, {
        nama_space: namaSpace,
        tipe: tipe as SpaceTipe,
        harga_per_jam: Number(hargaPerJam),
        kapasitas: Number(kapasitas),
        deskripsi,
        foto,
      });
      if (isApiSuccess(res)) {
        router.push("/admin/spaces");
      } else {
        setServerError(res.message);
      }
    } catch {
      setServerError("Terjadi kesalahan. Coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) return <Spinner label="Memuat data space..." />;
  if (loadError) return <EmptyState title="Space tidak ditemukan" description={loadError} />;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink-950">Edit Space</h1>
        <p className="mt-1 text-sm text-ink-600">Perbarui detail ruangan/meja.</p>
      </div>

      <Card className="max-w-lg">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Nama space"
            value={namaSpace}
            onChange={(e) => setNamaSpace(e.target.value)}
            error={errors.nama_space}
          />
          <Select
            label="Tipe"
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
            value={fotoUrl}
            onUploaded={(filename) => setFoto(filename)}
          />

          {serverError && <p className="text-sm text-status-cancelled">{serverError}</p>}

          <Button type="submit" isLoading={isSubmitting} className="mt-2 w-fit">
            Simpan Perubahan
          </Button>
        </form>
      </Card>
    </div>
  );
}