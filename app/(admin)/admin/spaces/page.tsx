"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { getAdminSpaces, deleteAdminSpace } from "@/lib/api/admin-spaces";
import { isApiSuccess } from "@/lib/types/api";
import type { AdminSpace } from "@/lib/types/admin";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import EmptyState from "@/components/ui/EmptyState";
import SpaceGridCard from "@/components/admin/spaces/SpaceGridCard";
import SpaceDeleteModal from "@/components/admin/spaces/SpaceDeleteModal";

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
        <SpaceGridCard
          spaces={spaces}
          onRequestDelete={setDeleteTarget}
        />
      )}

      <SpaceDeleteModal
        deleteTarget={deleteTarget}
        isDeleting={isDeleting}
        deleteError={deleteError}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}