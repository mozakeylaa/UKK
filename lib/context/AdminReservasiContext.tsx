"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import { getAdminReservasiList } from "@/lib/api/admin-reservasi";
import { isApiSuccess } from "@/lib/types/api";

const SEEN_KEY = "coworking_seen_reservasi_ids";

interface AdminReservasiContextValue {
  pendingCount: number;
  unreadCount: number;
  refreshCount: () => Promise<void>;
  markAllAsSeen: () => void;
}

const AdminReservasiContext = createContext<AdminReservasiContextValue | undefined>(
  undefined
);

export function AdminReservasiProvider({ children }: { children: ReactNode }) {
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [pendingCount, setPendingCount] = useState<number>(0);
  const pathname = usePathname();

  const refreshCount = useCallback(async () => {
    try {
      const res = await getAdminReservasiList();
      if (isApiSuccess(res) && Array.isArray(res.data)) {
        const allReservations = res.data;
        const pending = allReservations.filter((r) => r.status === "belum_dikonfirm");
        setPendingCount(pending.length);

        // Ambil riwayat ID reservasi yang sudah pernah dibuka/dilihat admin
        let seenIds: number[] = [];
        try {
          const raw = localStorage.getItem(SEEN_KEY);
          if (raw) seenIds = JSON.parse(raw);
        } catch {
          seenIds = [];
        }

        // Jika admin sedang berada di halaman kelola reservasi, tandai semua yang ada saat ini sebagai sudah dilihat
        if (pathname.startsWith("/admin/reservasi")) {
          const allIds = allReservations.map((r) => r.id);
          try {
            localStorage.setItem(SEEN_KEY, JSON.stringify(allIds));
          } catch {
            // localStorage not available
          }
          // Saat admin sedang melihat halaman reservasi, badge unread langsung 0
          setUnreadCount(0);
        } else {
          // Di luar halaman reservasi, hitung reservasi baru yang belum pernah dilihat admin ATAU masih berstatus belum_dikonfirm
          const unread = allReservations.filter(
            (r) => !seenIds.includes(r.id) || r.status === "belum_dikonfirm"
          );
          setUnreadCount(unread.length);
        }
      }
    } catch {
      // Error fetching reservasi
    }
  }, [pathname]);

  const markAllAsSeen = useCallback(() => {
    setUnreadCount(0);
  }, []);

  useEffect(() => {
    refreshCount();

    const interval = setInterval(() => {
      refreshCount();
    }, 30000);

    const handleFocus = () => {
      refreshCount();
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleFocus);
    };
  }, [refreshCount]);

  return (
    <AdminReservasiContext.Provider
      value={{
        pendingCount,
        unreadCount,
        refreshCount,
        markAllAsSeen,
      }}
    >
      {children}
    </AdminReservasiContext.Provider>
  );
}

export function useAdminReservasi() {
  const ctx = useContext(AdminReservasiContext);
  if (!ctx) {
    // Return safe fallback jika dipanggil di luar provider
    return {
      pendingCount: 0,
      unreadCount: 0,
      refreshCount: async () => {},
      markAllAsSeen: () => {},
    };
  }
  return ctx;
}
