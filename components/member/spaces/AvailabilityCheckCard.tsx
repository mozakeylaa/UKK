"use client";

import { useEffect, useState } from "react";
import { Clock, Calendar, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";
import type { AvailabilityResult, BookedSlot } from "@/lib/types/space";
import { getDaySchedule } from "@/lib/api/space";
import apiClient from "@/lib/api/client";
import { isApiSuccess } from "@/lib/types/api";
import { formatRupiah } from "@/lib/utils/format";
import { Card } from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";

const DURASI_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8].map((d) => ({
  label: `${d} jam`,
  value: String(d),
}));

// Slot jam operasional coworking (08:00 s/d 21:00)
const OPERATIONAL_HOURS = [
  "08:00", "09:00", "10:00", "11:00", "12:00", "13:00",
  "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00"
];

function isHourBooked(hour: string, bookedSlots: BookedSlot[]): BookedSlot | undefined {
  const [h, m] = hour.split(":").map(Number);
  const targetMin = (h || 0) * 60 + (m || 0);

  return bookedSlots.find((slot) => {
    const [startH, startM] = slot.jam_mulai.split(":").map(Number);
    const [endH, endM] = slot.jam_selesai.split(":").map(Number);
    const startMin = (startH || 0) * 60 + (startM || 0);
    const endMin = (endH || 0) * 60 + (endM || 0);

    return targetMin >= startMin && targetMin < endMin;
  });
}

interface AvailabilityCheckCardProps {
  spaceId: number;
  tanggal: string;
  jamMulai: string;
  durasiJam: string;
  formError: string | null;
  isChecking: boolean;
  availError: string | null;
  result: AvailabilityResult | null;
  onChangeTanggal: (value: string) => void;
  onChangeJamMulai: (value: string) => void;
  onChangeDurasi: (value: string) => void;
  onCheckAvailability: () => void;
  onLanjutkan: () => void;
}

