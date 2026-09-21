"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, ShieldCheck, AlertTriangle } from "lucide-react";
import { getSpaceById } from "@/lib/api/space";
import { getActiveDiskon, checkDiskon } from "@/lib/api/diskon";
import { createReservasi } from "@/lib/api/reservasi";
import { isApiSuccess } from "@/lib/types/api";
import type { Space } from "@/lib/types/space";
import type { Diskon } from "@/lib/types/reservasi";
import Spinner from "@/components/ui/Spinner";
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
      setLoadError("Data space tidak lengkap atau belum dipilih.");
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
      setPromoError("Gagal memeriksa kode promo. Silakan coba lagi.");
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
      setSubmitError("Terjadi kendala saat memproses reservasi. Coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <Spinner label="Memuat ringkasan pesanan..." />
      </div>
    );
  }

  if (loadError || !space) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl bg-white p-12 text-center border border-rose-100 shadow-sm">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
          <AlertTriangle size={28} />
        </div>
        <h2 className="mt-4 font-display text-lg font-bold text-slate-900">Tidak Bisa Melanjutkan Reservasi</h2>
        <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-sm">
          {loadError ?? "Data space tidak ditemukan atau parameter pemesanan tidak lengkap."}
        </p>
        <Link
          href="/member/spaces"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#12132E] px-5 py-2.5 text-xs font-semibold text-white hover:bg-slate-800 transition-colors"
        >
          <ChevronLeft size={16} /> Kembali ke Katalog
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Back Button & Step Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          href={idSpace ? `/member/spaces/${idSpace}` : "/member/spaces"}
          className="inline-flex items-center gap-1.5 self-start rounded-full bg-white px-4 py-2 text-xs font-semibold text-slate-600 border border-slate-200/80 shadow-sm hover:bg-slate-50 hover:text-[#6367FF] transition-all"
        >
          <ChevronLeft size={16} />
          Ubah Jadwal / Detail Space
        </Link>

        {/* Step Indicator */}
        <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
          <span className="text-slate-400">1. Pilih Jadwal</span>
          <span>&bull;</span>
          <span className="font-bold text-[#6367FF] bg-[#EEEFFF] px-3 py-1 rounded-full">
            2. Konfirmasi
          </span>
          <span>&bull;</span>
          <span className="text-slate-400">3. E-Tiket</span>
        </div>
      </div>

      {/* Header Title */}
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Konfirmasi Pesanan
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-500">
          Periksa kembali rincian pemesanan dan masukkan kode diskon sebelum melakukan konfirmasi.
        </p>
      </div>

      {/* Space Order Detail */}
      <OrderSpaceCard
        space={space}
        tanggal={tanggal}
        jamMulai={jamMulai}
        durasiJam={durasiJam}
      />

      {/* Promo & Diskon Voucher Section */}
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

      {/* Price Summary & Action */}
      <PriceSummaryCard
        subtotal={subtotal}
        potongan={potongan}
        totalBayar={totalBayar}
        durasiJam={durasiJam}
        submitError={submitError}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
      />

      {/* Security Assurance Badge */}
      <div className="flex items-center justify-center gap-2 text-xs text-slate-400 pt-2">
        <ShieldCheck size={16} className="text-emerald-500" />
        <span>Pemesanan aman &amp; instan. E-tiket langsung diterbitkan setelah konfirmasi.</span>
      </div>
    </div>
  );
}

export default function BuatReservasiPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center py-24">
          <Spinner label="Menyiapkan ringkasan pesanan..." />
        </div>
      }
    >
      <BuatReservasiForm />
    </Suspense>
  );
}