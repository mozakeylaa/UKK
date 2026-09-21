"use client";

import { useEffect, useState, use as usePromise } from "react";
import Link from "next/link";
import { Printer, ChevronLeft, AlertTriangle, ShieldCheck } from "lucide-react";
import { getETicket } from "@/lib/api/reservasi";
import { isApiSuccess } from "@/lib/types/api";
import type { ETicket } from "@/lib/types/reservasi";
import Spinner from "@/components/ui/Spinner";
import ETicketCard from "@/components/member/reservasi/ETicketCard";

export default function ETicketPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = usePromise(params);
  const reservasiId = Number(id);

  const [tiket, setTiket] = useState<ETicket | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!reservasiId) return;
    setIsLoading(true);
    getETicket(reservasiId).then((res) => {
      if (isApiSuccess(res)) {
        setTiket(res.data);
      } else {
        setError(res.message);
      }
      setIsLoading(false);
    });
  }, [reservasiId]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <Spinner label="Menyiapkan e-ticket digital..." />
      </div>
    );
  }

  if (error || !tiket) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center justify-center rounded-3xl bg-white p-12 text-center border border-rose-100 shadow-sm">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
          <AlertTriangle size={28} />
        </div>
        <h2 className="mt-4 font-display text-lg font-bold text-slate-900">E-Ticket Tidak Ditemukan</h2>
        <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-sm">
          {error ?? "Data reservasi tidak tersedia atau belum disetujui oleh pengelola."}
        </p>
        <Link
          href="/member/reservasi"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#12132E] px-5 py-2.5 text-xs font-semibold text-white hover:bg-slate-800 transition-colors"
        >
          <ChevronLeft size={16} /> Kembali ke Reservasi
        </Link>
      </div>
    );
  }

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
    tiket.qr_code_payload
  )}`;

  return (
    <div className="mx-auto flex max-w-md flex-col gap-6 pb-16">
      {/* Top Controls (Hidden saat Print) */}
      <div className="flex items-center justify-between print:hidden">
        <Link
          href="/member/reservasi"
          className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-600 border border-slate-200/80 shadow-sm hover:bg-slate-50 hover:text-[#6367FF] transition-all"
        >
          <ChevronLeft size={15} />
          Kembali
        </Link>

        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-full bg-[#6367FF] px-4 py-2 text-xs font-bold text-white shadow-md shadow-[#6367FF]/25 hover:bg-[#4A4FE0] transition-colors"
        >
          <Printer size={15} />
          Cetak Tiket
        </button>
      </div>

      {/* Header Info (Hidden saat Print) */}
      <div className="text-center print:hidden">
        <h1 className="font-display text-2xl font-bold text-slate-900">
          E-Ticket Resmi
        </h1>
        <p className="mt-1 text-xs text-slate-500">
          Tunjukkan tiket digital ini kepada resepsionis saat tiba di lokasi.
        </p>
      </div>

      {/* Card E-Tiket Digital */}
      <div className="shadow-2xl shadow-slate-900/5 rounded-3xl overflow-hidden">
        <ETicketCard tiket={tiket} qrImageUrl={qrImageUrl} />
      </div>

      {/* Instruksi Tambahan (Hidden saat Print) */}
      <div className="rounded-2xl bg-white p-4 border border-slate-100 shadow-sm flex items-start gap-3 text-xs text-slate-500 print:hidden">
        <ShieldCheck size={18} className="text-emerald-500 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          QR Code ini berlaku untuk satu kali check-in sesuai jadwal reservasi. Pastikan kecerahan layar smartphone kamu cukup saat melakukan scanning.
        </p>
      </div>
    </div>
  );
}