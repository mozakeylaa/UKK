"use client";

import { useEffect, useState, use as usePromise } from "react";
import { useRouter } from "next/navigation";
import { getSpaceById, checkAvailability } from "@/lib/api/space";
import { isApiSuccess } from "@/lib/types/api";
import type { Space, AvailabilityResult } from "@/lib/types/space";
import { formatRupiah } from "@/lib/utils/format";
import { Card } from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import EmptyState from "@/components/ui/EmptyState";

const DURASI_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8].map((d) => ({
  label: `${d} jam`,
  value: String(d),
}));

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
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="aspect-video w-full overflow-hidden rounded-lg bg-surface-100">
          {space.foto_url ? (
            <img
              src={space.foto_url}
              alt={space.nama_space}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-ink-600">
              Tidak ada foto
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <div>
            <h1 className="font-display text-2xl font-medium text-ink-950">{space.nama_space}</h1>
            <p className="text-sm text-ink-600">{space.owner?.nama_coworking}</p>
          </div>
          <p className="text-sm text-ink-600">{space.deskripsi}</p>
          <div className="flex flex-wrap gap-4 pt-2">
            <div>
              <p className="text-xs text-ink-600">Kapasitas</p>
              <p className="font-medium text-ink-950">{space.kapasitas} orang</p>
            </div>
            <div>
              <p className="text-xs text-ink-600">Harga</p>
              <p className="font-medium text-ink-950">
                {formatRupiah(space.harga_per_jam)}/jam
              </p>
            </div>
          </div>
        </div>
      </div>

      <Card>
        <h2 className="font-display text-lg font-medium text-ink-950">Cek Ketersediaan</h2>
        <p className="mb-4 mt-1 text-sm text-ink-600">
          Pilih tanggal dan jam untuk memeriksa ketersediaan space ini.
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Input
            type="date"
            label="Tanggal"
            value={tanggal}
            onChange={(e) => setTanggal(e.target.value)}
          />
          <Input
            type="time"
            label="Jam mulai"
            value={jamMulai}
            onChange={(e) => setJamMulai(e.target.value)}
          />
          <Select
            label="Durasi"
            options={DURASI_OPTIONS}
            value={durasiJam}
            onChange={(e) => setDurasiJam(e.target.value)}
          />
        </div>

        {formError && <p className="mt-3 text-sm text-status-cancelled">{formError}</p>}

        <Button
          type="button"
          variant="outline"
          className="mt-4"
          isLoading={isChecking}
          onClick={handleCheckAvailability}
        >
          Cek Ketersediaan
        </Button>

        {availError && (
          <p className="mt-4 rounded-md bg-status-cancelled/10 px-3 py-2 text-sm text-status-cancelled">
            {availError}
          </p>
        )}

        {result && (
          <div className="mt-4 flex flex-col gap-3 rounded-md bg-brand-50 px-4 py-3">
            {result.available ? (
              <>
                <p className="text-sm text-brand-700">
                  Tersedia sampai pukul <strong>{result.jam_selesai}</strong>. Estimasi total:{" "}
                  <strong>{formatRupiah(result.estimasi_total)}</strong>
                </p>
                <Button type="button" onClick={handleLanjutkan} className="w-fit">
                  Lanjutkan
                </Button>
              </>
            ) : (
              <p className="text-sm text-status-cancelled">
                Jadwal bentrok, space tidak tersedia pada waktu tersebut.
              </p>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}