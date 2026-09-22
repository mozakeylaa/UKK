"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { 
  Hourglass, 
  CalendarCheck, 
  Building2, 
  Coins, 
  Plus, 
  Users, 
  Armchair,
  Layers,
  RotateCw
} from "lucide-react";
import { useAuth } from "@/lib/context/AuthContext";
import { useAdminReservasi } from "@/lib/context/AdminReservasiContext";
import { getMonthlyReport } from "@/lib/api/admin-reports";
import { getAdminReservasiList } from "@/lib/api/admin-reservasi";
import { getAdminSpaces } from "@/lib/api/admin-spaces";
import { isApiSuccess } from "@/lib/types/api";
import type { MonthlyReport, AdminSpace } from "@/lib/types/admin";
import type { Reservasi } from "@/lib/types/reservasi";
import { formatRupiah, formatDate } from "@/lib/utils/format";
import Spinner from "@/components/ui/Spinner";

type FilterTab = "semua" | "menunggu" | "aktif";

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const { pendingCount, refreshCount } = useAdminReservasi();
  const [filter, setFilter] = useState<FilterTab>("semua");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [reservations, setReservations] = useState<Reservasi[]>([]);
  const [spaces, setSpaces] = useState<AdminSpace[]>([]);
  const [monthlyReport, setMonthlyReport] = useState<MonthlyReport | null>(null);

  const fetchDashboardData = useCallback(async (isBackground = false) => {
    try {
      if (!isBackground) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      const now = new Date();
      const currentMonth = now.getMonth() + 1;
      const currentYear = now.getFullYear();

      const [resReport, resReservasi, resSpaces] = await Promise.allSettled([
        getMonthlyReport({ month: currentMonth, year: currentYear }),
        getAdminReservasiList(),
        getAdminSpaces(),
      ]);

      if (resReport.status === "fulfilled" && isApiSuccess(resReport.value) && resReport.value.data) {
        setMonthlyReport(resReport.value.data);
      }

      if (resReservasi.status === "fulfilled" && isApiSuccess(resReservasi.value) && Array.isArray(resReservasi.value.data)) {
        setReservations(resReservasi.value.data);
      }

      if (resSpaces.status === "fulfilled" && isApiSuccess(resSpaces.value) && Array.isArray(resSpaces.value.data)) {
        setSpaces(resSpaces.value.data);
      }
    } catch {
      // Ignored: fallback to existing state
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData(false);
  }, [fetchDashboardData]);

  // Auto-polling every 30s
  useEffect(() => {
    const interval = setInterval(() => {
      fetchDashboardData(true);
      refreshCount();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchDashboardData, refreshCount]);

  // Tab focus sync
  useEffect(() => {
    const handleSync = () => {
      if (document.visibilityState === "visible") {
        fetchDashboardData(true);
        refreshCount();
      }
    };

    window.addEventListener("focus", handleSync);
    document.addEventListener("visibilitychange", handleSync);

    return () => {
      window.removeEventListener("focus", handleSync);
      document.removeEventListener("visibilitychange", handleSync);
    };
  }, [fetchDashboardData, refreshCount]);

  // Calculations
  const activeCount = reservations.filter(
    (r) => r.status === "aktif" || r.status === "disetujui"
  ).length;

  const monthlyIncome =
    monthlyReport?.ringkasan?.realisasi_pendapatan ??
    monthlyReport?.realisasi_pendapatan_bersih ??
    0;

  // Filtered reservations for the recent table
  const filteredReservations = reservations.filter((item) => {
    if (filter === "menunggu") return item.status === "belum_dikonfirm";
    if (filter === "aktif") return item.status === "aktif" || item.status === "disetujui";
    return true;
  });

  // Calculate popular spaces
  const spaceBookingCounts: Record<number, number> = {};
  reservations.forEach((r) => {
    const spaceId = r.detail_reservasi?.[0]?.id_space || r.id_space;
    if (spaceId) {
      spaceBookingCounts[spaceId] = (spaceBookingCounts[spaceId] || 0) + 1;
    }
  });

  const popularSpaces = [...spaces]
    .sort((a, b) => (spaceBookingCounts[b.id] || 0) - (spaceBookingCounts[a.id] || 0))
    .slice(0, 2);

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Header Greeting & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            Halo, {user?.nama ?? "Admin"} <span className="inline-block animate-[wave_1.5s_infinite]">👋</span>
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Berikut ringkasan operasional dan performa coworking space kamu hari ini.
          </p>
        </div>

        <button
          onClick={() => {
            fetchDashboardData(true);
            refreshCount();
          }}
          disabled={loading || refreshing}
          title="Segarkan ringkasan sekarang"
          className="inline-flex items-center gap-2 self-start rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-600 border border-slate-200/80 shadow-sm hover:text-[#6367FF] hover:border-[#6367FF]/30 transition-all disabled:opacity-50"
        >
          <RotateCw size={13} className={refreshing ? "animate-spin text-[#6367FF]" : ""} />
          <span>{refreshing ? "Memperbarui..." : "Segarkan"}</span>
        </button>
      </div>

      {/* Top 4 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Belum dikonfirmasi (Highlight Card) */}
        <Link 
          href="/admin/reservasi?status=belum_dikonfirm"
          className="relative overflow-hidden rounded-2xl bg-[#6367FF] p-5 text-white shadow-lg shadow-[#6367FF]/20 flex flex-col justify-between hover:scale-[1.01] transition-transform"
        >
          <div className="flex items-center justify-between">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md">
              <Hourglass size={18} className="text-white" />
            </div>
            {pendingCount > 0 && (
              <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-semibold backdrop-blur-md">
                Baru
              </span>
            )}
          </div>
          <div className="mt-4">
            <p className="text-xs font-medium text-white/80">Belum dikonfirmasi</p>
            <p className="text-2xl font-bold font-display mt-0.5">{pendingCount}</p>
          </div>
        </Link>

        {/* Card 2: Reservasi Aktif */}
        <div className="rounded-2xl bg-white p-5 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EEEFFF] text-[#6367FF]">
            <CalendarCheck size={18} />
          </div>
          <div className="mt-4">
            <p className="text-xs font-medium text-slate-400">Reservasi aktif</p>
            <p className="text-2xl font-bold font-display text-slate-800 mt-0.5">
              {activeCount}
            </p>
          </div>
        </div>

        {/* Card 3: Total Space */}
        <div className="rounded-2xl bg-white p-5 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FFDBFD] text-[#FF5DA2]">
            <Building2 size={18} />
          </div>
          <div className="mt-4">
            <p className="text-xs font-medium text-slate-400">Total space</p>
            <p className="text-2xl font-bold font-display text-slate-800 mt-0.5">
              {spaces.length}
            </p>
          </div>
        </div>

        {/* Card 4: Pendapatan bulan ini */}
        <div className="rounded-2xl bg-white p-5 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Coins size={18} />
            </div>
            <Link 
              href="/admin/laporan"
              className="text-[11px] font-semibold text-[#6367FF] hover:underline"
            >
              Laporan &rarr;
            </Link>
          </div>
          <div className="mt-4">
            <p className="text-xs font-medium text-slate-400">Pendapatan bulan ini</p>
            <p className="text-xl sm:text-2xl font-bold font-display text-slate-800 mt-0.5">
              {formatRupiah(monthlyIncome)}
            </p>
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
          {loading ? (
            <div className="py-12 flex justify-center">
              <Spinner label="Memuat reservasi..." />
            </div>
          ) : filteredReservations.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              Belum ada data reservasi pada kategori ini.
            </div>
          ) : (
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
                  {filteredReservations.slice(0, 5).map((item) => {
                    const memberName = item.member?.nama_member || "Member #" + item.id_member;
                    const spaceName = item.space?.nama_space || item.detail_reservasi?.[0]?.space?.nama_space || "Space #" + item.id_space;
                    const totalBayar = item.total_bayar || item.detail_reservasi?.[0]?.total_harga || 0;

                    return (
                      <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                        {/* Member */}
                        <td className="py-3.5 pr-4">
                          <div className="flex items-center gap-2.5">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#6367FF] to-[#8494FF] text-white font-bold text-[11px]">
                              {memberName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-bold text-slate-800">{memberName}</p>
                              <p className="text-[11px] text-slate-400">
                                {item.member?.telp || item.member?.instansi || `ID: #${item.id}`}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Space */}
                        <td className="py-3.5 pr-4 text-slate-700 font-medium">
                          {spaceName}
                        </td>

                        {/* Jadwal */}
                        <td className="py-3.5 pr-4 text-slate-500">
                          <div>{item.tanggal_reservasi ? formatDate(item.tanggal_reservasi) : "-"}</div>
                          <div className="text-[11px] text-slate-400">
                            {item.jam_mulai} ({item.durasi_jam} jam)
                          </div>
                        </td>

                        {/* Total */}
                        <td className="py-3.5 pr-4 font-bold text-slate-800">
                          {formatRupiah(totalBayar)}
                        </td>

                        {/* Status */}
                        <td className="py-3.5 text-right">
                          {item.status === "disetujui" && (
                            <span className="inline-block rounded-full bg-[#EEEFFF] px-2.5 py-0.5 font-semibold text-[#6367FF] text-[11px]">
                              Disetujui
                            </span>
                          )}
                          {item.status === "belum_dikonfirm" && (
                            <span className="inline-block rounded-full bg-amber-50 px-2.5 py-0.5 font-semibold text-amber-600 text-[11px]">
                              Menunggu
                            </span>
                          )}
                          {item.status === "aktif" && (
                            <span className="inline-block rounded-full bg-emerald-50 px-2.5 py-0.5 font-semibold text-emerald-600 text-[11px]">
                              Aktif
                            </span>
                          )}
                          {item.status === "selesai" && (
                            <span className="inline-block rounded-full bg-slate-100 px-2.5 py-0.5 font-semibold text-slate-600 text-[11px]">
                              Selesai
                            </span>
                          )}
                          {item.status === "dibatalkan" && (
                            <span className="inline-block rounded-full bg-rose-50 px-2.5 py-0.5 font-semibold text-rose-600 text-[11px]">
                              Dibatalkan
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
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
              <h3 className="text-sm font-bold text-slate-800">Space terpopuler</h3>
              <Link href="/admin/spaces" className="text-xs font-semibold text-[#6367FF] hover:underline">
                Kelola &rarr;
              </Link>
            </div>

            <div className="flex flex-col gap-3">
              {popularSpaces.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">
                  Belum ada data space.
                </p>
              ) : (
                popularSpaces.map((sp, idx) => (
                  <div key={sp.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50/70 border border-slate-100">
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                      idx === 0 ? "bg-[#FFDBFD] text-[#FF5DA2]" : "bg-[#EEEFFF] text-[#6367FF]"
                    }`}>
                      {sp.tipe === "meeting_room" ? <Users size={16} /> : <Armchair size={16} />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-slate-800 truncate">{sp.nama_space}</p>
                      <p className="text-[11px] text-slate-400">
                        {spaceBookingCounts[sp.id] ?? 0} reservasi • {formatRupiah(sp.harga_per_jam)}/jam
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}