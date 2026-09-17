"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getSpaceById } from "@/lib/api/space";
import { getActiveDiskon, checkDiskon } from "@/lib/api/diskon";
import { createReservasi } from "@/lib/api/reservasi";
import { isApiSuccess } from "@/lib/types/api";
import type { Space } from "@/lib/types/space";
import type { Diskon } from "@/lib/types/reservasi";
import { formatRupiah } from "@/lib/utils/format";
import { Card } from "@/components/ui/Card";
import Select from "@/components/ui/Select";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import EmptyState from "@/components/ui/EmptyState";

function BuatReservasiForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const idSpace = Number(searchParams.get("id_space"));
  const tanggal = searchParams.get("tanggal") ?? "";
  const jamMulai = searchParams.get("jam_mulai") ?? "";
  const durasiJam = Number(searchParams.get("durasi_jam") ?? "1");

  const [space, setSpace] = useState<Space | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [activeDiskon, setActiveDiskon] = useState<Diskon[]>([]);
  const [selectedDiskonId, setSelectedDiskonId] = useState<string>("");
  const [kodePromoManual, setKodePromoManual] = useState("");
  const [appliedDiskon, setAppliedDiskon] = useState<Diskon | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [isCheckingPromo, setIsCheckingPromo] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!idSpace) {
      setLoadError("Data space tidak lengkap.");
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    Promise.all([getSpaceById(idSpace), getActiveDiskon()]).then(
      ([spaceRes, diskonRes]) => {
        if (isApiSuccess(spaceRes)) {
          setSpace(spaceRes.data);
        } else {
          setLoadError(spaceRes.message);
        }
        if (isApiSuccess(diskonRes)) {
          setActiveDiskon(diskonRes.data);
        }
        setIsLoading(false);
      }
    );
  }, [idSpace]);

  const subtotal = space ? space.harga_per_jam * durasiJam : 0;
  const potongan = appliedDiskon
    ? Math.round((subtotal * appliedDiskon.persentase_diskon) / 100)
    : 0;
  const totalBayar = subtotal - potongan;

  function handleSelectDiskon(value: string) {
    setSelectedDiskonId(value);
    setPromoError(null);
    setKodePromoManual("");

    if (!value) {
      setAppliedDiskon(null);
      return;
    }
    const found = activeDiskon.find((d) => String(d.id) === value);
    setAppliedDiskon(found ?? null);
  }

  async function handleCheckPromoManual() {
    if (!kodePromoManual.trim()) return;
    setPromoError(null);
    setIsCheckingPromo(true);
    setSelectedDiskonId("");

    try {
      const res = await checkDiskon(kodePromoManual.trim());
      if (isApiSuccess(res)) {
        setAppliedDiskon(res.data);
      } else {
        setAppliedDiskon(null);
        setPromoError(res.message);
      }
    } catch {
      setPromoError("Gagal memeriksa kode promo.");
    } finally {
      setIsCheckingPromo(false);
    }
  }

  function handleRemovePromo() {
    setAppliedDiskon(null);
    setSelectedDiskonId("");
    setKodePromoManual("");
    setPromoError(null);
  }

  async function handleSubmit() {
    if (!space) return;
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const res = await createReservasi({
        id_space: idSpace,
        tanggal_reservasi: tanggal,
        jam_mulai: jamMulai,
        durasi_jam: durasiJam,
        id_diskon: appliedDiskon?.id,
        kode_promo: selectedDiskonId ? undefined : kodePromoManual || undefined,
      });

      if (isApiSuccess(res)) {
        router.push(`/member/reservasi/${res.data.id}/sukses`);
      } else {
        setSubmitError(res.message);
      }
    } catch {
      setSubmitError("Terjadi kesalahan. Coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) return <Spinner label="Memuat ringkasan pesanan..." />;

  if (loadError || !space) {
    return (
      <EmptyState
        title="Tidak bisa melanjutkan reservasi"
        description={loadError ?? "Data space tidak ditemukan."}
      />
    );
  }

  const diskonOptions = [
    { label: "Tanpa promo dari daftar", value: "" },
    ...activeDiskon.map((d) => ({
      label: `${d.nama_diskon} (${d.persentase_diskon}%)`,
      value: String(d.id),
    })),
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-medium text-ink-950">Konfirmasi Pesanan</h1>
        <p className="mt-1 text-sm text-ink-600">
          Periksa kembali detail pesanan sebelum melanjutkan.
        </p>
      </div>

      <Card>
        <h2 className="font-display text-base font-medium text-ink-950">{space.nama_space}</h2>
        <p className="text-sm text-ink-600">{space.owner?.nama_coworking}</p>
        <div className="mt-3 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
          <div>
            <p className="text-xs text-ink-600">Tanggal</p>
            <p className="font-medium text-ink-950">{tanggal}</p>
          </div>
          <div>
            <p className="text-xs text-ink-600">Jam mulai</p>
            <p className="font-medium text-ink-950">{jamMulai}</p>
          </div>
          <div>
            <p className="text-xs text-ink-600">Durasi</p>
            <p className="font-medium text-ink-950">{durasiJam} jam</p>
          </div>
          <div>
            <p className="text-xs text-ink-600">Harga/jam</p>
            <p className="font-medium text-ink-950">{formatRupiah(space.harga_per_jam)}</p>
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="font-display text-base font-medium text-ink-950">Kode Promo</h2>
        <p className="mb-3 mt-1 text-sm text-ink-600">
          Pilih promo aktif atau masukkan kode secara manual.
        </p>

        <Select
          label="Pilih dari promo aktif"
          options={diskonOptions}
          value={selectedDiskonId}
          onChange={(e) => handleSelectDiskon(e.target.value)}
        />

        <div className="mt-3 flex items-end gap-2">
          <Input
            label="Atau masukkan kode promo"
            placeholder="Contoh: HEMAT10"
            value={kodePromoManual}
            onChange={(e) => setKodePromoManual(e.target.value)}
          />
          <Button
            type="button"
            variant="outline"
            isLoading={isCheckingPromo}
            onClick={handleCheckPromoManual}
          >
            Cek
          </Button>
        </div>

        {promoError && <p className="mt-2 text-sm text-status-cancelled">{promoError}</p>}

        {appliedDiskon && (
          <div className="mt-3 flex items-center justify-between rounded-md bg-brand-50 px-3 py-2">
            <p className="text-sm text-brand-700">
              Promo <strong>{appliedDiskon.nama_diskon}</strong> diterapkan (
              {appliedDiskon.persentase_diskon}%)
            </p>
            <button
              type="button"
              onClick={handleRemovePromo}
              className="text-xs text-ink-600 hover:underline"
            >
              Hapus
            </button>
          </div>
        )}
      </Card>

      <Card>
        <h2 className="font-display text-base font-medium text-ink-950">Ringkasan Biaya</h2>
        <div className="mt-3 flex flex-col gap-2 text-sm">
          <div className="flex justify-between">
            <span className="text-ink-600">Subtotal ({durasiJam} jam)</span>
            <span className="text-ink-950">{formatRupiah(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink-600">Potongan diskon</span>
            <span className="text-status-cancelled">- {formatRupiah(potongan)}</span>
          </div>
          <div className="flex justify-between border-t border-surface-200 pt-2 font-medium">
            <span className="text-ink-950">Total bayar</span>
            <span className="text-brand-700">{formatRupiah(totalBayar)}</span>
          </div>
        </div>

        {submitError && <p className="mt-3 text-sm text-status-cancelled">{submitError}</p>}

        <Button
          type="button"
          className="mt-4 w-full"
          isLoading={isSubmitting}
          onClick={handleSubmit}
        >
          Buat Reservasi
        </Button>
      </Card>
    </div>
  );
}

export default function BuatReservasiPage() {
  return (
    <Suspense fallback={<Spinner label="Memuat..." />}>
      <BuatReservasiForm />
    </Suspense>
  );
}