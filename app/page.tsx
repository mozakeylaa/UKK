"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Building2, 
  Ticket, 
  CreditCard, 
  Calendar,
  ChevronDown,
  Sparkles,
  HelpCircle,
  CheckCircle2,
  Zap,
  ShieldCheck,
  Coffee
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

const FACTS = [
  { angka: "100%", label: "Koneksi Dedicated Fiber 300 Mbps", icon: Zap },
  { angka: "24/7", label: "Akses & Pengawasan CCTV Terpadu", icon: ShieldCheck },
  { angka: "0 Antre", label: "Booking Digital Langsung Dapat E-Ticket", icon: Ticket },
  { angka: "Free Flow", label: "Kopi, Teh & Air Mineral Sepuasnya", icon: Coffee },
];

const FAQS = [
  {
    q: "Bagaimana cara melakukan reservasi ruangan?",
    a: "Pilih ruangan yang kamu butuhkan, tentukan tanggal serta jam sewa, lalu klik Booking. E-Ticket digital resmi dengan QR Code akan otomatis terbit dan siap ditunjukkan saat check-in.",
  },
  {
    q: "Apakah saya bisa membatalkan atau mengubah jadwal booking?",
    a: "Bisa. Kamu dapat mengelola atau mengajukan pembatalan jadwal sewa melalui menu Histori Reservasi di dashboard member sebelum waktu sewa berlangsung.",
  },
  {
    q: "Fasilitas apa saja yang didapat di Personal Desk maupun Meeting Room?",
    a: "Setiap pemesanan sudah mencakup stopkontak personal, kursi kerja ergonomis, WiFi kencang tanpa kuota, free flow drink (kopi/teh), dan akses ke area lounge santai.",
  },
  {
    q: "Apakah ada diskon atau promo khusus untuk pemesanan rutin?",
    a: "Ya! Co-Work secara berkala merilis kode promo potongan harga bulanan yang dapat dicek langsung saat reservasi maupun di halaman member.",
  },
];

