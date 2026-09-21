import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Button from "@/components/ui/Button";

export default function LandingHero() {
  return (
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

      {/* Product mockup card — grounded in real booking data */}
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
  );
}
