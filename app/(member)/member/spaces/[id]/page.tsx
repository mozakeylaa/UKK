"use client";

import { useEffect, useState, use as usePromise } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Building2, AlertTriangle } from "lucide-react";
import { getSpaceById, checkAvailability } from "@/lib/api/space";
import { isApiSuccess } from "@/lib/types/api";
import type { Space, AvailabilityResult } from "@/lib/types/space";
import Spinner from "@/components/ui/Spinner";
import SpaceInfoCard from "@/components/member/spaces/SpaceInfoCard";
import AvailabilityCheckCard from "@/components/member/spaces/AvailabilityCheckCard";

export default function SpaceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = usePromise(params);
  const router = useRouter();
  const spaceId = Number(id);

  const [space, setSpace] = useState<Space | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [tanggal, setTanggal] = useState("");
  const [jamMulai, setJamMulai] = useState("");
  const [durasiJam, setDurasiJam] = useState("1");
  const [formError, setFormError] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<AvailabilityResult | null>(null);
  const [availError, setAvailError] = useState<string | null>(null);

  useEffect(() => {
    if (!spaceId) return;
    setIsLoading(true);
    setError(null);
    getSpaceById(spaceId).then((res) => {
      if (isApiSuccess(res)) {
        setSpace(res.data);
      } else {
        setError(res.message);
      }
      setIsLoading(false);
    });
  }, [spaceId]);

  async function handleCheckAvailability() {
    setFormError(null);
    setAvailError(null);
    setResult(null);

    if (!tanggal || !jamMulai) {
      setFormError("Tanggal dan jam mulai wajib diisi");
      return;
    }

    setIsChecking(true);
    try {
      const res = await checkAvailability({
        id_space: spaceId,
        tanggal,
        jam_mulai: jamMulai,
        durasi_jam: Number(durasiJam),
      });

      if (isApiSuccess(res)) {
        setResult(res.data);
      } else {
        setAvailError(res.message);
      }
    } catch {
      setAvailError("Terjadi kendala saat memeriksa jadwal. Silakan coba lagi.");
    } finally {
      setIsChecking(false);
    }
  }

  function handleLanjutkan() {
    if (!result?.is_available && !result?.available) return;
    const query = new URLSearchParams({
      id_space: String(spaceId),
      tanggal,
      jam_mulai: jamMulai,
      durasi_jam: durasiJam,
    });
    router.push(`/member/reservasi/baru?${query.toString()}`);
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <Spinner label="Memuat detail space..." />
      </div>
    );
  }

  if (error || !space) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl bg-white p-12 text-center border border-rose-100 shadow-sm">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
          <AlertTriangle size={28} />
        </div>
        <h2 className="mt-4 font-display text-lg font-bold text-slate-900">Space Tidak Ditemukan</h2>
        <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-sm">
          {error ?? "Data space tidak tersedia atau telah dihapus."}
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
      {/* Back Button Navigation */}
      <div>
        <Link
          href="/member/spaces"
          className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-semibold text-slate-600 border border-slate-200/80 shadow-sm hover:bg-slate-50 hover:text-[#6367FF] transition-all"
        >
          <ChevronLeft size={16} />
          Kembali ke Katalog Space
        </Link>
      </div>

      {/* Info Card Space */}
      <SpaceInfoCard space={space} />

      {/* Availability Checker Component */}
      <AvailabilityCheckCard
        spaceId={spaceId}
        tanggal={tanggal}
        jamMulai={jamMulai}
        durasiJam={durasiJam}
        formError={formError}
        isChecking={isChecking}
        availError={availError}
        result={result}
        onChangeTanggal={setTanggal}
        onChangeJamMulai={setJamMulai}
        onChangeDurasi={setDurasiJam}
        onCheckAvailability={handleCheckAvailability}
        onLanjutkan={handleLanjutkan}
      />
    </div>
  );
}