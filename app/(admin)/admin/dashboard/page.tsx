"use client";

import { useAuth } from "@/lib/context/AuthContext";
import { Card } from "@/components/ui/Card";

export default function AdminDashboardPage() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-medium text-ink-950">
          Halo, {user?.nama ?? "Admin"} 👋
        </h1>
        <p className="mt-1 text-sm text-ink-600">
          Berikut ringkasan pengelolaan coworking space kamu.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <p className="text-sm text-ink-600">Reservasi belum dikonfirmasi</p>
          <p className="mt-2 font-display text-2xl font-medium text-ink-950">–</p>
        </Card>
        <Card>
          <p className="text-sm text-ink-600">Reservasi aktif</p>
          <p className="mt-2 font-display text-2xl font-medium text-ink-950">–</p>
        </Card>
        <Card>
          <p className="text-sm text-ink-600">Total space</p>
          <p className="mt-2 font-display text-2xl font-medium text-ink-950">–</p>
        </Card>
        <Card>
          <p className="text-sm text-ink-600">Pendapatan bulan ini</p>
          <p className="mt-2 font-display text-2xl font-medium text-ink-950">–</p>
        </Card>
      </div>

      <Card>
        <p className="text-sm text-ink-600">
          Data ringkasan akan tampil di sini setelah fitur terkait selesai dikerjakan (Step 7-11).
        </p>
      </Card>
    </div>
  );
}