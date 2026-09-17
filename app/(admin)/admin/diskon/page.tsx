"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAdminDiskon, deleteAdminDiskon } from "@/lib/api/admin-diskon";
import { isApiSuccess } from "@/lib/types/api";
import type { Diskon } from "@/lib/types/reservasi";
import Button from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";
import Modal from "@/components/ui/Modal";
import Spinner from "@/components/ui/Spinner";
import Table from "@/components/ui/Table";

function getDiskonStatus(diskon: Diskon): { label: string; active: boolean } {
  const now = new Date();
  const awal = new Date(diskon.tanggal_awal);
  const akhir = new Date(diskon.tanggal_akhir);

  if (now < awal) return { label: "Belum mulai", active: false };
  if (now > akhir) return { label: "Berakhir", active: false };
  return { label: "Aktif", active: true };
}

function formatTanggal(iso: string): string {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function AdminDiskonPage() {
  const [diskonList, setDiskonList] = useState<Diskon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    diskonId: number | null;
    diskonName: string;
    isDeleting: boolean;
  }>({
    open: false,
    diskonId: null,
    diskonName: "",
    isDeleting: false,
  });

  useEffect(() => {
    fetchDiskon();
  }, []);

  async function fetchDiskon() {
    try {
      setLoading(true);
      setError(null);
      const res = await getAdminDiskon();
      if (isApiSuccess(res)) {
        setDiskonList(res.data);
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError("Gagal memuat daftar diskon");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    setDeleteModal({ ...deleteModal, isDeleting: true });
    try {
      const res = await deleteAdminDiskon(id);
      if (isApiSuccess(res)) {
        setDiskonList(diskonList.filter((d) => d.id !== id));
        setDeleteModal({ open: false, diskonId: null, diskonName: "", isDeleting: false });
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError("Gagal menghapus diskon");
    } finally {
      setDeleteModal({ ...deleteModal, isDeleting: false });
    }
  }

  if (loading) return <Spinner label="Memuat diskon..." />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-ink-950">Kelola Diskon/Promo</h1>
        <Link href="/admin/diskon/baru">
          <Button>+ Tambah Diskon</Button>
        </Link>
      </div>

      {error && (
        <div className="rounded-md bg-status-cancelled/10 p-3 text-sm text-status-cancelled">
          {error}
        </div>
      )}

      {diskonList.length === 0 ? (
        <EmptyState
          title="Belum ada diskon"
          description="Buat kode promo untuk menarik member"
          action={
            <Link href="/admin/diskon/baru">
              <Button size="sm">Tambah Diskon Pertama</Button>
            </Link>
          }
        />
      ) : (
        <Card>
          <Table<Diskon>
            columns={[
              { header: "Nama Diskon", accessor: (row) => row.nama_diskon },
              {
                header: "Persentase",
                accessor: (row) => `${row.persentase_diskon}%`,
              },
              {
                header: "Periode",
                accessor: (row) =>
                  `${formatTanggal(row.tanggal_awal)} - ${formatTanggal(row.tanggal_akhir)}`,
              },
              {
                header: "Status",
                accessor: (row) => {
                  const status = getDiskonStatus(row);
                  return (
                    <span
                      className={
                        status.active
                          ? "text-status-active font-medium"
                          : "text-ink-600"
                      }
                    >
                      {status.label}
                    </span>
                  );
                },
              },
              {
                header: "Aksi",
                accessor: (row) => (
                  <div className="flex items-center gap-2">
                    <Link href={`/admin/diskon/${row.id}/edit`}>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() =>
                        setDeleteModal({
                          open: true,
                          diskonId: row.id,
                          diskonName: row.nama_diskon,
                          isDeleting: false,
                        })
                      }
                    >
                      Hapus
                    </Button>
                  </div>
                ),
              },
            ]}
            data={diskonList}
            keyExtractor={(row) => row.id}
          />
        </Card>
      )}

      <Modal
        open={deleteModal.open}
        onClose={() =>
          setDeleteModal({ open: false, diskonId: null, diskonName: "", isDeleting: false })
        }
        title="Hapus Diskon"
      >
        <div className="space-y-4">
          <p className="text-sm text-ink-600">
            Yakin ingin menghapus diskon <strong>{deleteModal.diskonName}</strong>?
          </p>
          <div className="flex gap-2 justify-end">
            <Button
              variant="ghost"
              onClick={() =>
                setDeleteModal({ open: false, diskonId: null, diskonName: "", isDeleting: false })
              }
            >
              Batal
            </Button>
            <Button
              variant="danger"
              isLoading={deleteModal.isDeleting}
              onClick={() => deleteModal.diskonId && handleDelete(deleteModal.diskonId)}
            >
              Hapus
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}