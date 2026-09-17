"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Ticket } from "lucide-react";
import { getMyReservasi, cancelReservasi } from "@/lib/api/reservasi";
import { isApiSuccess } from "@/lib/types/api";
import type { Reservasi } from "@/lib/types/reservasi";
import { formatRupiah, formatDate } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import { Card } from "@/components/ui/Card";
import Badge, { ReservasiStatus } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import EmptyState from "@/components/ui/EmptyState";
import Modal from "@/components/ui/Modal";

const STATUS_TABS: { label: string; value: ReservasiStatus | "semua" }[] = [
  { label: "Semua", value: "semua" },
  { label: "Belum dikonfirmasi", value: "belum_dikonfirm" },
  { label: "Disetujui", value: "disetujui" },
  { label: "Aktif", value: "aktif" },
  { label: "Selesai", value: "selesai" },
  { label: "Dibatalkan", value: "dibatalkan" },
];

const CANCELLABLE: ReservasiStatus[] = ["belum_dikonfirm", "disetujui"];

export default function StatusPemesananPage() {
  const [reservasiList, setReservasiList] = useState<Reservasi[]>([]);
  const [activeTab, setActiveTab] = useState<ReservasiStatus | "semua">("semua");
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
    activeTab === "semua"
      ? reservasiList
      : reservasiList.filter((r) => r.status === activeTab);

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
        <h1 className="font-display text-2xl font-medium text-ink-950">Status Pemesanan</h1>
        <p className="mt-1 text-sm text-ink-600">Pantau semua reservasi kamu di sini.</p>
      </div>

      <div className="flex gap-2 overflow-x-auto">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={cn(
              "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors",
              activeTab === tab.value
                ? "bg-brand-600 text-white"
                : "bg-white text-ink-600 hover:bg-surface-100"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

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
            <Card key={r.id} className="flex flex-col gap-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-display text-base font-medium text-ink-950">
                    {r.space?.nama_space ?? `Space #${r.id_space}`}
                  </p>
                  <p className="text-xs text-ink-600">
                    {formatDate(r.tanggal_reservasi)} · {r.jam_mulai}–{r.jam_selesai}
                  </p>
                  <p className="mt-1 text-xs text-ink-600">Kode: {r.kode_booking}</p>
                </div>
                <Badge status={r.status} />
              </div>

              <div className="flex items-center justify-between border-t border-surface-200 pt-3">
                <span className="font-display text-sm font-medium text-brand-700">
                  {formatRupiah(r.total_bayar)}
                </span>
                <div className="flex gap-2">
                  <Link href={`/member/reservasi/${r.id}/tiket`}>
                    <Button variant="outline" size="sm">
                      <Ticket size={14} className="mr-1" />
                      E-Ticket
                    </Button>
                  </Link>
                  {CANCELLABLE.includes(r.status) && (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => setCancelTarget(r)}
                    >
                      Batalkan
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={!!cancelTarget}
        onClose={() => setCancelTarget(null)}
        title="Batalkan Reservasi"
      >
        <p className="text-sm text-ink-600">
          Yakin ingin membatalkan reservasi{" "}
          <strong>{cancelTarget?.kode_booking}</strong>? Tindakan ini tidak bisa dibatalkan.
        </p>
        {cancelError && (
          <p className="mt-3 text-sm text-status-cancelled">{cancelError}</p>
        )}
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setCancelTarget(null)}>
            Batal
          </Button>
          <Button variant="danger" isLoading={isCancelling} onClick={handleConfirmCancel}>
            Ya, Batalkan
          </Button>
        </div>
      </Modal>
    </div>
  );
}