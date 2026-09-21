"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Hourglass, 
  CalendarCheck, 
  Building2, 
  Coins, 
  Plus, 
  Users, 
  Armchair,
  Layers
} from "lucide-react";
import { useAuth } from "@/lib/context/AuthContext";

type FilterTab = "semua" | "menunggu" | "aktif";

const SAMPLE_RESERVATIONS = [
  {
    id: "1",
    nama: "Queen Aulia",
    username: "@queen",
    avatarBg: "bg-gradient-to-br from-[#FF8FC2] to-[#FF5DA2]",
    space: "Ruang Meeting Cendana",
    jadwalTgl: "18 Sep",
    jadwalJam: "13:00–15:00",
    total: "Rp90.000",
    status: "Disetujui",
    statusVariant: "approved",
  },
  {
    id: "2",
    nama: "Raka Aditya",
    username: "@raka",
    avatarBg: "bg-gradient-to-br from-[#6367FF] to-[#8494FF]",
    space: "Desk Fokus Individu",
    jadwalTgl: "18 Sep",
    jadwalJam: "09:00–12:00",
    total: "Rp45.000",
    status: "Menunggu",
    statusVariant: "pending",
  },
  {
    id: "3",
    nama: "Dinda Putri",
    username: "@dinda",
    avatarBg: "bg-gradient-to-br from-emerald-500 to-teal-600",
    space: "Kantor Privat Melati",
    jadwalTgl: "17 Sep",
    jadwalJam: "08:00–17:00",
    total: "Rp810.000",
    status: "Aktif",
    statusVariant: "active",
  },
];

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [filter, setFilter] = useState<FilterTab>("semua");

  const filteredReservations = SAMPLE_RESERVATIONS.filter((item) => {
    if (filter === "menunggu") return item.statusVariant === "pending";
    if (filter === "aktif") return item.statusVariant === "active";
    return true;
  });

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Header Greeting */}
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          Halo, {user?.nama ?? "Admin"} <span className="inline-block animate-[wave_1.5s_infinite]">👋</span>
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Berikut ringkasan pengelolaan coworking space kamu.
        </p>
      </div>

      {/* Top 4 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Belum dikonfirmasi (Highlight Card) */}
        <div className="relative overflow-hidden rounded-2xl bg-[#6367FF] p-5 text-white shadow-lg shadow-[#6367FF]/20 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md">
              <Hourglass size={18} className="text-white" />
            </div>
            <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-semibold backdrop-blur-md">
              Baru
            </span>
          </div>
          <div className="mt-4">
            <p className="text-xs font-medium text-white/80">Belum dikonfirmasi</p>
            <p className="text-2xl font-bold font-display mt-0.5">4</p>
          </div>
        </div>

        {/* Card 2: Reservasi Aktif */}
        <div className="rounded-2xl bg-white p-5 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EEEFFF] text-[#6367FF]">
            <CalendarCheck size={18} />
          </div>
          <div className="mt-4">
            <p className="text-xs font-medium text-slate-400">Reservasi aktif</p>
            <p className="text-2xl font-bold font-display text-slate-800 mt-0.5">9</p>
          </div>
        </div>

        {/* Card 3: Total Space */}
        <div className="rounded-2xl bg-white p-5 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FFDBFD] text-[#FF5DA2]">
            <Building2 size={18} />
          </div>
          <div className="mt-4">
            <p className="text-xs font-medium text-slate-400">Total space</p>
            <p className="text-2xl font-bold font-display text-slate-800 mt-0.5">6</p>
          </div>
        </div>

        {/* Card 4: Pendapatan bulan ini */}
        <div className="rounded-2xl bg-white p-5 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Coins size={18} />
            </div>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              +12%
            </span>
          </div>
          <div className="mt-4">
            <p className="text-xs font-medium text-slate-400">Pendapatan bulan ini</p>
            <p className="text-2xl font-bold font-display text-slate-800 mt-0.5">Rp3,2jt</p>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Table & Right Action/Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Reservasi Terbaru (8 cols) */}
        <div className="lg:col-span-8 rounded-3xl bg-white p-6 border border-slate-100 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
            <div className="flex items-center gap-2">
              <span>📋</span>
              <h2 className="font-display text-base sm:text-lg font-bold text-slate-800">
                Reservasi terbaru
              </h2>
            </div>
            <Link
              href="/admin/reservasi"
              className="text-xs font-semibold text-[#6367FF] hover:underline"
            >
              Lihat semua &rarr;
            </Link>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 mb-4">
            {(["semua", "menunggu", "aktif"] as FilterTab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`rounded-full px-3.5 py-1 text-xs font-semibold capitalize transition-all ${
                  filter === tab
                    ? "bg-[#12132E] text-white"
                    : "text-slate-500 hover:bg-slate-100"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-400 font-medium border-b border-slate-100">
                  <th className="pb-3 font-semibold">Member</th>
                  <th className="pb-3 font-semibold">Space</th>
                  <th className="pb-3 font-semibold">Jadwal</th>
                  <th className="pb-3 font-semibold">Total</th>
                  <th className="pb-3 font-semibold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredReservations.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    {/* Member */}
                    <td className="py-3.5 pr-4">
                      <div className="flex items-center gap-2.5">
                        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white font-bold text-[11px] ${item.avatarBg}`}>
                          {item.nama.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">{item.nama}</p>
                          <p className="text-[11px] text-slate-400">{item.username}</p>
                        </div>
                      </div>
                    </td>

                    {/* Space */}
                    <td className="py-3.5 pr-4 text-slate-700 font-medium">
                      {item.space}
                    </td>

                    {/* Jadwal */}
                    <td className="py-3.5 pr-4 text-slate-500">
                      <div>{item.jadwalTgl}</div>
                      <div className="text-[11px] text-slate-400">{item.jadwalJam}</div>
                    </td>

                    {/* Total */}
                    <td className="py-3.5 pr-4 font-bold text-slate-800">
                      {item.total}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 text-right">
                      {item.statusVariant === "approved" && (
                        <span className="inline-block rounded-full bg-[#EEEFFF] px-2.5 py-0.5 font-semibold text-[#6367FF] text-[11px]">
                          Disetujui
                        </span>
                      )}
                      {item.statusVariant === "pending" && (
                        <span className="inline-block rounded-full bg-amber-50 px-2.5 py-0.5 font-semibold text-amber-600 text-[11px]">
                          Menunggu
                        </span>
                      )}
                      {item.statusVariant === "active" && (
                        <span className="inline-block rounded-full bg-emerald-50 px-2.5 py-0.5 font-semibold text-emerald-600 text-[11px]">
                          Aktif
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Add Space CTA & Populer Spaces (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Card: Tambah Space Baru */}
          <div className="relative overflow-hidden rounded-3xl bg-navy-gradient p-6 text-white shadow-xl shadow-slate-900/10">
            <div className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full bg-[#8494FF]/30 blur-xl" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <Building2 size={15} /> Tambah space baru
              </div>
              <p className="mt-2 text-xs leading-relaxed text-slate-300">
                Lengkapi katalog dengan ruang baru biar makin banyak pilihan buat member.
              </p>
              <Link
                href="/admin/spaces/baru"
                className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF5DA2] to-[#FF8FC2] px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-[#FF5DA2]/30 hover:opacity-95 transition-opacity w-full sm:w-auto"
              >
                <Plus size={14} /> Tambah Space
              </Link>
            </div>
          </div>

          {/* Card: Space Populer */}
          <div className="rounded-3xl bg-white p-6 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-800">Space populer</h3>
              <Link href="/admin/spaces" className="text-xs font-semibold text-[#6367FF] hover:underline">
                Kelola &rarr;
              </Link>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50/70 border border-slate-100">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#FFDBFD] text-[#FF5DA2]">
                  <Users size={16} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-800 truncate">Ruang Diskusi Cendana</p>
                  <p className="text-[11px] text-slate-400">14 reservasi bulan ini</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50/70 border border-slate-100">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#EEEFFF] text-[#6367FF]">
                  <Armchair size={16} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-800 truncate">Desk Fokus Individu</p>
                  <p className="text-[11px] text-slate-400">11 reservasi bulan ini</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}