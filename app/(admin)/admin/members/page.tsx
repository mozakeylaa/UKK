"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAdminMembers, deleteAdminMember } from "@/lib/api/admin-members";
import { isApiSuccess } from "@/lib/types/api";
import type { Member } from "@/lib/types/member";
import Button from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import Spinner from "@/components/ui/Spinner";
import Table from "@/components/ui/Table";

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
    } catch (err) {
      setError("Gagal memuat daftar member");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    setDeleteModal({ ...deleteModal, isDeleting: true });
    try {
      const res = await deleteAdminMember(id);
      if (isApiSuccess(res)) {
        setMembers(members.filter((m) => m.id !== id));
        setDeleteModal({ open: false, memberId: null, memberName: "", isDeleting: false });
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError("Gagal menghapus member");
    } finally {
      setDeleteModal({ ...deleteModal, isDeleting: false });
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-ink-950">Kelola Member</h1>
        <Link href="/admin/members/baru">
          <Button>+ Tambah Member</Button>
        </Link>
      </div>

      <Input
        placeholder="Cari nama, username, atau instansi..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {error && (
        <div className="rounded-md bg-status-cancelled/10 p-3 text-sm text-status-cancelled">
          {error}
        </div>
      )}

      {loading ? (
        <Spinner label="Memuat member..." />
      ) : members.length === 0 ? (
        <EmptyState
          title={search ? "Member tidak ditemukan" : "Belum ada member"}
          description={
            search
              ? "Coba kata kunci lain"
              : "Member akan muncul di sini setelah ditambahkan"
          }
        />
      ) : (
        <Card>
          <Table<Member>
            columns={[
              { header: "Username", accessor: (row) => row.username },
              { header: "Nama", accessor: (row) => row.nama_member },
              { header: "Instansi", accessor: (row) => row.instansi },
              { header: "Telepon", accessor: (row) => row.telp },
              {
                header: "Aksi",
                accessor: (row) => (
                  <div className="flex items-center gap-2">
                    <Link href={`/admin/members/${row.id}/edit`}>
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
                          memberId: row.id,
                          memberName: row.nama_member,
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
            data={members}
            keyExtractor={(row) => row.id}
          />
        </Card>
      )}

      <Modal
        open={deleteModal.open}
        onClose={() =>
          setDeleteModal({ open: false, memberId: null, memberName: "", isDeleting: false })
        }
        title="Hapus Member"
      >
        <div className="space-y-4">
          <p className="text-sm text-ink-600">
            Yakin ingin menghapus member <strong>{deleteModal.memberName}</strong>? Data reservasi
            terkait mungkin ikut terpengaruh.
          </p>
          <div className="flex gap-2 justify-end">
            <Button
              variant="ghost"
              onClick={() =>
                setDeleteModal({ open: false, memberId: null, memberName: "", isDeleting: false })
              }
            >
              Batal
            </Button>
            <Button
              variant="danger"
              isLoading={deleteModal.isDeleting}
              onClick={() => deleteModal.memberId && handleDelete(deleteModal.memberId)}
            >
              Hapus
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}