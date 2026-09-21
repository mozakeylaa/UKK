"use client";

import { useEffect, useState, use as usePromise } from "react";
import { useRouter } from "next/navigation";
import { getSpaceById, checkAvailability } from "@/lib/api/space";
import { isApiSuccess } from "@/lib/types/api";
import type { Space, AvailabilityResult } from "@/lib/types/space";
import Spinner from "@/components/ui/Spinner";
import EmptyState from "@/components/ui/EmptyState";
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
      setAvailError("Terjadi kesalahan. Coba lagi.");
    } finally {
      setIsChecking(false);
    }
  }

  function handleLanjutkan() {
    if (!result?.available) return;
    const query = new URLSearchParams({
      id_space: String(spaceId),
      tanggal,
      jam_mulai: jamMulai,
      durasi_jam: durasiJam,
    });
    router.push(`/member/reservasi/baru?${query.toString()}`);
  }

  if (isLoading) return <Spinner label="Memuat detail space..." />;

  if (error || !space) {
    return (
      <EmptyState
        title="Space tidak ditemukan"
        description={error ?? "Data space tidak tersedia."}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <SpaceInfoCard space={space} />

      <AvailabilityCheckCard
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