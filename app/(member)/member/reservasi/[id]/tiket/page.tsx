"use client";

import { useEffect, useState, useRef, use as usePromise } from "react";
import Link from "next/link";
import {
  Printer,
  Download,
  ChevronLeft,
  AlertTriangle,
  ShieldCheck,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";
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
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ticketRef = useRef<HTMLDivElement>(null);

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

  async function handleDownloadPdf() {
    if (!ticketRef.current || !tiket) return;
    try {
      setIsDownloading(true);
      setDownloadSuccess(false);

      // Render elemen tiket ke PNG resolusi tinggi via html-to-image
      const imgData = await toPng(ticketRef.current, {
        pixelRatio: 2, // Kualitas jernih tajam
        cacheBust: true,
      });

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const element = ticketRef.current;
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const margin = 20;
      const printWidth = pdfWidth - margin * 2;
      const printHeight = (element.offsetHeight * printWidth) / element.offsetWidth;

      pdf.addImage(imgData, "PNG", margin, 15, printWidth, printHeight);

      const fileName = `E-Ticket-${tiket.kode_booking || `CWK-${tiket.id}`}.pdf`;
      pdf.save(fileName);

      // Tampilkan toast notifikasi berhasil
      setDownloadSuccess(true);
      setTimeout(() => {
        setDownloadSuccess(false);
      }, 4000);
    } catch (err) {
      console.error("Gagal mendownload PDF:", err);
      alert("Gagal memproses unduhan PDF. Silakan coba gunakan tombol Cetak.");
    } finally {
      setIsDownloading(false);
    }
  }

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
        <h2 className="mt-4 font-display text-lg font-bold text-slate-900">
          E-Ticket Tidak Ditemukan
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-sm">
          {error ?? "Data reservasi tidak tersedia atau belum disetujui."}
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

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
    tiket.qr_code_payload
  )}`;

  return (
    <div className="mx-auto flex max-w-md flex-col gap-6 pb-16 relative">
      {/* Toast Notifikasi Berhasil Download */}
      {downloadSuccess && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 rounded-2xl bg-slate-900/95 px-5 py-3 text-xs font-semibold text-white shadow-xl backdrop-blur-md animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span>E-Ticket PDF berhasil diunduh!</span>
        </div>
      )}

      {/* Top Controls: Kembali, Download PDF, Cetak Tiket */}
      <div className="flex items-center justify-between gap-2 print:hidden">
        <Link
          href="/member/reservasi"
          className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-600 border border-slate-200/80 shadow-sm hover:bg-slate-50 hover:text-[#6367FF] transition-all"
        >
          <ChevronLeft size={15} />
          Kembali
        </Link>

        <div className="flex items-center gap-2">
          {/* Tombol Download PDF */}
          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={isDownloading}
            className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-2 text-xs font-bold text-slate-700 border border-slate-200 shadow-sm hover:border-[#6367FF] hover:text-[#6367FF] disabled:opacity-60 transition-all cursor-pointer"
          >
            {isDownloading ? (
              <Loader2 size={14} className="animate-spin text-[#6367FF]" />
            ) : (
              <Download size={14} className="text-[#6367FF]" />
            )}
            <span>{isDownloading ? "Mengunduh..." : "Download PDF"}</span>
          </button>

          {/* Tombol Cetak Tiket */}
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#6367FF] to-[#8494FF] px-4 py-2 text-xs font-bold text-white shadow-md shadow-[#6367FF]/25 hover:opacity-95 transition-opacity cursor-pointer"
          >
            <Printer size={14} />
            <span>Cetak</span>
          </button>
        </div>
      </div>

      {/* Header Info */}
      <div className="text-center print:hidden">
        <h1 className="font-display text-2xl font-bold text-slate-900">
          E-Ticket Resmi
        </h1>
        <p className="mt-1 text-xs text-slate-500">
          Tunjukkan tiket digital ini kepada resepsionis saat tiba di lokasi.
        </p>
      </div>

      {/* Card E-Tiket Digital */}
      <div
        ref={ticketRef}
        className="shadow-2xl shadow-slate-900/5 rounded-3xl overflow-hidden bg-white"
      >
        <ETicketCard tiket={tiket} qrImageUrl={qrImageUrl} />
      </div>

      {/* Instruksi Tambahan */}
      <div className="rounded-2xl bg-white p-5 border border-slate-100 shadow-sm flex flex-col gap-2.5 text-xs text-slate-600 print:hidden">
        <div className="flex items-center gap-2 font-bold text-slate-900">
          <ShieldCheck size={18} className="text-emerald-500 shrink-0" />
          <span>Petunjuk &amp; Tata Tertib Check-In</span>
        </div>
        {tiket.instruksi_check_in && tiket.instruksi_check_in.length > 0 ? (
          <ul className="list-disc pl-5 space-y-1.5 text-slate-500 leading-relaxed">
            {tiket.instruksi_check_in.map((instruksi, idx) => (
              <li key={idx}>{instruksi}</li>
            ))}
          </ul>
        ) : (
          <p className="leading-relaxed text-slate-500">
            QR Code ini berlaku untuk satu kali check-in sesuai jadwal reservasi. Pastikan kecerahan layar smartphone kamu cukup saat melakukan scanning di resepsionis.
          </p>
        )}
      </div>
    </div>
  );
}