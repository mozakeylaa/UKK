"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Tag, AlertTriangle, Ticket } from "lucide-react";
import { getAdminDiskon, deleteAdminDiskon } from "@/lib/api/admin-diskon";
import { isApiSuccess } from "@/lib/types/api";
import type { Diskon } from "@/lib/types/reservasi";
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
    } catch {
      setError("Gagal memuat daftar diskon dari server.");
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
    } catch {
      setError("Gagal menghapus promo diskon. Silakan coba lagi.");
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

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            Kelola Diskon &amp; Promo
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Atur voucher diskon, persentase potongan harga, dan kuota kode promo member.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-2 text-xs font-semibold text-slate-600 border border-slate-200/80 shadow-sm">
            <Tag size={14} className="text-[#6367FF]" />
            <span>Total: {diskonList.length} Promo</span>
          </div>

          <Link
            href="/admin/diskon/baru"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#FF5DA2] to-[#FF8FC2] px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-[#FF5DA2]/25 hover:opacity-95 transition-opacity"
          >
            <Plus size={16} />
            Tambah Diskon
          </Link>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="flex items-center gap-3 rounded-2xl bg-rose-50 border border-rose-200 p-4 text-xs font-medium text-rose-600">
          <AlertTriangle size={18} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Content View */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Spinner label="Memuat voucher diskon..." />
        </div>
      ) : diskonList.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl bg-white p-12 text-center border border-slate-100 shadow-sm">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-[#FFDBFD] text-[#FF5DA2]">
            <Ticket size={28} />
          </div>
          <h3 className="mt-4 font-display text-base font-bold text-slate-900">Belum Ada Kode Diskon</h3>
          <p className="mt-1 text-xs text-slate-500 max-w-sm">
            Buat kode promo baru untuk menarik lebih banyak member melakukan reservasi ruang.
          </p>
          <Link
            href="/admin/diskon/baru"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#FF5DA2] to-[#FF8FC2] px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-[#FF5DA2]/25 hover:opacity-95 transition-opacity"
          >
            <Plus size={16} />
            Tambah Diskon Pertama
          </Link>
        </div>
      ) : (
        <div className="rounded-3xl bg-white p-5 sm:p-6 border border-slate-100 shadow-sm overflow-hidden">
          <DiskonTableCard
            diskonList={diskonList}
            onRequestDelete={handleRequestDelete}
          />
        </div>
      )}

      {/* Delete Confirmation Modal */}
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