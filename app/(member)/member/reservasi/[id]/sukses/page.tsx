"use client";

import { useEffect, useState, use as usePromise } from "react";
import Link from "next/link";
import { CheckCircle2, Ticket, Calendar, Clock, ArrowRight, AlertTriangle } from "lucide-react";
import { getReservasiById } from "@/lib/api/reservasi";
import { isApiSuccess } from "@/lib/types/api";
import type { Reservasi } from "@/lib/types/reservasi";
import { formatRupiah, formatDate } from "@/lib/utils/format";
import Spinner from "@/components/ui/Spinner";

export default function ReservasiSuksesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = usePromise(params);
  const reservasiId = Number(id);

  const [reservasi, setReservasi] = useState<Reservasi | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!reservasiId) return;
    setIsLoading(true);
    getReservasiById(reservasiId).then((res) => {
      if (isApiSuccess(res)) {
        setReservasi(res.data);
      } else {
        setError(res.message);
      }
      setIsLoading(false);
    });
  }, [reservasiId]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <Spinner label="Memuat konfirmasi reservasi..." />
      </div>
    );
  }

  if (error || !reservasi) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center justify-center rounded-3xl bg-white p-12 text-center border border-rose-100 shadow-sm">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
          <AlertTriangle size={28} />
        </div>
        <h2 className="mt-4 font-display text-lg font-bold text-slate-900">Data Reservasi Tidak Ditemukan</h2>
        <p className="mt-1 text-xs sm:text-sm text-slate-500">
          {error ?? "Data reservasi tidak tersedia atau tautan tidak valid."}
        </p>
        <Link
          href="/member/reservasi"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#12132E] px-5 py-2.5 text-xs font-semibold text-white hover:bg-slate-800 transition-colors"
        >
          Lihat Status Pemesanan
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-6 py-6 pb-16 text-center">
      {/* Animated Success Icon */}
      <div className="relative">
        <div className="pointer-events-none absolute inset-0 rounded-full bg-[#6367FF]/20 blur-xl animate-pulse" />
        <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-[#6367FF] to-[#8494FF] text-white shadow-xl shadow-[#6367FF]/30">
          <CheckCircle2 size={40} className="stroke-[2.5]" />
        </div>
      </div>

      {/* Header Info */}
      <div>
        <span className="inline-block rounded-full bg-[#FFDBFD] px-3.5 py-1 text-xs font-bold text-[#FF5DA2]">
          Menunggu Konfirmasi
        </span>
        <h1 className="mt-3 font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          Reservasi Berhasil Dibuat!
        </h1>
        <p className="mt-1.5 text-xs sm:text-sm text-slate-500 max-w-sm">
          Pemesananmu sudah masuk ke sistem dan sedang menunggu konfirmasi admin space.
        </p>
      </div>

      {/* Digital Receipt / Boarding Pass Card */}
      <div className="relative w-full overflow-hidden rounded-3xl bg-white border border-slate-100 shadow-xl shadow-slate-900/5 text-left">
        {/* Top Header Card */}
        <div className="bg-gradient-to-r from-[#12132E] to-[#1B1E52] p-6 text-white flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">Kode Booking</p>
            <p className="font-display text-2xl font-extrabold tracking-widest text-white mt-0.5">
              {reservasi.kode_booking}
            </p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-[#FF8FC2] backdrop-blur-md">
            <Ticket size={22} />
          </div>
        </div>

        {/* Notched Separator Effect */}
        <div className="relative flex items-center justify-between px-2 -my-2 z-10">
          <div className="h-4 w-4 rounded-full bg-[#F8F9FD] -ml-4 border-r border-slate-100" />
          <div className="flex-1 border-b-2 border-dashed border-slate-200 mx-2" />
          <div className="h-4 w-4 rounded-full bg-[#F8F9FD] -mr-4 border-l border-slate-100" />
        </div>

        {/* Content Details */}
        <div className="p-6 flex flex-col gap-4 text-xs">
          <div className="flex items-center justify-between py-1">
            <span className="flex items-center gap-2 text-slate-400 font-medium">
              <Calendar size={14} className="text-[#6367FF]" /> Tanggal Reservasi
            </span>
            <span className="font-bold text-slate-800">
              {formatDate(reservasi.tanggal_reservasi)}
            </span>
          </div>

          <div className="flex items-center justify-between py-1">
            <span className="flex items-center gap-2 text-slate-400 font-medium">
              <Clock size={14} className="text-[#6367FF]" /> Jam Pemakaian
            </span>
            <span className="font-bold text-slate-800">
              {reservasi.jam_mulai} – {reservasi.jam_selesai}
            </span>
          </div>

          <div className="flex items-center justify-between border-t border-slate-100 pt-4 font-medium">
            <span className="text-slate-600 font-semibold text-sm">Total Bayar</span>
            <span className="font-display text-lg font-bold text-[#6367FF]">
              {formatRupiah(reservasi.total_bayar)}
            </span>
          </div>
        </div>
      </div>

      {/* Action Links */}
      <div className="flex w-full flex-col gap-3">
        <Link
          href="/member/reservasi"
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#6367FF] px-6 py-3.5 text-xs font-bold text-white shadow-lg shadow-[#6367FF]/25 hover:bg-[#4A4FE0] transition-all"
        >
          Lihat Status Pemesanan
          <ArrowRight size={16} />
        </Link>
        <Link
          href="/member/dashboard"
          className="flex w-full items-center justify-center rounded-2xl bg-white px-6 py-3 text-xs font-semibold text-slate-600 border border-slate-200 hover:bg-slate-50 transition-colors"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}