import Link from "next/link";
import { Search, CalendarCheck, DoorOpen, ArrowRight } from "lucide-react";
import Button from "@/components/ui/Button";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-navy-gradient">
        <header className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-6 sm:px-10 lg:px-16">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 font-display text-sm font-bold text-white ring-1 ring-white/20">
              CW
            </div>
            <span className="font-display text-lg font-semibold text-white">Co-Work</span>
          </div>
          <Link href="/login">
            <Button
              size="sm"
              className="!border !border-white/20 !bg-white/10 !text-white hover:!bg-white/20"
            >
              Masuk
            </Button>
          </Link>
        </header>

        <section className="mx-auto grid max-w-[1440px] items-center gap-12 px-6 pb-24 pt-10 sm:px-10 md:grid-cols-[1.1fr_0.9fr] md:pb-32 md:pt-16 lg:px-16">
          <div
            className="opacity-0"
            style={{ animation: "fadeUp 0.7s ease 0.05s forwards" }}
          >
            <h1 className="font-display text-4xl font-bold leading-[1.1] text-white md:text-5xl">
              Ruang kerja yang siap, tepat saat kamu butuh.
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-blue-100/80 md:text-lg">
              Cari desk, meeting room, atau private office di sekitarmu, cek
              jadwalnya, lalu pesan dalam hitungan menit — tanpa telepon,
              tanpa nunggu konfirmasi manual.
            </p>
            <Link href="/login" className="mt-8 inline-block">
              <Button size="lg" className="gap-2 !bg-white !text-navy-900 hover:!bg-blue-50">
                Mulai Booking
                <ArrowRight size={18} />
              </Button>
            </Link>
          </div>

          {/* Product mockup card — grounded in real booking data, not decoration */}
          <div
            className="relative opacity-0"
            style={{ animation: "fadeUp 0.7s ease 0.2s forwards" }}
          >
            <div className="mx-auto w-full max-w-sm rotate-2 rounded-2xl bg-white p-5 shadow-2xl">
              <div className="flex items-center justify-between">
                <p className="font-display text-sm font-semibold text-ink-950">
                  Meeting Room A
                </p>
                <span className="flex items-center gap-1.5 rounded-full bg-status-active/10 px-2.5 py-1 text-xs font-medium text-status-active">
                  <span className="h-1.5 w-1.5 rounded-full bg-status-active" />
                  Disetujui
                </span>
              </div>
              <div className="mt-4 space-y-2 text-sm text-ink-600">
                <div className="flex justify-between">
                  <span>Tanggal</span>
                  <span className="font-medium text-ink-950">18 Sep 2026</span>
                </div>
                <div className="flex justify-between">
                  <span>Jam</span>
                  <span className="font-medium text-ink-950">13:00 – 15:00</span>
                </div>
                <div className="flex justify-between">
                  <span>Kapasitas</span>
                  <span className="font-medium text-ink-950">8 orang</span>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-surface-200 pt-4">
                <span className="text-sm text-ink-600">Total</span>
                <span className="font-display text-base font-semibold text-ink-950">
                  Rp 200.000
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Cara kerja — sequence asli, jadi penomoran di sini bermakna */}
      <section className="mx-auto max-w-[1200px] px-6 py-20 sm:px-10 lg:px-16">
        <h2 className="font-display text-2xl font-semibold text-ink-950 md:text-3xl">
          Tiga langkah, ruang siap dipakai
        </h2>

        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {[
            {
              step: "1",
              icon: Search,
              title: "Cari ruang",
              desc: "Jelajahi katalog space berdasarkan tipe, kapasitas, dan lokasi yang kamu mau.",
            },
            {
              step: "2",
              icon: CalendarCheck,
              title: "Pesan jadwal",
              desc: "Pilih tanggal dan jam, pakai kode promo kalau ada, lalu konfirmasi.",
            },
            {
              step: "3",
              icon: DoorOpen,
              title: "Datang & kerja",
              desc: "Tunjukkan e-ticket saat check-in, dan ruangan siap kamu pakai.",
            },
          ].map(({ step, icon: Icon, title, desc }) => (
            <div key={step}>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                <Icon size={20} />
              </div>
              <p className="mt-4 font-display text-sm font-semibold text-brand-600">
                Langkah {step}
              </p>
              <h3 className="mt-1 font-display text-lg font-medium text-ink-950">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-600">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-surface-200 px-6 py-8 text-center text-sm text-ink-600 sm:px-10 lg:px-16">
        © 2026 Co-Work. Booking ruang kerja jadi lebih simpel.
      </footer>
    </div>
  );
}