"use client";

import { useState } from "react";
import Link from "next/link";
import type { Member } from "@/lib/types/member";
import { getImageUrl, getStoredMemberAvatar } from "@/lib/utils/format";
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

function getMemberPhotoUrl(member: Member): string | null {
  const candidate = member.foto || member.foto_url;
  const resolved = getImageUrl(candidate, "members");
  if (resolved) return resolved;

  if (member.id) {
    const stored = getStoredMemberAvatar(member.id);
    if (stored) return getImageUrl(stored, "members");
  }

  return null;
}

function MemberAvatarCell({ member }: { member: Member }) {
  const photo = getMemberPhotoUrl(member);
  const initial = (member.nama_member || "M").trim().charAt(0).toUpperCase();

  // Variasi warna gradien berdasarkan nama member agar setiap member punya warna khas
  const colorGradients = [
    "from-[#6367FF] to-[#8494FF]",
    "from-[#FF5DA2] to-[#FF8FC2]",
    "from-[#0EA5E9] to-[#38BDF8]",
    "from-[#10B981] to-[#34D399]",
    "from-[#8B5CF6] to-[#A78BFA]",
    "from-[#F59E0B] to-[#FBBF24]",
  ];
  const colorIdx = Math.abs(
    (member.id ?? 0) + (member.nama_member?.length ?? 0)
  ) % colorGradients.length;
  const gradient = colorGradients[colorIdx];

  return (
    <div className="flex items-center gap-3">
      {photo ? (
        <img
          src={photo}
          alt={member.nama_member}
          className="h-9 w-9 shrink-0 rounded-full object-cover border border-slate-200 shadow-xs"
          onError={(e) => {
            (e.currentTarget as HTMLElement).style.display = "none";
            const fallback = e.currentTarget.nextElementSibling as HTMLElement;
            if (fallback) fallback.style.display = "flex";
          }}
        />
      ) : null}

      <div
        className={`h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${gradient} text-white text-xs font-bold shadow-xs ${
          photo ? "hidden" : "flex"
        }`}
      >
        {initial}
      </div>

      <div className="flex flex-col min-w-0">
        <span className="font-semibold text-xs sm:text-sm text-slate-900 truncate">
          {member.nama_member}
        </span>
        <span className="text-[11px] text-slate-400 truncate">
          @{member.username || `user_${member.id}`}
        </span>
      </div>
    </div>
  );
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
                <MemberAvatarCell member={member} />
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
                <Link
                  href={`/admin/members/${member.id}/edit`}
                  className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 hover:border-[#6367FF] hover:text-[#6367FF] transition-all"
                >
                  Edit
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
              header: "Nama Member",
              accessor: (row) => <MemberAvatarCell member={row} />,
            },
            {
              header: "Instansi",
              accessor: (row) => (
                <span className="text-xs text-slate-600 font-medium">
                  {row.instansi || "-"}
                </span>
              ),
            },
            {
              header: "Telepon",
              accessor: (row) => (
                <span className="text-xs text-slate-600 font-mono">
                  {row.telp || "-"}
                </span>
              ),
            },
            {
              header: "Alamat",
              accessor: (row) => (
                <span className="text-xs text-slate-500 truncate max-w-[200px] block">
                  {row.alamat || "-"}
                </span>
              ),
            },
            {
              header: "Aksi",
              accessor: (row) => (
                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/members/${row.id}/edit`}
                    className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 hover:border-[#6367FF] hover:text-[#6367FF] transition-all"
                  >
                    Edit
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