export default function AvailabilityCheckCard({
  spaceId,
  tanggal,
  jamMulai,
  durasiJam,
  formError,
  isChecking,
  availError,
  result,
  onChangeTanggal,
  onChangeJamMulai,
  onChangeDurasi,
  onCheckAvailability,
  onLanjutkan,
}: AvailabilityCheckCardProps) {
  const [bookedSlots, setBookedSlots] = useState<BookedSlot[]>([]);
  const [isLoadingSchedule, setIsLoadingSchedule] = useState(false);

  // Ambil jadwal harian ketika tanggal berubah
  useEffect(() => {
    if (!spaceId || !tanggal) {
      setBookedSlots([]);
      return;
    }

    setIsLoadingSchedule(true);

    const fetchSchedule = async () => {
      try {
        let slots: BookedSlot[] = [];
        if (typeof getDaySchedule === "function") {
          const res = await getDaySchedule(spaceId, tanggal);
          if (isApiSuccess(res)) slots = res.data;
        } else {
          // Fallback langsung via apiClient jika HMR module cache belum ter-refresh
          const res = await apiClient.get<any>("/api/spaces/availability", {
            params: { id_space: spaceId, tanggal },
          });
          const rawData = res.data?.data;
          const spaceData = Array.isArray(rawData)
            ? rawData.find((s: any) => s.id === spaceId) || rawData[0]
            : rawData;
          const detailReservasi = spaceData?.detail_reservasi || [];
          slots = detailReservasi
            .filter((d: any) => d.reservasi && d.reservasi.status !== "dibatalkan")
            .map((d: any) => {
              const r = d.reservasi;
              const [h, m] = (r.jam_mulai || "00:00").split(":").map(Number);
              const totalMin = (h || 0) * 60 + (m || 0) + (r.durasi_jam || 1) * 60;
              const endH = Math.floor(totalMin / 60) % 24;
              const endM = totalMin % 60;
              const jamSelesai = `${String(endH).padStart(2, "0")}:${String(endM).padStart(2, "0")}`;
              return {
                jam_mulai: r.jam_mulai,
                durasi_jam: r.durasi_jam,
                jam_selesai: jamSelesai,
                status: r.status,
              };
            });
        }
        setBookedSlots(slots);
      } catch {
        setBookedSlots([]);
      } finally {
        setIsLoadingSchedule(false);
      }
    };

    fetchSchedule();
  }, [spaceId, tanggal]);

  // Tanggal minimal adalah hari ini
  const todayStr = new Date().toISOString().split("T")[0];

  return (
    <Card className="flex flex-col gap-5">
      <div>
        <div className="flex items-center gap-2">
          <Calendar size={20} className="text-[#6367FF]" />
          <h2 className="font-display text-lg font-semibold text-ink-950">
            Cek Ketersediaan & Jadwal
          </h2>
        </div>
        <p className="mt-1 text-xs sm:text-sm text-ink-600">
          Pilih tanggal untuk melihat jadwal yang kosong atau terisi secara transparan.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Input
          type="date"
          label="Tanggal Sewa"
          min={todayStr}
          value={tanggal}
          onChange={(e) => onChangeTanggal(e.target.value)}
        />
        <Input
          type="time"
          label="Jam Mulai"
          value={jamMulai}
          onChange={(e) => onChangeJamMulai(e.target.value)}
        />
        <Select
          label="Durasi Sewa"
          options={DURASI_OPTIONS}
          value={durasiJam}
          onChange={(e) => onChangeDurasi(e.target.value)}
        />
      </div>

      {/* Visual Timeline / Grid Jadwal Harian */}
      {tanggal && (
        <div className="rounded-2xl border border-surface-200 bg-surface-50 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-ink-900">
              <Clock size={14} className="text-brand-600" />
              <span>Jadwal Harian ({tanggal})</span>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-ink-600">
              <span className="flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                Tersedia
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
                Terisi
              </span>
            </div>
          </div>

          {isLoadingSchedule ? (
            <p className="mt-3 text-xs text-ink-500">Memuat status jadwal harian...</p>
          ) : (
            <div className="mt-3">
              <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
                {OPERATIONAL_HOURS.map((hour) => {
                  const conflict = isHourBooked(hour, bookedSlots);
                  const isSelected = jamMulai === hour;

                  if (conflict) {
                    return (
                      <div
                        key={hour}
                        title={`Sudah dipesan: ${conflict.jam_mulai} - ${conflict.jam_selesai}`}
                        className="flex flex-col items-center justify-center rounded-xl border border-rose-200 bg-rose-50/80 px-2 py-2 text-center text-xs font-medium text-rose-600 cursor-not-allowed select-none opacity-80"
                      >
                        <span className="font-semibold">{hour}</span>
                        <span className="text-[9px] uppercase tracking-wider text-rose-500">
                          Terisi
                        </span>
                      </div>
                    );
                  }

                  return (
                    <button
                      key={hour}
                      type="button"
                      onClick={() => onChangeJamMulai(hour)}
                      className={`flex flex-col items-center justify-center rounded-xl border px-2 py-2 text-center text-xs font-medium transition-all ${
                        isSelected
                          ? "border-[#6367FF] bg-[#6367FF] text-white shadow-md shadow-brand-500/20 scale-[1.02]"
                          : "border-emerald-200 bg-emerald-50/70 text-emerald-700 hover:border-emerald-400 hover:bg-emerald-100"
                      }`}
                    >
                      <span className="font-semibold">{hour}</span>
                      <span
                        className={`text-[9px] uppercase tracking-wider ${
                          isSelected ? "text-white/90" : "text-emerald-600"
                        }`}
                      >
                        {isSelected ? "Dipilih" : "Kosong"}
                      </span>
                    </button>
                  );
                })}
              </div>
              <p className="mt-2 text-[11px] text-ink-500">
                *Klik salah satu slot hijau di atas untuk memilih jam mulai secara instan.
              </p>
            </div>
          )}
        </div>
      )}

      {formError && <p className="text-sm text-status-cancelled">{formError}</p>}

      <Button
        type="button"
        variant="outline"
        className="w-fit"
        isLoading={isChecking}
        onClick={onCheckAvailability}
      >
        Cek Ketersediaan
      </Button>

      {availError && (
        <p className="rounded-xl bg-status-cancelled/10 px-4 py-3 text-sm text-status-cancelled">
          {availError}
        </p>
      )}

      {/* Hasil Pengecekan */}
      {result && (
        <div
          className={`flex flex-col gap-3 rounded-2xl p-4 border transition-all ${
            result.is_available
              ? "border-emerald-200 bg-emerald-50/80 text-emerald-900"
              : "border-rose-200 bg-rose-50/80 text-rose-900"
          }`}
        >
          {result.is_available ? (
            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-3">
                <CheckCircle2 size={20} className="mt-0.5 text-emerald-600 shrink-0" />
                <div>
                  <p className="font-semibold text-emerald-900">
                    Jadwal Tersedia!
                  </p>
                  <p className="mt-0.5 text-xs sm:text-sm text-emerald-700">
                    Space siap dipakai mulai pukul <strong>{jamMulai}</strong> hingga{" "}
                    <strong>{result.jam_selesai}</strong> ({durasiJam} jam).
                  </p>
                  <p className="mt-1 text-xs text-emerald-800">
                    Estimasi total sewa:{" "}
                    <strong className="font-display text-sm">
                      {formatRupiah(result.estimasi_total)}
                    </strong>
                  </p>
                </div>
              </div>

              <Button
                type="button"
                onClick={onLanjutkan}
                className="w-fit gap-1.5 !bg-emerald-600 hover:!bg-emerald-700 text-white"
              >
                <Sparkles size={16} />
                Lanjutkan Pemesanan
              </Button>
            </div>
          ) : (
            <div className="flex items-start gap-3">
              <AlertCircle size={20} className="mt-0.5 text-rose-600 shrink-0" />
              <div className="flex flex-col gap-1">
                <p className="font-semibold text-rose-900">
                  Jadwal Bentrok pada Waktu Ini
                </p>
                <p className="text-xs sm:text-sm text-rose-700">
                  Space sudah memiliki reservasi aktif pada rentang waktu yang Anda pilih:
                </p>
                {result.conflicts && result.conflicts.length > 0 ? (
                  <ul className="mt-1 list-disc pl-4 text-xs font-medium text-rose-800">
                    {result.conflicts.map((c, i) => (
                      <li key={i}>
                        Pukul <strong>{c.jam_mulai} – {c.jam_selesai}</strong> ({c.durasi_jam} jam)
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-rose-800">
                    Pukul {jamMulai} sedang tidak tersedia.
                  </p>
                )}
                <p className="mt-2 text-xs text-rose-600">
                  Silakan pilih slot jam lain yang berwarna hijau pada daftar jadwal di atas.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
