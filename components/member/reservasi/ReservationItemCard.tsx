import Link from "next/link";
import { Ticket, Clock, CheckCircle2, Building, Calendar } from "lucide-react";
import type { Reservasi } from "@/lib/types/reservasi";
import { formatRupiah, formatDate } from "@/lib/utils/format";
import { Card } from "@/components/ui/Card";
import Badge, { ReservasiStatus } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

const CANCELLABLE: ReservasiStatus[] = ["belum_dikonfirm", "disetujui"];

const STEPS: { status: ReservasiStatus; label: string }[] = [
  { status: "belum_dikonfirm", label: "Menunggu Konfirmasi" },
  { status: "disetujui", label: "Disetujui" },
  { status: "aktif", label: "Aktif / Check-In" },
  { status: "selesai", label: "Selesai" },
];

function getStepIndex(status: ReservasiStatus): number {
  switch (status) {
    case "belum_dikonfirm":
      return 0;
    case "disetujui":
      return 1;
    case "aktif":
      return 2;
    case "selesai":
      return 3;
    default:
      return -1;
  }
}

interface ReservationItemCardProps {
  reservasi: Reservasi;
  onCancel: (reservasi: Reservasi) => void;
}

export default function ReservationItemCard({
  reservasi: r,
  onCancel,
}: ReservationItemCardProps) {
  const currentStepIdx = getStepIndex(r.status);
  const isCancelled = r.status === "dibatalkan";

  return (
    <Card className="flex flex-col gap-4 rounded-3xl border border-slate-100 bg-white p-5 sm:p-6 shadow-xs hover:shadow-md transition-shadow">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-xs text-[#6367FF] bg-[#EEEFFF] px-2.5 py-0.5 rounded-md">
              {r.kode_booking}
            </span>
            <span className="text-[11px] text-slate-400 font-medium">
              ID #{r.id}
            </span>
          </div>
          <h3 className="font-display text-base sm:text-lg font-bold text-slate-900 mt-1.5">
            {r.space?.nama_space ?? `Ruang Kerja #${r.id_space}`}
          </h3>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-slate-500">
            <span className="flex items-center gap-1.5 font-medium text-slate-700">
              <Calendar size={13} className="text-[#6367FF]" />
              {formatDate(r.tanggal_reservasi)}
            </span>
            <span>&bull;</span>
            <span className="flex items-center gap-1.5 text-slate-600">
              <Clock size={13} className="text-slate-400" />
              {r.jam_mulai}–{r.jam_selesai} ({r.durasi_jam} jam)
            </span>
          </div>
        </div>
        <div className="self-start sm:self-auto">
          <Badge status={r.status} />
        </div>
      </div>

      {/* Status Progress Stepper */}
      {!isCancelled ? (
        <div className="rounded-2xl bg-slate-50/80 p-3.5 border border-slate-100/80">
          <div className="flex items-center justify-between relative">
            {STEPS.map((step, idx) => {
              const isPassed = idx <= currentStepIdx;
              const isCurrent = idx === currentStepIdx;
              return (
                <div key={step.status} className="flex-1 flex flex-col items-center text-center relative z-10">
                  <div
                    className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold transition-all ${
                      isCurrent
                        ? "bg-[#6367FF] text-white ring-4 ring-[#6367FF]/20 shadow-xs"
                        : isPassed
                        ? "bg-emerald-500 text-white"
                        : "bg-slate-200 text-slate-400"
                    }`}
                  >
                    {isPassed && !isCurrent ? "✓" : idx + 1}
                  </div>
                  <span
                    className={`mt-1.5 text-[10px] leading-tight px-1 font-medium ${
                      isCurrent
                        ? "font-bold text-[#6367FF]"
                        : isPassed
                        ? "text-slate-700"
                        : "text-slate-400"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
          {/* Status Message Hint */}
          <div className="mt-3 pt-2.5 border-t border-slate-200/60 text-[11px] text-slate-500 flex items-center gap-1.5">
            {r.status === "belum_dikonfirm" && (
              <span className="text-amber-600 font-medium">
                ⏳ Menunggu konfirmasi &amp; persetujuan dari Admin Space.
              </span>
            )}
            {r.status === "disetujui" && (
              <span className="text-[#6367FF] font-medium">
                ✅ Reservasi telah disetujui! Tunjukkan E-Ticket kepada staf saat tiba di lokasi.
              </span>
            )}
            {r.status === "aktif" && (
              <span className="text-emerald-600 font-medium">
                🏢 Anda sedang menggunakan ruangan ini (Sesi Check-In aktif).
              </span>
            )}
            {r.status === "selesai" && (
              <span className="text-slate-600 font-medium">
                ✨ Sesi reservasi ini telah selesai digunakan (Check-Out oleh admin).
              </span>
            )}
          </div>
        </div>
      ) : (
        <div className="rounded-2xl bg-rose-50 p-3 text-xs font-medium text-rose-600 border border-rose-100">
          ❌ Reservasi ini telah dibatalkan.
        </div>
      )}

      {/* Footer Price & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-100 pt-3">
        <div className="flex flex-col">
          <span className="text-[11px] text-slate-400 font-medium">Total Pembayaran</span>
          <span className="font-display text-base font-bold text-slate-900">
            {formatRupiah(r.total_bayar)}
          </span>
        </div>
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <Link href={`/member/reservasi/${r.id}/tiket`}>
            <Button variant="outline" size="sm" className="rounded-full text-xs font-semibold">
              <Ticket size={14} className="mr-1 text-[#6367FF]" />
              E-Ticket
            </Button>
          </Link>
          {CANCELLABLE.includes(r.status) && (
            <Button
              variant="danger"
              size="sm"
              className="rounded-full text-xs font-semibold"
              onClick={() => onCancel(r)}
            >
              Batalkan
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}