export default function HomePage() {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [spaceTypes, setSpaceTypes] = useState<SpaceType[]>([]);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

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

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const scrollToTarget = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const elem = document.getElementById(targetId);
    if (elem) {
      elem.scrollIntoView({ behavior: "smooth", block: "start" });
      elem.classList.add("ring-4", "ring-[#6367FF]/30", "transition-all", "duration-500", "rounded-3xl");
      setTimeout(() => {
        elem.classList.remove("ring-4", "ring-[#6367FF]/30");
      }, 1200);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FD] text-slate-900 selection:bg-[#FF8FC2] selection:text-white scroll-smooth">
      {/* =========================================================================
          FIRST VIEWPORT (DESKTOP: h-screen overflow-hidden | MOBILE: min-h-screen)
      ========================================================================= */}
      <div className="relative flex flex-col justify-between bg-navy-gradient text-white min-h-screen lg:h-screen lg:overflow-hidden">
        {/* Top Navbar */}
        <header className="z-40 bg-[#12132E]/95 backdrop-blur-md border-b border-white/10 shrink-0">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            {/* Brand Logo */}
            <Link href="/" className="group flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FF8FC2] to-[#FF5DA2] font-display text-sm font-bold text-white shadow-md shadow-[#FF5DA2]/30 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3">
                CW
              </div>
              <span className="font-display text-base font-bold text-white tracking-wide">
                Co-Work <span className="font-normal text-slate-400 text-xs">space</span>
              </span>
            </Link>

            {/* Center Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              <a
                href="#about"
                onClick={(e) => scrollToTarget(e, "about")}
                className="text-sm font-medium text-slate-300 hover:text-white transition-colors duration-200 cursor-pointer"
              >
                About Us
              </a>
              <a
                href="#fnq"
                onClick={(e) => scrollToTarget(e, "fnq")}
                className="text-sm font-medium text-slate-300 hover:text-white transition-colors duration-200 cursor-pointer"
              >
                FnQ
              </a>
            </nav>

            {/* Right CTA Buttons */}
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="rounded-full bg-white/10 px-5 py-2 text-xs font-semibold text-white border border-white/20 hover:bg-white/20 hover:-translate-y-0.5 transition-all duration-200"
              >
                Masuk
              </Link>
              <Link
                href="/register/member"
                className="relative rounded-full bg-gradient-to-r from-[#FF5DA2] to-[#FF8FC2] px-5 py-2 text-xs font-bold text-white shadow-lg shadow-[#FF5DA2]/30 hover:opacity-95 hover:shadow-[#FF5DA2]/50 hover:-translate-y-0.5 transition-all duration-200"
              >
                Booking Sekarang
              </Link>
            </div>
          </div>
        </header>

        {/* Hero Content Area */}
        <section className="relative flex-1 flex items-center px-6 py-8 lg:py-0">
          <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-[#8494FF]/20 blur-3xl" />
          <div className="pointer-events-none absolute -left-20 top-1/2 h-80 w-80 rounded-full bg-[#FF8FC2]/15 blur-3xl" />

          <div className="mx-auto w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
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
                  href="#about"
                  onClick={(e) => scrollToTarget(e, "about")}
                  className="rounded-full bg-white/10 px-6 py-3 text-xs font-semibold text-white border border-white/20 hover:bg-white/20 transition-all cursor-pointer"
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

        {/* =========================================================================
            RUNNING TICKER (DESKTOP: NEMPEL DI DASAR LAYAR | HP: MUNCUL PAS DI BAWAH HERO)
        ========================================================================= */}
        <div className="w-full overflow-hidden bg-[#12132E] py-3.5 border-t border-white/10 group cursor-default shrink-0">
          <div className="animate-marquee-right flex gap-8">
            {[...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
              <div key={i} className="flex items-center gap-6 whitespace-nowrap text-xs sm:text-sm font-semibold text-white">
                <span>{item}</span>
                <span className="text-[#FF5DA2]">✦</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTION: KENAPA CO-WORK
      ========================================================================= */}
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

      {/* =========================================================================
          SECTION: TIGA TIPE RUANG
      ========================================================================= */}
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

      {/* =========================================================================
          SECTION: ABOUT US & FACTS + FNQ ACCORDION (LIGHT & SOFT GRADIENT THEME)
      ========================================================================= */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#F8F9FD] via-[#F3F5FD] to-[#EEF2FF] py-24 px-6 border-t border-slate-200/60 text-slate-900">
        <div className="pointer-events-none absolute -left-20 top-20 h-72 w-72 rounded-full bg-[#FF8FC2]/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 bottom-20 h-80 w-80 rounded-full bg-[#8494FF]/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl flex flex-col gap-20">
          
          {/* Target scroll: About Us & Fakta Menarik */}
          <div id="about" className="scroll-mt-28 flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-xs font-bold text-[#FF5DA2] border border-[#FFDBFD] shadow-xs mb-4">
              <Sparkles size={14} />
              <span>About Us &amp; Space Facts</span>
            </div>
            
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold max-w-2xl leading-tight text-slate-900">
              Dibuat untuk Pengalaman Kerja Nyaman Tanpa Ribet
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-slate-500 max-w-xl leading-relaxed">
              Co-Work hadir menyederhanakan akses ruangan profesional. Tanpa ikatan kontrak panjang, tanpa antre administrasi manual — semua reservasi tercatat instan secara digital.
            </p>

            {/* Grid 4 Fakta Ruang - Light Cards */}
            <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-4 w-full">
              {FACTS.map((item, idx) => {
                const IconComp = item.icon;
                return (
                  <div
                    key={idx}
                    className="flex flex-col items-center justify-center p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:border-[#6367FF]/40 hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#EEEFFF] text-[#6367FF] mb-3">
                      <IconComp size={20} />
                    </div>
                    <span className="font-display text-2xl font-extrabold text-[#FF5DA2]">
                      {item.angka}
                    </span>
                    <p className="mt-1.5 text-center text-xs font-semibold text-slate-600">
                      {item.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Target scroll: FnQ (Accordion Pertanyaan & Jawaban) */}
          <div id="fnq" className="scroll-mt-28 flex flex-col items-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#EEEFFF] px-3.5 py-1 text-xs font-bold text-[#6367FF] mb-3">
              <HelpCircle size={14} />
              <span>Pertanyaan Umum</span>
            </div>
            <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-center text-slate-900">
              Frequently Asked Questions (FnQ)
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-slate-500 text-center max-w-md">
              Klik pertanyaan di bawah ini untuk melihat fakta dan jawaban seputar layanan Co-Work.
            </p>

            {/* List Accordion FnQ - Light Theme */}
            <div className="mt-8 flex w-full max-w-3xl flex-col gap-3.5">
              {FAQS.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;

                return (
                  <div
                    key={idx}
                    className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                      isOpen
                        ? "bg-white border-[#6367FF]/30 shadow-md ring-1 ring-[#6367FF]/10"
                        : "bg-white/80 border-slate-200 hover:border-slate-300 hover:bg-white shadow-xs"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(idx)}
                      className="flex w-full items-center justify-between p-4 sm:p-5 text-left gap-4 cursor-pointer focus:outline-none"
                    >
                      <span className="flex items-center gap-3 text-xs sm:text-sm font-bold text-slate-900">
                        <CheckCircle2
                          size={18}
                          className={isOpen ? "text-[#6367FF] shrink-0" : "text-slate-400 shrink-0"}
                        />
                        {faq.q}
                      </span>
                      <ChevronDown
                        size={18}
                        className={`text-slate-400 transition-transform duration-300 shrink-0 ${
                          isOpen ? "rotate-180 text-[#6367FF]" : ""
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pl-11">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          BANNER CALL TO ACTION
      ========================================================================= */}
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

      {/* =========================================================================
          FOOTER
      ========================================================================= */}
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
              <li>
                <a 
                  href="#about" 
                  onClick={(e) => scrollToTarget(e, "about")}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  About Us
                </a>
              </li>
              <li>
                <a 
                  href="#fnq" 
                  onClick={(e) => scrollToTarget(e, "fnq")}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  FnQ
                </a>
              </li>
              <li><a href="#" className="hover:text-white transition-colors">Kontak</a></li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <p className="text-xs font-bold text-white uppercase tracking-wider">Bantuan</p>
            <ul className="mt-4 space-y-2 text-xs text-slate-400">
              <li>
                <a 
                  href="#fnq" 
                  onClick={(e) => scrollToTarget(e, "fnq")}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Pusat Bantuan
                </a>
              </li>
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