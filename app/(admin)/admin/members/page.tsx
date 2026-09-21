"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Users, Search, AlertTriangle, UserX } from "lucide-react";
import { getAdminMembers, deleteAdminMember } from "@/lib/api/admin-members";
import { isApiSuccess } from "@/lib/types/api";
import type { Member } from "@/lib/types/member";
import Spinner from "@/components/ui/Spinner";
import MemberTableCard from "@/components/admin/members/MemberTableCard";
import MemberDeleteModal from "@/components/admin/members/MemberDeleteModal";

export default function AdminMembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    memberId: number | null;
    memberName: string;
    isDeleting: boolean;
  }>({
    open: false,
    memberId: null,
    memberName: "",
    isDeleting: false,
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchMembers(search);
    }, 400);
    return () => clearTimeout(timeout);
  }, [search]);

  async function fetchMembers(searchQuery: string) {
    try {
      setLoading(true);
      setError(null);
      const res = await getAdminMembers(searchQuery || undefined);
      if (isApiSuccess(res)) {
        setMembers(res.data);
      } else {
        setError(res.message);
      }
    } catch {
      setError("Gagal memuat daftar member dari server.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    setDeleteModal((prev) => ({ ...prev, isDeleting: true }));
    try {
      const res = await deleteAdminMember(id);
      if (isApiSuccess(res)) {
        setMembers(members.filter((m) => m.id !== id));
        setDeleteModal({ open: false, memberId: null, memberName: "", isDeleting: false });
      } else {
        setError(res.message);
      }
    } catch {
      setError("Gagal menghapus member. Silakan coba lagi.");
    } finally {
      setDeleteModal((prev) => ({ ...prev, isDeleting: false }));
    }
  }

  function handleRequestDelete(id: number, name: string) {
    setDeleteModal({
      open: true,
      memberId: id,
      memberName: name,
      isDeleting: false,
    });
  }

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            Kelola Member
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Daftar member terdaftar, status keanggotaan, dan kelola data akun.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-2 text-xs font-semibold text-slate-600 border border-slate-200/80 shadow-sm">
            <Users size={14} className="text-[#6367FF]" />
            <span>Total: {members.length} Member</span>
          </div>

          <Link
            href="/admin/members/baru"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#FF5DA2] to-[#FF8FC2] px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-[#FF5DA2]/25 hover:opacity-95 transition-opacity"
          >
            <Plus size={16} />
            Tambah Member
          </Link>
        </div>
      </div>

      {/* Search Bar Container */}
      <div className="relative rounded-2xl bg-white border border-slate-100 shadow-sm p-1.5 focus-within:ring-2 focus-within:ring-[#6367FF]/20 focus-within:border-[#6367FF] transition-all">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
          <Search size={17} />
        </div>
        <input
          type="text"
          placeholder="Cari berdasarkan nama, username, atau instansi member..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl bg-transparent py-2.5 pl-10 pr-4 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
        />
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
          <Spinner label="Memuat data member..." />
        </div>
      ) : members.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl bg-white p-12 text-center border border-slate-100 shadow-sm">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-[#EEEFFF] text-[#6367FF]">
            <UserX size={28} />
          </div>
          <h3 className="mt-4 font-display text-base font-bold text-slate-900">
            {search ? "Member Tidak Ditemukan" : "Belum Ada Member"}
          </h3>
          <p className="mt-1 text-xs text-slate-500 max-w-sm">
            {search
              ? `Tidak ada member yang cocok dengan kata kunci "${search}". Coba cari kata kunci lain.`
              : "Belum ada member yang mendaftar atau ditambahkan ke sistem."}
          </p>
          {!search && (
            <Link
              href="/admin/members/baru"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#FF5DA2] to-[#FF8FC2] px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-[#FF5DA2]/25 hover:opacity-95 transition-opacity"
            >
              <Plus size={16} />
              Tambah Member Pertama
            </Link>
          )}
        </div>
      ) : (
        <div className="rounded-3xl bg-white p-5 sm:p-6 border border-slate-100 shadow-sm overflow-hidden">
          <MemberTableCard
            members={members}
            onRequestDelete={handleRequestDelete}
          />
        </div>
      )}

      {/* Modal Konfirmasi Hapus */}
      <MemberDeleteModal
        open={deleteModal.open}
        memberName={deleteModal.memberName}
        isDeleting={deleteModal.isDeleting}
        onClose={() =>
          setDeleteModal({ open: false, memberId: null, memberName: "", isDeleting: false })
        }
        onConfirm={() => deleteModal.memberId && handleDelete(deleteModal.memberId)}
      />
    </div>
  );
}