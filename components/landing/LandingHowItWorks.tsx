import { Search, CalendarCheck, DoorOpen } from "lucide-react";

const STEPS = [
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
];

export default function LandingHowItWorks() {
  return (
    <section className="mx-auto max-w-[1200px] px-6 py-20 sm:px-10 lg:px-16">
      <h2 className="font-display text-2xl font-semibold text-ink-950 md:text-3xl">
        Tiga langkah, ruang siap dipakai
      </h2>

      <div className="mt-10 grid gap-8 md:grid-cols-3">
        {STEPS.map(({ step, icon: Icon, title, desc }) => (
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
  );
}
