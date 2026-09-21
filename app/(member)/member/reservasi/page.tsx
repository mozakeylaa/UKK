"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getMyReservasi, cancelReservasi } from "@/lib/api/reservasi";
import { isApiSuccess } from "@/lib/types/api";
import type { Reservasi } from "@/lib/types/reservasi";
import type { ReservasiStatus } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import EmptyState from "@/components/ui/EmptyState";
import ReservationTabs from "@/components/member/reservasi/ReservationTabs";
import ReservationItemCard from "@/components/member/reservasi/ReservationItemCard";
import CancelReservationModal from "@/components/member/reservasi/CancelReservationModal";

export default function StatusPemesananPage() {
  const [reservasiList, setReservasiList] = useState<Reservasi[]>([]);
  const [activeFilter, setActiveFilter] = useState<ReservasiStatus | "semua">("semua");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [cancelTarget, setCancelTarget] = useState<Reservasi | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);

  function loadData() {
    setIsLoading(true);
    setError(null);
    getMyReservasi().then((res) => {
      if (isApiSuccess(res)) {
        setReservasiList(res.data);
      } else {
        setError(res.message);
      }
      setIsLoading(false);
    });
  }

  useEffect(() => {
    loadData();
  }, []);

  const filtered =
    activeFilter === "semua"
      ? reservasiList
      : reservasiList.filter((r) => r.status === activeFilter);

  async function handleConfirmCancel() {
    if (!cancelTarget) return;
    setIsCancelling(true);
    setCancelError(null);
    try {
      const res = await cancelReservasi(cancelTarget.id);
      if (isApiSuccess(res)) {
        setCancelTarget(null);
        loadData();
      } else {
        setCancelError(res.message);
      }
    } catch {
      setCancelError("Terjadi kesalahan. Coba lagi.");
    } finally {
      setIsCancelling(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink-950">Status Pemesanan</h1>
        <p className="mt-1 text-sm text-ink-600">Pantau semua reservasi kamu di sini.</p>
      </div>

      <ReservationTabs activeTab={activeFilter} onTabChange={setActiveFilter} />

      {isLoading && <Spinner label="Memuat reservasi..." />}

      {!isLoading && error && (
        <EmptyState title="Gagal memuat data" description={error} />
      )}

      {!isLoading && !error && filtered.length === 0 && (
        <EmptyState
          title="Belum ada reservasi"
          description="Reservasi kamu akan muncul di sini setelah kamu memesan space."
          action={
            <Link href="/member/spaces">
              <Button size="sm">Cari Space</Button>
            </Link>
          }
        />
      )}

      {!isLoading && !error && filtered.length > 0 && (
        <div className="flex flex-col gap-3">
          {filtered.map((r) => (
            <ReservationItemCard
              key={r.id}
              reservasi={r}
              onCancel={setCancelTarget}
            />
          ))}
        </div>
      )}

      <CancelReservationModal
        cancelTarget={cancelTarget}
        isCancelling={isCancelling}
        cancelError={cancelError}
        onClose={() => setCancelTarget(null)}
        onConfirm={handleConfirmCancel}
      />
    </div>
  );
}