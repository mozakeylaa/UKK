"use client";

import { useAuth } from "@/lib/context/AuthContext";
import { Card } from "@/components/ui/Card";

export default function MemberDashboardPage() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-medium text-ink-950">
          Halo, {user?.nama ?? "Member"} 👋
        </h1>
        <p className="mt-1 text-sm text-ink-600">
          Berikut ringkasan aktivitas reservasi kamu.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-sm text-ink-600">Reservasi aktif</p>
          <p className="mt-2 font-display text-2xl font-medium text-ink-950">–</p>
        </Card>
        <Card>
          <p className="text-sm text-ink-600">Menunggu konfirmasi</p>
          <p className="mt-2 font-display text-2xl font-medium text-ink-950">–</p>
        </Card>
        <Card>
          <p className="text-sm text-ink-600">Riwayat reservasi</p>
          <p className="mt-2 font-display text-2xl font-medium text-ink-950">–</p>
        </Card>
      </div>

      <Card>
        <p className="text-sm text-ink-600">
          Data ringkasan reservasi akan tampil di sini setelah fitur reservasi tersedia (Step 5-6).
        </p>
      </Card>
    </div>
  );
}