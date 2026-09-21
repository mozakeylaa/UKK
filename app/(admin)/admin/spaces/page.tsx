"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Building2, AlertTriangle, Armchair } from "lucide-react";
import { getAdminSpaces, deleteAdminSpace } from "@/lib/api/admin-spaces";
import { isApiSuccess } from "@/lib/types/api";
import type { AdminSpace } from "@/lib/types/admin";
import Spinner from "@/components/ui/Spinner";
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
      setDeleteError("Terjadi kesalahan sistem saat menghapus space. Coba lagi.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            Kelola Space
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Daftar seluruh ruangan, meja kerja, dan tipe space coworking yang kamu kelola.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-2 text-xs font-semibold text-slate-600 border border-slate-200/80 shadow-sm">
            <Building2 size={14} className="text-[#6367FF]" />
            <span>Total: {spaces.length} Ruang</span>
          </div>

          <Link
            href="/admin/spaces/baru"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#FF5DA2] to-[#FF8FC2] px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-[#FF5DA2]/25 hover:opacity-95 transition-opacity"
          >
            <Plus size={16} />
            Tambah Space
          </Link>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20">
          <Spinner label="Memuat data space..." />
        </div>
      )}

      {/* Error State */}
      {!isLoading && error && (
        <div className="flex flex-col items-center justify-center rounded-3xl bg-white p-12 text-center border border-rose-100 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
            <AlertTriangle size={24} />
          </div>
          <h3 className="mt-4 font-display text-base font-bold text-slate-900">Gagal Memuat Data</h3>
          <p className="mt-1 text-xs text-slate-500 max-w-sm">{error}</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && spaces.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-3xl bg-white p-12 text-center border border-slate-100 shadow-sm">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-[#EEEFFF] text-[#6367FF]">
            <Armchair size={28} />
          </div>
          <h3 className="mt-4 font-display text-base font-bold text-slate-900">Belum Ada Space</h3>
          <p className="mt-1 text-xs text-slate-500 max-w-sm">
            Katalog space kamu masih kosong. Tambahkan ruangan pertama untuk mulai menerima reservasi.
          </p>
          <Link
            href="/admin/spaces/baru"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#FF5DA2] to-[#FF8FC2] px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-[#FF5DA2]/25 hover:opacity-95 transition-opacity"
          >
            <Plus size={16} />
            Tambah Space Pertama
          </Link>
        </div>
      )}

      {/* Grid List Spaces */}
      {!isLoading && !error && spaces.length > 0 && (
        <SpaceGridCard
          spaces={spaces}
          onRequestDelete={setDeleteTarget}
        />
      )}

      {/* Modal Hapus Space */}
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