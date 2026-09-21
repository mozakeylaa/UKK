"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAdminDiskon, deleteAdminDiskon } from "@/lib/api/admin-diskon";
import { isApiSuccess } from "@/lib/types/api";
import type { Diskon } from "@/lib/types/reservasi";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import Spinner from "@/components/ui/Spinner";
import DiskonTableCard from "@/components/admin/diskon/DiskonTableCard";
import DiskonDeleteModal from "@/components/admin/diskon/DiskonDeleteModal";

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
    setDeleteModal((prev) => ({ ...prev, isDeleting: true }));
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
      setDeleteModal((prev) => ({ ...prev, isDeleting: false }));
    }
  }

  function handleRequestDelete(id: number, name: string) {
    setDeleteModal({
      open: true,
      diskonId: id,
      diskonName: name,
      isDeleting: false,
    });
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
        <DiskonTableCard
          diskonList={diskonList}
          onRequestDelete={handleRequestDelete}
        />
      )}

      <DiskonDeleteModal
        open={deleteModal.open}
        diskonName={deleteModal.diskonName}
        isDeleting={deleteModal.isDeleting}
        onClose={() =>
          setDeleteModal({ open: false, diskonId: null, diskonName: "", isDeleting: false })
        }
        onConfirm={() => deleteModal.diskonId && handleDelete(deleteModal.diskonId)}
      />
    </div>
  );
}