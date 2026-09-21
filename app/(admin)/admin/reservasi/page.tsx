"use client";

import { useEffect, useState } from "react";
import { getAdminReservasiList } from "@/lib/api/admin-reservasi";
import { getAdminSpaces } from "@/lib/api/admin-spaces";
import { isApiSuccess } from "@/lib/types/api";
import type { Reservasi, AdminReservasiFilter } from "@/lib/types/reservasi";
import type { AdminSpace } from "@/lib/types/admin";
import EmptyState from "@/components/ui/EmptyState";
import Spinner from "@/components/ui/Spinner";
import ReservasiFilterCard from "@/components/admin/reservasi/ReservasiFilterCard";
import ReservasiTableCard from "@/components/admin/reservasi/ReservasiTableCard";

export default function AdminReservasiPage() {
  const [reservasiList, setReservasiList] = useState<Reservasi[]>([]);
  const [spaces, setSpaces] = useState<AdminSpace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const now = new Date();
  const [filter, setFilter] = useState<AdminReservasiFilter>({
    month: now.getMonth() + 1,
    year: now.getFullYear(),
    status: undefined,
    id_space: undefined,
    tanggal: undefined,
  });

  useEffect(() => {
    getAdminSpaces().then((res) => {
      if (isApiSuccess(res)) setSpaces(res.data);
    });
  }, []);

  useEffect(() => {
    fetchReservasi();
  }, [filter]);

  async function fetchReservasi() {
    try {
      setLoading(true);
      setError(null);
      const res = await getAdminReservasiList(filter);
      if (isApiSuccess(res)) {
        setReservasiList(res.data);
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError("Gagal memuat daftar reservasi");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-ink-950">Kelola Reservasi</h1>

      <ReservasiFilterCard
        filter={filter}
        spaces={spaces}
        onFilterChange={setFilter}
      />

      {error && (
        <div className="rounded-md bg-status-cancelled/10 p-3 text-sm text-status-cancelled">
          {error}
        </div>
      )}

      {loading ? (
        <Spinner label="Memuat reservasi..." />
      ) : reservasiList.length === 0 ? (
        <EmptyState
          title="Tidak ada reservasi"
          description="Belum ada reservasi untuk filter yang dipilih"
        />
      ) : (
        <ReservasiTableCard reservasiList={reservasiList} />
      )}
    </div>
  );
}