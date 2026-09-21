"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Building2, 
  Ticket, 
  CreditCard, 
  Calendar
} from "lucide-react";
import { getSpaces, getSpaceTypes } from "@/lib/api/space";
import { isApiSuccess } from "@/lib/types/api";
import type { Space, SpaceType, SpaceTipe } from "@/lib/types/space";

const TICKER_ITEMS = [
  "Private Office",
  "Bebas Antre",
  "Booking Instan",
  "WiFi Kencang",
  "Personal Desk",
  "Meeting Room",
];

export default function HomePage() {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [spaceTypes, setSpaceTypes] = useState<SpaceType[]>([]);

  useEffect(() => {
    Promise.all([getSpaces(), getSpaceTypes()])
      .then(([spacesRes, typesRes]) => {
        if (isApiSuccess(spacesRes)) setSpaces((spacesRes.data ?? []).slice(0, 3));
        if (isApiSuccess(typesRes)) setSpaceTypes(typesRes.data ?? []);
      })
      .catch(() => {});
  }, []);

  const typeLabel = (tipe: SpaceTipe) =>
    spaceTypes.find((t) => t.tipe === tipe)?.label ?? tipe;

  return (
    <div className="min-h-screen bg-[#F8F9FD] text-slate-900 selection:bg-[#FF8FC2] selection:text-white">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-[#12132E]/95 backdrop-blur-md border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FF8FC2] to-[#FF5DA2] font-display text-sm font-bold text-white shadow-md shadow-[#FF5DA2]/30">
              CW
            </div>
            <span className="font-display text-base font-bold text-white tracking-wide">
              Co-Work <span className="font-normal text-slate-400 text-xs">space</span>
            </span>
          </Link>

          {/* Center Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <a href="#kenapa" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Kenapa Kami
            </a>
            <a href="#ruang" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Harga
            </a>
          </nav>

          {/* Right CTA Buttons */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-full bg-white/10 px-5 py-2 text-xs font-semibold text-white border border-white/20 hover:bg-white/20 transition-all"
            >
              Masuk
            </Link>
            <Link
              href="/register/member"
              className="rounded-full bg-gradient-to-r from-[#FF5DA2] to-[#FF8FC2] px-5 py-2 text-xs font-bold text-white shadow-lg shadow-[#FF5DA2]/30 hover:opacity-95 transition-all"
            >
              Booking Sekarang
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-navy-gradient pt-14 pb-20 text-white">
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-[#8494FF]/20 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 top-1/2 h-80 w-80 rounded-full bg-[#FF8FC2]/15 blur-3xl" />

        <div className="mx-auto max-w-7xl px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Hero Content */}
          <div className="lg:col-span-7 flex flex-col items-start">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-medium text-slate-200 border border-white/15">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#FF5DA2] text-[10px] text-white font-bold">
                A
              </span>
              240+ ruang siap pakai hari ini
            </div>

            <h1 className="mt-6 font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.15] text-white">
              Ruang kerja yang <br />
              <span className="text-white">selalu ada saat kamu</span> <br />
              <span className="text-white">butuh.</span>
            </h1>

            <p className="mt-5 max-w-xl text-sm sm:text-base leading-relaxed text-slate-300">
              Dari meja tenang untuk fokus sendiri sampai ruang meeting untuk tim — cek jadwal, pilih jam kosong, dan ruangan langsung jadi milikmu.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <Link
                href="/register/member"
                className="rounded-full bg-gradient-to-r from-[#FF5DA2] to-[#FF8FC2] px-6 py-3 text-xs font-bold text-white shadow-lg shadow-[#FF5DA2]/30 hover:opacity-95 transition-all"
              >
                Cari Ruang Sekarang
              </Link>
              <a
                href="#kenapa"
                className="rounded-full bg-white/10 px-6 py-3 text-xs font-semibold text-white border border-white/20 hover:bg-white/20 transition-all"
              >
                Lihat Cara Kerja
              </a>
            </div>

            {/* Social Proof */}
            <div className="mt-10 flex items-center gap-3">
              <div className="flex -space-x-2">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#6367FF] text-[10px] font-bold text-white ring-2 ring-[#12132E]">A</span>
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#FF5DA2] text-[10px] font-bold text-white ring-2 ring-[#12132E]">R</span>
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#8494FF] text-[10px] font-bold text-white ring-2 ring-[#12132E]">D</span>
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-700 text-[10px] font-bold text-white ring-2 ring-[#12132E]">+</span>
              </div>
              <p className="text-xs font-medium text-slate-300">
                <span className="font-bold text-white">2.400+</span> profesional sudah booking bulan ini
              </p>
            </div>
          </div>

          {/* Right Hero Preview Card */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="flex-1 rounded-2xl bg-white/10 p-3.5 backdrop-blur-md border border-white/10">
                <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-300">Jam Tersedia</p>
                <p className="text-xs font-bold text-white mt-0.5">09:00 – 17:00</p>
              </div>
              <div className="flex-1 rounded-2xl bg-white/10 p-3.5 backdrop-blur-md border border-white/10">
                <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-300">Rata-rata Booking</p>
                <p className="text-xs font-bold text-white mt-0.5 flex items-center gap-1">
                  <span className="text-amber-400">⚡</span> 3 menit
                </p>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-5 text-slate-900 shadow-2xl border border-slate-100">
              <div className="relative aspect-[16/10] w-full rounded-2xl bg-[#C9BEFF]/30 overflow-hidden flex items-center justify-center p-4">
                <div className="w-full h-full rounded-xl bg-gradient-to-tr from-[#8494FF]/20 to-[#FFDBFD]/40 flex items-center justify-center">
                  <Building2 size={48} className="text-[#6367FF]/60" />
                </div>
                <div className="absolute top-3 right-3 h-8 w-8 rounded-full bg-[#FFDBFD]" />
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className="rounded-full bg-slate-900 px-3 py-1 text-[11px] font-semibold text-white">
                  Meeting Room
                </span>
                <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> Tersedia
                </span>
              </div>

              <div className="mt-3">
                <h3 className="font-display text-base font-bold text-slate-900">Ruang Meeting Cendana</h3>
                <p className="text-xs text-slate-400 mt-0.5">Lantai 3 &bull; Kapasitas 8 orang</p>
              </div>

              <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-100">
                <div>
                  <span className="font-display text-base font-bold text-[#6367FF]">Rp45.000</span>
                  <span className="text-xs text-slate-400"> /jam</span>
                </div>
                <Link
                  href="/register/member"
                  className="rounded-full bg-slate-900 px-5 py-2 text-xs font-bold text-white hover:bg-slate-800 transition-colors"
                >
                  Pesan
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Running Marquee Ticker */}
      <div className="overflow-hidden bg-[#12132E] py-3.5 border-y border-white/10">
        <div className="flex w-max animate-[marquee_25s_linear_infinite] gap-8">
          {[...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <div key={i} className="flex items-center gap-6 whitespace-nowrap text-xs sm:text-sm font-semibold text-white">
              <span>{item}</span>
              <span className="text-[#FF5DA2]">✦</span>
            </div>
          ))}
        </div>
      </div>

      {/* Section: Kenapa Co-Work */}
      <section id="kenapa" className="mx-auto max-w-7xl px-6 py-20">
        <div className="flex items-center gap-2 text-xs font-bold text-[#FF5DA2] uppercase tracking-wider">
          <span className="h-0.5 w-6 bg-[#FF5DA2]" />
          Kenapa Co-Work
        </div>
        <h2 className="mt-3 font-display text-3xl sm:text-4xl font-extrabold text-slate-900 max-w-xl leading-tight">
          Bukan cuma ruangan kosong, tapi ruang kerja yang siap dipakai
        </h2>
        <p className="mt-3 text-sm text-slate-500 max-w-xl">
          Semua yang kamu butuhkan buat kerja fokus atau meeting tim, tanpa drama booking manual.
        </p>

        {/* Feature Bento Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-7 relative overflow-hidden rounded-3xl bg-navy-gradient p-8 text-white min-h-[220px] flex flex-col justify-between shadow-lg shadow-slate-900/5">
            <div className="pointer-events-none absolute right-0 top-0 h-48 w-48 rounded-full bg-[#8494FF]/25 blur-3xl" />
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-white backdrop-blur-sm">
              <Calendar size={20} />
            </div>
            <div className="relative z-10 mt-12">
              <h3 className="font-display text-lg font-bold text-white">Booking instan tanpa nunggu</h3>
              <p className="mt-1 text-xs text-slate-300 leading-relaxed max-w-md">
                Ketersediaan ruang terhubung langsung secara real-time. Pilih jadwal dan konfirmasi langsung selesai.
              </p>
            </div>
          </div>

          <div className="md:col-span-5 rounded-3xl bg-[#6367FF] p-8 text-white min-h-[220px] flex flex-col justify-between shadow-lg shadow-[#6367FF]/20">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/20 text-white backdrop-blur-sm">
              <Building2 size={20} />
            </div>
            <div className="mt-12">
              <h3 className="font-display text-lg font-bold text-white">10+ lokasi strategis</h3>
              <p className="mt-1 text-xs text-white/80 leading-relaxed">
                Tersebar di titik-titik yang mudah dijangkau, dekat transportasi umum dan pusat bisnis.
              </p>
            </div>
          </div>

          <div className="md:col-span-4 rounded-3xl bg-white p-8 border border-slate-100 shadow-sm flex flex-col justify-between min-h-[200px]">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FFDBFD] text-[#FF5DA2]">
              <Ticket size={20} />
            </div>
            <div className="mt-8">
              <h3 className="font-display text-base font-bold text-slate-900">Promo rutin</h3>
              <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                Kode diskon buat member baru dan pengguna setia tiap bulan.
              </p>
            </div>
          </div>

          <div className="md:col-span-8 rounded-3xl bg-gradient-to-br from-[#FFDBFD] to-[#FF8FC2]/40 p-8 border border-[#FFDBFD] flex flex-col justify-between min-h-[200px]">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[#FF5DA2] shadow-sm">
              <CreditCard size={20} />
            </div>
            <div className="mt-8">
              <h3 className="font-display text-lg font-bold text-slate-900">Bayar sesuai jam pakai</h3>
              <p className="mt-1 text-xs text-slate-600 leading-relaxed max-w-lg">
                Gak ada biaya tersembunyi — bayar cuma untuk durasi yang benar-benar kamu pesan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section: Tiga Tipe Ruang */}
      <section id="ruang" className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex items-center gap-2 text-xs font-bold text-[#FF5DA2] uppercase tracking-wider">
          <span className="h-0.5 w-6 bg-[#FF5DA2]" />
          Jelajahi Ruang
        </div>
        <h2 className="mt-3 font-display text-3xl sm:text-4xl font-extrabold text-slate-900">
          Tiga tipe ruang, satu platform
        </h2>
        <p className="mt-2 text-sm text-slate-500 max-w-lg">
          Pilih sesuai kebutuhan hari ini — kerja sendiri, diskusi tim kecil, atau kantor privat jangka panjang.
        </p>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Personal Desk */}
          <div className="rounded-3xl bg-white border border-slate-100 shadow-sm overflow-hidden flex flex-col">
            <div className="relative h-44 w-full bg-[#8494FF] p-4 flex flex-col justify-between text-white">
              <span className="self-start rounded-full bg-white/20 px-3 py-1 text-[11px] font-bold backdrop-blur-md">
                Personal Desk
              </span>
              <div className="h-16 w-3/4 rounded-2xl bg-white/20 backdrop-blur-sm self-center" />
            </div>
            <div className="p-6 flex flex-col flex-1 justify-between">
              <div>
                <h3 className="font-display text-base font-bold text-slate-900">Desk Fokus Individu</h3>
                <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">
                  Meja pribadi dengan colokan listrik dan lampu kerja, cocok untuk kerja sendiri seharian.
                </p>
              </div>
              <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-100">
                <p className="text-sm font-bold text-slate-900">
                  Rp15.000<span className="text-xs font-normal text-slate-400">/jam</span>
                </p>
                <span className="text-xs text-slate-500 font-medium">1 orang</span>
              </div>
            </div>
          </div>

          {/* Card 2: Meeting Room */}
          <div className="rounded-3xl bg-white border border-slate-100 shadow-sm overflow-hidden flex flex-col">
            <div className="relative h-44 w-full bg-[#FF5DA2] p-4 flex flex-col justify-between text-white">
              <span className="self-start rounded-full bg-white/20 px-3 py-1 text-[11px] font-bold backdrop-blur-md">
                Meeting Room
              </span>
              <div className="h-16 w-3/4 rounded-2xl bg-white/20 backdrop-blur-sm self-center" />
            </div>
            <div className="p-6 flex flex-col flex-1 justify-between">
              <div>
                <h3 className="font-display text-base font-bold text-slate-900">Ruang Diskusi Cendana</h3>
                <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">
                  Dilengkapi layar presentasi dan whiteboard, pas untuk rapat tim sampai 8 orang.
                </p>
              </div>
              <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-100">
                <p className="text-sm font-bold text-slate-900">
                  Rp45.000<span className="text-xs font-normal text-slate-400">/jam</span>
                </p>
                <span className="text-xs text-slate-500 font-medium">8 orang</span>
              </div>
            </div>
          </div>

          {/* Card 3: Private Office */}
          <div className="rounded-3xl bg-white border border-slate-100 shadow-sm overflow-hidden flex flex-col">
            <div className="relative h-44 w-full bg-[#1B1E52] p-4 flex flex-col justify-between text-white">
              <span className="self-start rounded-full bg-white/20 px-3 py-1 text-[11px] font-bold backdrop-blur-md">
                Private Office
              </span>
              <div className="h-16 w-3/4 rounded-2xl bg-white/20 backdrop-blur-sm self-center" />
            </div>
            <div className="p-6 flex flex-col flex-1 justify-between">
              <div>
                <h3 className="font-display text-base font-bold text-slate-900">Kantor Privat Melati</h3>
                <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">
                  Ruang tertutup dengan akses eksklusif, ideal untuk kerja tim kecil jangka panjang.
                </p>
              </div>
              <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-100">
                <p className="text-sm font-bold text-slate-900">
                  Rp90.000<span className="text-xs font-normal text-slate-400">/jam</span>
                </p>
                <span className="text-xs text-slate-500 font-medium">10 orang</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Banner Call to Action */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="relative overflow-hidden rounded-3xl bg-navy-gradient px-8 py-12 md:px-12 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl shadow-slate-900/10 text-white">
          <div className="pointer-events-none absolute -right-10 -bottom-10 h-60 w-60 rounded-full bg-[#6367FF]/30 blur-3xl" />
          <div className="relative z-10">
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight">
              Ruangmu menunggu, tinggal satu klik lagi.
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-md">
              Buat akun gratis dan mulai booking ruang kerja pertamamu hari ini.
            </p>
          </div>
          <Link
            href="/register/member"
            className="relative z-10 inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-[#FF5DA2] to-[#FF8FC2] px-6 py-3 text-xs font-bold text-white shadow-lg shadow-[#FF5DA2]/30 hover:opacity-95 transition-all"
          >
            Daftar Gratis
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#12132E] text-white px-6 pt-16 pb-12 border-t border-white/10">
        <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF8FC2] to-[#FF5DA2] font-display text-xs font-bold text-white">
                CW
              </div>
              <span className="font-display text-base font-bold text-white">Co-Work</span>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-slate-400 max-w-sm">
              Platform booking ruang kerja, meeting room, dan kantor privat — cepat, tanpa antre.
            </p>
          </div>

          <div className="md:col-span-2">
            <p className="text-xs font-bold text-white uppercase tracking-wider">Produk</p>
            <ul className="mt-4 space-y-2 text-xs text-slate-400">
              <li><a href="#ruang" className="hover:text-white transition-colors">Personal Desk</a></li>
              <li><a href="#ruang" className="hover:text-white transition-colors">Meeting Room</a></li>
              <li><a href="#ruang" className="hover:text-white transition-colors">Private Office</a></li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <p className="text-xs font-bold text-white uppercase tracking-wider">Perusahaan</p>
            <ul className="mt-4 space-y-2 text-xs text-slate-400">
              <li><a href="#kenapa" className="hover:text-white transition-colors">Tentang Kami</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Karier</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Kontak</a></li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <p className="text-xs font-bold text-white uppercase tracking-wider">Bantuan</p>
            <ul className="mt-4 space-y-2 text-xs text-slate-400">
              <li><a href="#" className="hover:text-white transition-colors">Pusat Bantuan</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Syarat &amp; Ketentuan</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privasi</a></li>
            </ul>
          </div>
        </div>

        <div className="mx-auto max-w-7xl mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-4">
          <p>© 2026 Co-Work. Semua hak dilindungi.</p>
          <p>Dibuat untuk ruang kerja yang lebih simpel.</p>
        </div>
      </footer>
    </div>
  );
}