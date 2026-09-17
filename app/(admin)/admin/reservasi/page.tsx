"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAdminReservasiList } from "@/lib/api/admin-reservasi";
import { getAdminSpaces } from "@/lib/api/admin-spaces";
import { isApiSuccess } from "@/lib/types/api";
import type { Reservasi, AdminReservasiFilter } from "@/lib/types/reservasi";
import type { AdminSpace } from "@/lib/types/admin";
import type { ReservasiStatus } from "@/components/ui/Badge";
import Badge from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Spinner from "@/components/ui/Spinner";
import Table from "@/components/ui/Table";

const STATUS_OPTIONS: { label: string; value: ReservasiStatus }[] = [
  { label: "Belum Dikonfirmasi", value: "belum_dikonfirm" },
  { label: "Disetujui", value: "disetujui" },
  { label: "Aktif", value: "aktif" },
  { label: "Selesai", value: "selesai" },
  { label: "Dibatalkan", value: "dibatalkan" },
];

const MONTH_OPTIONS = [
  { label: "Januari", value: "1" },
  { label: "Februari", value: "2" },
  { label: "Maret", value: "3" },
  { label: "April", value: "4" },
  { label: "Mei", value: "5" },
  { label: "Juni", value: "6" },
  { label: "Juli", value: "7" },
  { label: "Agustus", value: "8" },
  { label: "September", value: "9" },
  { label: "Oktober", value: "10" },
  { label: "November", value: "11" },
  { label: "Desember", value: "12" },
];

function formatRupiah(value: number): string {
  return `Rp ${value.toLocaleString("id-ID")}`;
}

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

      <Card>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
          <Select
            label="Bulan"
            options={MONTH_OPTIONS}
            value={String(filter.month ?? "")}
            onChange={(e) =>
              setFilter({
                ...filter,
                month: e.target.value ? Number(e.target.value) : undefined,
              })
            }
          />
          <Input
            label="Tahun"
            type="number"
            value={filter.year ?? ""}
            onChange={(e) =>
              setFilter({
                ...filter,
                year: e.target.value ? Number(e.target.value) : undefined,
              })
            }
          />
          <Select
            label="Status"
            placeholder="Semua status"
            options={STATUS_OPTIONS}
            value={filter.status ?? ""}
            onChange={(e) =>
              setFilter({
                ...filter,
                status: (e.target.value || undefined) as ReservasiStatus | undefined,
              })
            }
          />
          <Select
            label="Ruangan"
            placeholder="Semua ruangan"
            options={spaces.map((s) => ({ label: s.nama_space, value: String(s.id) }))}
            value={filter.id_space ? String(filter.id_space) : ""}
            onChange={(e) =>
              setFilter({
                ...filter,
                id_space: e.target.value ? Number(e.target.value) : undefined,
              })
            }
          />
          <Input
            label="Tanggal Spesifik"
            type="date"
            value={filter.tanggal ?? ""}
            onChange={(e) =>
              setFilter({ ...filter, tanggal: e.target.value || undefined })
            }
          />
        </div>
      </Card>

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
        <Card>
          <Table<Reservasi>
            columns={[
              {
                header: "Kode Booking",
                accessor: (row) => (
                  <Link
                    href={`/admin/reservasi/${row.id}`}
                    className="font-medium text-brand-600 hover:underline"
                  >
                    {row.kode_booking}
                  </Link>
                ),
              },
              {
                header: "Member",
                accessor: (row) => row.member?.nama_member ?? "-",
              },
              {
                header: "Ruangan",
                accessor: (row) => row.space?.nama_space ?? "-",
              },
              {
                header: "Tanggal",
                accessor: (row) => row.tanggal_reservasi,
              },
              {
                header: "Jam",
                accessor: (row) => `${row.jam_mulai} - ${row.jam_selesai}`,
              },
              {
                header: "Total Bayar",
                accessor: (row) => formatRupiah(row.total_bayar),
              },
              {
                header: "Status",
                accessor: (row) => <Badge status={row.status} />,
              },
            ]}
            data={reservasiList}
            keyExtractor={(row) => row.id}
          />
        </Card>
      )}
    </div>
  );
}