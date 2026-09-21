"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getSpaceById } from "@/lib/api/space";
import { getActiveDiskon, checkDiskon } from "@/lib/api/diskon";
import { createReservasi } from "@/lib/api/reservasi";
import { isApiSuccess } from "@/lib/types/api";
import type { Space } from "@/lib/types/space";
import type { Diskon } from "@/lib/types/reservasi";
import Spinner from "@/components/ui/Spinner";
import EmptyState from "@/components/ui/EmptyState";
import OrderSpaceCard from "@/components/member/reservasi/OrderSpaceCard";
import PromoDiscountSection from "@/components/member/reservasi/PromoDiscountSection";
import PriceSummaryCard from "@/components/member/reservasi/PriceSummaryCard";

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

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-medium text-ink-950">Konfirmasi Pesanan</h1>
        <p className="mt-1 text-sm text-ink-600">
          Periksa kembali detail pesanan sebelum melanjutkan.
        </p>
      </div>

      <OrderSpaceCard
        space={space}
        tanggal={tanggal}
        jamMulai={jamMulai}
        durasiJam={durasiJam}
      />

      <PromoDiscountSection
        activeDiskon={activeDiskon}
        selectedDiskonId={selectedDiskonId}
        kodePromoManual={kodePromoManual}
        appliedDiskon={appliedDiskon}
        promoError={promoError}
        isCheckingPromo={isCheckingPromo}
        onSelectDiskon={handleSelectDiskon}
        onChangeKodeManual={setKodePromoManual}
        onCheckPromoManual={handleCheckPromoManual}
        onRemovePromo={handleRemovePromo}
      />

      <PriceSummaryCard
        subtotal={subtotal}
        potongan={potongan}
        totalBayar={totalBayar}
        durasiJam={durasiJam}
        submitError={submitError}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
      />
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