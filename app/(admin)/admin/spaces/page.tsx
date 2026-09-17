"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { getAdminSpaces, deleteAdminSpace } from "@/lib/api/admin-spaces";
import { isApiSuccess } from "@/lib/types/api";
import type { AdminSpace } from "@/lib/types/admin";
import { formatRupiah } from "@/lib/utils/format";
import { Card } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Spinner from "@/components/ui/Spinner";
import EmptyState from "@/components/ui/EmptyState";

const TIPE_LABEL: Record<string, string> = {
  desk: "Personal Desk",
  meeting_room: "Meeting Room",
  private_office: "Private Office",
};

export default function AdminSpacesPage() {
  const [spaces, setSpaces] = useState<AdminSpace[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<AdminSpace | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  function loadData() {
    setIsLoading(true);
    setError(null);
    getAdminSpaces().then((res) => {
      if (isApiSuccess(res)) {
        setSpaces(res.data);
      } else {
        setError(res.message);
      }
      setIsLoading(false);
    });
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleConfirmDelete() {
    if (!deleteTarget) return;
    setIsDeleting(true);
    setDeleteError(null);
    try {
      const res = await deleteAdminSpace(deleteTarget.id);
      if (isApiSuccess(res)) {
        setDeleteTarget(null);
        loadData();
      } else {
        setDeleteError(res.message);
      }
    } catch {
      setDeleteError("Terjadi kesalahan. Coba lagi.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink-950">Kelola Space</h1>
          <p className="mt-1 text-sm text-ink-600">Daftar ruangan/meja coworking kamu.</p>
        </div>
        <Link href="/admin/spaces/baru">
          <Button size="sm">
            <Plus size={16} className="mr-1" />
            Tambah Space
          </Button>
        </Link>
      </div>

      {isLoading && <Spinner label="Memuat data space..." />}

      {!isLoading && error && <EmptyState title="Gagal memuat data" description={error} />}

      {!isLoading && !error && spaces.length === 0 && (
        <EmptyState
          title="Belum ada space"
          description="Tambahkan space pertama kamu."
          action={
            <Link href="/admin/spaces/baru">
              <Button size="sm">Tambah Space</Button>
            </Link>
          }
        />
      )}

      {!isLoading && !error && spaces.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {spaces.map((space) => (
            <Card key={space.id} className="flex flex-col gap-3 p-0 overflow-hidden">
              <div className="aspect-video w-full bg-surface-100">
                {space.foto_url ? (
                  <img src={space.foto_url} alt={space.nama_space} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-ink-600">
                    Tidak ada foto
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col gap-2 px-4 pb-4">
                <div>
                  <p className="font-display text-base font-semibold text-ink-950">{space.nama_space}</p>
                  <p className="text-xs text-ink-600">{TIPE_LABEL[space.tipe] ?? space.tipe}</p>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-ink-600">Kapasitas {space.kapasitas} orang</span>
                  <span className="font-display font-semibold text-brand-700">
                    {formatRupiah(space.harga_per_jam)}/jam
                  </span>
                </div>
                <div className="mt-2 flex gap-2">
                  <Link href={`/admin/spaces/${space.id}/edit`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      <Pencil size={14} className="mr-1" />
                      Edit
                    </Button>
                  </Link>
                  <Button variant="danger" size="sm" onClick={() => setDeleteTarget(space)}>
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Hapus Space">
        <p className="text-sm text-ink-600">
          Yakin ingin menghapus <strong>{deleteTarget?.nama_space}</strong>? Tindakan ini tidak bisa dibatalkan.
        </p>
        {deleteError && <p className="mt-3 text-sm text-status-cancelled">{deleteError}</p>}
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setDeleteTarget(null)}>
            Batal
          </Button>
          <Button variant="danger" isLoading={isDeleting} onClick={handleConfirmDelete}>
            Ya, Hapus
          </Button>
        </div>
      </Modal>
    </div>
  );
}