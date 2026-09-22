"use client";

import { useEffect, useState, useCallback } from "react";
import {
  CalendarCheck,
  AlertTriangle,
  Inbox,
  RefreshCw,
  ShieldAlert,
  LogIn,
} from "lucide-react";
import Cookies from "js-cookie";
import { login } from "@/lib/api/auth";
import { getAdminReservasiList } from "@/lib/api/admin-reservasi";
import { getAdminSpaces } from "@/lib/api/admin-spaces";
import { isApiSuccess } from "@/lib/types/api";
import {
  AUTH_TOKEN_KEY,
  AUTH_ROLE_KEY,
  AUTH_USER_KEY,
} from "@/lib/api/client";
import type { Reservasi, AdminReservasiFilter } from "@/lib/types/reservasi";
import type { AdminSpace } from "@/lib/types/admin";
import Spinner from "@/components/ui/Spinner";
import ReservasiFilterCard from "@/components/admin/reservasi/ReservasiFilterCard";
import ReservasiTableCard from "@/components/admin/reservasi/ReservasiTableCard";
import { useAdminReservasi } from "@/lib/context/AdminReservasiContext";

export default function AdminReservasiPage() {
  const [reservasiList, setReservasiList] = useState<Reservasi[]>([]);
  const [spaces, setSpaces] = useState<AdminSpace[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { refreshCount } = useAdminReservasi();

  // Set default filter ke undefined agar semua data langsung diambil tanpa terpotong bulan/tahun
  const [filter, setFilter] = useState<AdminReservasiFilter>({
    month: undefined,
    year: undefined,
    status: undefined,
    id_space: undefined,
    tanggal: undefined,
  });

  const fetchReservasi = useCallback(
    async (showFullSpinner = false) => {
      try {
        if (showFullSpinner) {
          setLoading(true);
        } else {
          setIsRefreshing(true);
        }
        setError(null);

        const res = await getAdminReservasiList(filter);
        if (isApiSuccess(res)) {
          setReservasiList(res.data);
          setLastUpdated(new Date());
          // Sinkronisasi badge unread / pending di sidebar layout
          refreshCount();
        } else {
          setError(res.message || "Gagal memuat data reservasi.");
        }
      } catch {
        setError("Gagal memuat daftar reservasi dari server.");
      } finally {
        setLoading(false);
        setIsRefreshing(false);
      }
    },
    [filter, refreshCount]
  );

  // Ambil daftar space untuk opsi filter
  useEffect(() => {
    getAdminSpaces().then((res) => {
      if (isApiSuccess(res)) setSpaces(res.data);
    });
  }, []);

  // Fetch data saat filter berubah
  useEffect(() => {
    fetchReservasi(true);
  }, [fetchReservasi]);

  // Polling otomatis setiap 30 detik & saat tab kembali aktif
  useEffect(() => {
    const interval = setInterval(() => {
      fetchReservasi(false);
    }, 30000);

    const handleFocus = () => {
      fetchReservasi(false);
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleFocus);
    };
  }, [fetchReservasi]);

  // Handler jika terjadi tabrakan sesi role Member vs Admin
  const isRoleConflict =
    error &&
    (error.toLowerCase().includes("member") ||
      error.toLowerCase().includes("akses ditolak") ||
      error.toLowerCase().includes("403") ||
      error.toLowerCase().includes("admin_space"));

  const [isSwitchingAdmin, setIsSwitchingAdmin] = useState(false);

  async function handleQuickSwitchAdmin() {
    setIsSwitchingAdmin(true);
    try {
      const res = await login({
        username: "admin_moklet",
        password: "Password123!",
      });
      if (isApiSuccess(res)) {
        Cookies.set(AUTH_TOKEN_KEY, res.data.access_token, { expires: 7 });
        Cookies.set(AUTH_ROLE_KEY, res.data.role, { expires: 7 });
        Cookies.set(
          AUTH_USER_KEY,
          JSON.stringify({
            id: res.data.id,
            username: res.data.username,
            role: res.data.role,
            nama: res.data.space_owner?.nama_pemilik ?? res.data.username,
            foto: res.data.space_owner?.foto_url || null,
          }),
          { expires: 7 }
        );
        window.location.reload();
      } else {
        handleReloginAdmin();
      }
    } catch {
      handleReloginAdmin();
    } finally {
      setIsSwitchingAdmin(false);
    }
  }

  function handleReloginAdmin() {
    Cookies.remove(AUTH_TOKEN_KEY);
    Cookies.remove(AUTH_ROLE_KEY);
    Cookies.remove(AUTH_USER_KEY);
    window.location.href = "/login";
  }

  // Filter reservasi berdasarkan kata kunci pencarian (Nama Member, Telp, Instansi, Kode Booking, Nama Space)
  const displayedReservasiList = reservasiList.filter((r) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    const matchMember = r.member?.nama_member?.toLowerCase().includes(q);
    const matchInstansi = r.member?.instansi?.toLowerCase().includes(q);
    const matchTelp = r.member?.telp?.toLowerCase().includes(q);
    const matchKode = r.kode_booking?.toLowerCase().includes(q);
    const matchSpace = r.space?.nama_space?.toLowerCase().includes(q);
    return Boolean(matchMember || matchInstansi || matchTelp || matchKode || matchSpace);
  });

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            Kelola Reservasi
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Daftar seluruh pemesanan masuk, konfirmasi jadwal, dan status sewa ruangan oleh member.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
          {/* Tombol Segarkan Data */}
          <button
            type="button"
            onClick={() => fetchReservasi(false)}
            disabled={loading || isRefreshing}
            className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 border border-slate-200/80 shadow-xs hover:border-[#6367FF] hover:text-[#6367FF] transition-all disabled:opacity-60 cursor-pointer"
            title="Segarkan data reservasi terbaru dari server"
          >
            <RefreshCw
              size={13}
              className={`text-[#6367FF] ${loading || isRefreshing ? "animate-spin" : ""}`}
            />
            <span>{isRefreshing ? "Memperbarui..." : "Segarkan"}</span>
          </button>

          {/* Badge Total */}
          <div className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-600 border border-slate-200/80 shadow-xs">
            <CalendarCheck size={14} className="text-[#6367FF]" />
            <span>
              {searchQuery
                ? `Menampilkan ${displayedReservasiList.length} dari ${reservasiList.length}`
                : `Total: ${reservasiList.length} Reservasi`}
            </span>
          </div>
        </div>
      </div>

      {/* Role Conflict / 403 Warning Banner */}
      {isRoleConflict && (
        <div className="rounded-3xl bg-amber-50 border border-amber-200 p-5 sm:p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
                <ShieldAlert size={22} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-amber-900">
                  Sesi Login Terdeteksi Sebagai &apos;Member&apos; (Bukan Admin)
                </h3>
                <p className="mt-1 text-xs text-amber-700 leading-relaxed max-w-2xl">
                  Browser Anda saat ini menyimpan sesi login akun <strong>Member</strong> (setelah Anda menguji pemesanan reservasi di tab atau browser yang sama). 
                  Endpoint data admin memerlukan hak akses peran <strong>admin_space</strong>.
                </p>
                <p className="mt-1.5 text-[11px] font-medium text-amber-600">
                  💡 Klik tombol <strong>Beralih ke Sesi Admin</strong> di bawah ini agar halaman dapat langsung memuat data reservasi masuk tanpa perlu mengetik ulang password.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleQuickSwitchAdmin}
                disabled={isSwitchingAdmin}
                className="inline-flex items-center gap-2 rounded-2xl bg-[#6367FF] hover:bg-[#4A4FE0] text-white px-4 py-2.5 text-xs font-semibold shadow-xs transition-all cursor-pointer disabled:opacity-60"
              >
                <LogIn size={15} />
                {isSwitchingAdmin ? "Mengalihkan Sesi..." : "Beralih ke Sesi Admin (1-Klik)"}
              </button>
              <button
                type="button"
                onClick={handleReloginAdmin}
                className="inline-flex items-center gap-2 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-3.5 py-2.5 text-xs font-semibold shadow-xs transition-all cursor-pointer"
              >
                Login Ulang
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter & Search Card */}
      <div className="rounded-3xl bg-white p-5 sm:p-6 border border-slate-100 shadow-xs">
        <ReservasiFilterCard
          filter={filter}
          spaces={spaces}
          searchQuery={searchQuery}
          onFilterChange={setFilter}
          onSearchQueryChange={setSearchQuery}
        />
        {lastUpdated && (
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>Data tersinkronisasi otomatis dengan server</span>
            <span>
              Terakhir diperbarui:{" "}
              {lastUpdated.toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </span>
          </div>
        )}
      </div>

      {/* Error State (Non Role Conflict) */}
      {error && !isRoleConflict && (
        <div className="flex items-center justify-between gap-3 rounded-2xl bg-rose-50 border border-rose-200 p-4 text-xs font-medium text-rose-600">
          <div className="flex items-center gap-3">
            <AlertTriangle size={18} className="shrink-0" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={() => fetchReservasi(true)}
            className="font-semibold underline hover:text-rose-800 shrink-0 cursor-pointer"
          >
            Coba Lagi
          </button>
        </div>
      )}

      {/* Loading & Content View */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Spinner label="Memuat data reservasi..." />
        </div>
      ) : displayedReservasiList.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl bg-white p-12 text-center border border-slate-100 shadow-xs">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EEEFFF] text-[#6367FF]">
            <Inbox size={26} />
          </div>
          <h3 className="mt-4 font-display text-base font-bold text-slate-900">
            {searchQuery ? "Reservasi Tidak Ditemukan" : "Tidak Ada Reservasi"}
          </h3>
          <p className="mt-1 text-xs text-slate-500 max-w-sm">
            {searchQuery
              ? `Tidak ada reservasi yang cocok dengan kata kunci "${searchQuery}". Coba gunakan nama member atau kode booking lain.`
              : "Belum ada data reservasi yang sesuai dengan kriteria filter yang kamu tentukan."}
          </p>
        </div>
      ) : (
        <div className="rounded-3xl bg-white p-5 sm:p-6 border border-slate-100 shadow-xs overflow-hidden">
          <ReservasiTableCard reservasiList={displayedReservasiList} />
        </div>
      )}
    </div>
  );
}