"use client";

import { useState } from "react";
import Link from "next/link";
import type { Member } from "@/lib/types/member";
import { getMemberAvatarUrl } from "@/lib/utils/format";
import Button from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import Table from "@/components/ui/Table";
import Pagination from "@/components/ui/Pagination";

interface MemberTableCardProps {
  members: Member[];
  onRequestDelete: (id: number, name: string) => void;
}

// Helper untuk membaca username dari berbagai variasi response API
function getUsername(member: any): string {
  if (member?.username) return member.username;
  if (member?.user?.username) return member.user.username;
  if (member?.users?.username) return member.users.username;
  if (member?.email) return member.email.split("@")[0];
  return "-";
}

export default function MemberTableCard({
  members,
  onRequestDelete,
}: MemberTableCardProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  if (!members || members.length === 0) {
    return null;
  }

  const totalPages = Math.ceil(members.length / itemsPerPage);
  const paginatedMembers = members.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Card className="flex flex-col gap-4 overflow-hidden w-full">
      {/* =========================================================
          1. TAMPILAN MOBILE & TABLET (CARD VIEW - TIDAK ADA SCROLL SAMPING)
      ========================================================= */}
      <div className="flex flex-col gap-3 lg:hidden w-full">
        {paginatedMembers.map((member: any) => {
          const uname = getUsername(member);
          const nama = member.nama_member || member.nama || "Member";
          const instansi = member.instansi || "-";
          const telp = member.telp || member.no_telepon || "-";

          return (
            <div
              key={member.id}
              className="flex flex-col gap-3 rounded-2xl border border-surface-200 bg-surface-50/70 p-3.5 sm:p-4 w-full"
            >
              {/* Header Card: Avatar & Nama & Username */}
              <div className="flex items-center gap-3">
                <img
                  src={getMemberAvatarUrl(member)}
                  alt={nama}
                  className="h-10 w-10 sm:h-11 sm:w-11 rounded-full object-cover border border-slate-200 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="font-semibold text-ink-950 text-sm truncate">
                    {nama}
                  </h4>
                  <p className="text-xs text-ink-600 truncate">
                    @{uname}
                  </p>
                </div>
              </div>

              {/* Detail Info: Instansi & Telepon */}
              <div className="grid grid-cols-2 gap-2 rounded-xl bg-white p-2.5 text-xs border border-surface-100">
                <div className="min-w-0">
                  <span className="text-[10px] text-ink-600/70 block font-medium">Instansi</span>
                  <p className="font-medium text-ink-950 truncate mt-0.5">
                    {instansi}
                  </p>
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] text-ink-600/70 block font-medium">Telepon</span>
                  <p className="font-medium text-ink-950 truncate mt-0.5">
                    {telp}
                  </p>
                </div>
              </div>

              {/* Action Buttons: Langsung Kelihatan di Layar HP */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-surface-200/60">
                <Link href={`/admin/members/${member.id}/edit`}>
                  <Button variant="outline" size="sm" type="button">
                    Edit
                  </Button>
                </Link>
                <Button
                  variant="danger"
                  size="sm"
                  type="button"
                  onClick={() => onRequestDelete(member.id, nama)}
                >
                  Hapus
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* =========================================================
          2. TAMPILAN DESKTOP BESAR (TABLE VIEW)
      ========================================================= */}
      <div className="hidden lg:block w-full overflow-x-auto">
        <Table<Member>
          columns={[
            {
              header: "Username",
              accessor: (row) => (
                <span className="font-mono text-xs text-ink-600">
                  @{getUsername(row)}
                </span>
              ),
            },
            {
              header: "Nama",
              accessor: (row) => (
                <div className="flex items-center gap-3">
                  <img
                    src={getMemberAvatarUrl(row)}
                    alt={row.nama_member}
                    className="h-8 w-8 rounded-full object-cover border border-slate-200 shrink-0"
                  />
                  <span className="font-medium text-ink-950">{row.nama_member}</span>
                </div>
              ),
            },
            { header: "Instansi", accessor: (row) => row.instansi || "-" },
            { header: "Telepon", accessor: (row) => row.telp || "-" },
            {
              header: "Aksi",
              accessor: (row) => (
                <div className="flex items-center gap-2">
                  <Link href={`/admin/members/${row.id}/edit`}>
                    <Button variant="outline" size="sm" type="button">
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant="danger"
                    size="sm"
                    type="button"
                    onClick={() => onRequestDelete(row.id, row.nama_member)}
                  >
                    Hapus
                  </Button>
                </div>
              ),
            },
          ]}
          data={paginatedMembers}
          keyExtractor={(row) => row.id}
        />
      </div>

      {/* =========================================================
          3. PAGINATION
      ========================================================= */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </Card>
  );
}