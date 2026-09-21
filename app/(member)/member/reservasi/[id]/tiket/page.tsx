"use client";

import { useEffect, useState, use as usePromise } from "react";
import { Printer } from "lucide-react";
import { getETicket } from "@/lib/api/reservasi";
import { isApiSuccess } from "@/lib/types/api";
import type { ETicket } from "@/lib/types/reservasi";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import EmptyState from "@/components/ui/EmptyState";
import ETicketCard from "@/components/member/reservasi/ETicketCard";

export default function ETicketPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = usePromise(params);
  const reservasiId = Number(id);

  const [tiket, setTiket] = useState<ETicket | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!reservasiId) return;
    setIsLoading(true);
    getETicket(reservasiId).then((res) => {
      if (isApiSuccess(res)) {
        setTiket(res.data);
      } else {
        setError(res.message);
      }
      setIsLoading(false);
    });
  }, [reservasiId]);

  if (isLoading) return <Spinner label="Memuat e-ticket..." />;

  if (error || !tiket) {
    return (
      <EmptyState
        title="E-ticket tidak ditemukan"
        description={error ?? "Data reservasi tidak tersedia."}
      />
    );
  }

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
    tiket.qr_code_payload
  )}`;

  return (
    <div className="mx-auto flex max-w-md flex-col gap-4">
      <div className="flex items-center justify-between print:hidden">
        <h1 className="font-display text-xl font-medium text-ink-950">E-Ticket</h1>
        <Button variant="outline" size="sm" onClick={() => window.print()}>
          <Printer size={14} className="mr-1" />
          Cetak
        </Button>
      </div>

      <ETicketCard tiket={tiket} qrImageUrl={qrImageUrl} />
    </div>
  );
}