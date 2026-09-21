"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  CalendarCheck, 
  Hourglass, 
  History, 
  Wallet, 
  Sparkles, 
  Ticket,
  ChevronRight,
  Armchair,
  Users,
  Building2
} from "lucide-react";
import { getSpaces, getSpaceTypes } from "@/lib/api/space";
import { isApiSuccess } from "@/lib/types/api";
import { useAuth } from "@/lib/context/AuthContext";
import type { Space, SpaceType, SpaceTipe } from "@/lib/types/space";
import { formatRupiah } from "@/lib/utils/format";
import Spinner from "@/components/ui/Spinner";

export default function MemberDashboardPage() {
  const { user } = useAuth();
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [spaceTypes, setSpaceTypes] = useState<SpaceType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getSpaces(), getSpaceTypes()])
      .then(([spacesRes, typesRes]) => {
        if (isApiSuccess(spacesRes)) {
          setSpaces(spacesRes.data ?? []);
        } else {
          setError(spacesRes.message);
        }
        if (isApiSuccess(typesRes)) {
          setSpaceTypes(typesRes.data ?? []);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err?.message ?? "Gagal memuat data dari server.");
        setIsLoading(false);
      });
  }, []);

  const typeLabel = (tipe: SpaceTipe) =>
    spaceTypes.find((t) => t.tipe === tipe)?.label ?? tipe;

  const getSpaceIcon = (tipe: string) => {
    switch (tipe.toLowerCase()) {
      case "meeting_room":
      case "meeting":
        return <Users size={18} className="text-[#6367FF]" />;
      case "private_office":
      case "private":
        return <Building2 size={18} className="text-[#6367FF]" />;
      default:
        return <Armchair size={18} className="text-[#6367FF]" />;
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Header Greeting */}
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          Halo, {user?.nama ?? "Member"} <span className="inline-block animate-[wave_1.5s_infinite]">👋</span>
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Ruang kerja favoritmu, tinggal satu klik lagi.
        </p>
      </div>

      {/* Top 4 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Reservasi Aktif (Highlight Card) */}
        <div className="relative overflow-hidden rounded-2xl bg-[#6367FF] p-5 text-white shadow-lg shadow-[#6367FF]/20 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md">
              <CalendarCheck size={18} className="text-white" />
            </div>
            <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs font-semibold backdrop-blur-md">
              +1
            </span>
          </div>
          <div className="mt-4">
            <p className="text-xs font-medium text-white/80">Reservasi aktif</p>
            <p className="text-2xl font-bold font-display mt-0.5">2</p>
          </div>
        </div>

        {/* Card 2: Menunggu Konfirmasi */}
        <div className="rounded-2xl bg-white p-5 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FFDBFD] text-[#FF5DA2]">
            <Hourglass size={18} />
          </div>
          <div className="mt-4">
            <p className="text-xs font-medium text-slate-400">Menunggu konfirmasi</p>
            <p className="text-2xl font-bold font-display text-slate-800 mt-0.5">1</p>
          </div>
        </div>

        {/* Card 3: Riwayat Bulan Ini */}
        <div className="rounded-2xl bg-white p-5 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EEEFFF] text-[#6367FF]">
            <History size={18} />
          </div>
          <div className="mt-4">
            <p className="text-xs font-medium text-slate-400">Riwayat bulan ini</p>
            <p className="text-2xl font-bold font-display text-slate-800 mt-0.5">6</p>
          </div>
        </div>

        {/* Card 4: Total Pengeluaran */}
        <div className="rounded-2xl bg-white p-5 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FFDBFD]/60 text-[#FF5DA2]">
            <Wallet size={18} />
          </div>
          <div className="mt-4">
            <p className="text-xs font-medium text-slate-400">Total pengeluaran</p>
            <p className="text-2xl font-bold font-display text-slate-800 mt-0.5">Rp270rb</p>
          </div>
        </div>
      </div>

      {/* Main Content Grid: Left (List Space & Recents) + Right (Promo & Progress) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Coworking Space List */}
          <div className="rounded-3xl bg-white p-6 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-slate-700 font-bold">🏛️</span>
                <h2 className="font-display text-base sm:text-lg font-bold text-slate-800">
                  Coworking space untukmu
                </h2>
              </div>
              <Link
                href="/member/spaces"
                className="text-xs font-semibold text-[#6367FF] hover:underline flex items-center gap-1"
              >
                Lihat semua &rarr;
              </Link>
            </div>

            {isLoading && (
              <div className="py-8">
                <Spinner label="Memuat rekomendasi space..." />
              </div>
            )}

            {!isLoading && error && (
              <p className="text-sm text-red-500 py-4">{error}</p>
            )}

            {!isLoading && !error && spaces.length === 0 && (
              <p className="text-sm text-slate-400 py-4">Belum ada space yang tersedia.</p>
            )}

            {!isLoading && !error && spaces.length > 0 && (
              <div className="flex flex-col divide-y divide-slate-100">
                {spaces.slice(0, 4).map((space) => (
                  <Link
                    key={space.id}
                    href={`/member/spaces/${space.id}`}
                    className="flex items-center justify-between py-3.5 px-2 rounded-xl transition-colors hover:bg-slate-50/80 group"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EEEFFF] group-hover:bg-[#C9BEFF]/40 transition-colors">
                        {getSpaceIcon(space.tipe)}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-800 group-hover:text-[#6367FF] transition-colors">
                          {space.nama_space}
                        </h3>
                        <p className="text-xs text-slate-400">
                          {typeLabel(space.tipe)} &bull; {space.kapasitas} orang
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-bold text-[#6367FF]">
                        {formatRupiah(space.harga_per_jam)}<span className="text-xs font-normal text-slate-400">/jam</span>
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Reservasi Terbaru Bar */}
          <div className="flex items-center justify-between rounded-2xl bg-white p-4 px-6 border border-slate-100 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <span>📋</span> Reservasi terbaru
            </div>
            <Link
              href="/member/histori"
              className="text-xs font-semibold text-[#6367FF] hover:underline"
            >
              Ke Status Pemesanan &rarr;
            </Link>
          </div>
        </div>

        {/* Right Column (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Promo Card Banner */}
          <div className="relative overflow-hidden rounded-3xl bg-navy-gradient p-6 text-white shadow-xl shadow-slate-900/10">
            <div className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full bg-[#8494FF]/30 blur-xl" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-xs font-bold text-[#FFDBFD]">
                <Ticket size={14} /> Punya kode promo?
              </div>
              <p className="mt-2 text-xs leading-relaxed text-slate-200">
                Pakai kode promo saat reservasi biar dapat potongan harga langsung.
              </p>
              <Link
                href="/member/spaces"
                className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF5DA2] to-[#FF8FC2] px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-[#FF5DA2]/30 hover:opacity-95 transition-opacity"
              >
                Cari Space &rarr;
              </Link>
            </div>
          </div>

          {/* Progres Member */}
          <div className="rounded-3xl bg-white p-6 border border-slate-100 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 mb-4">Progres member</h3>
            <div className="flex items-center gap-4">
              {/* Radial circle representation */}
              <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-4 border-[#FF5DA2] bg-white text-xs font-bold text-slate-700">
                68%
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">Level Reguler</p>
                <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                  3 reservasi lagi menuju member <span className="font-semibold text-amber-500">Gold</span> — diskon otomatis 5%.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}