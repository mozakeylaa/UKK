import Link from "next/link";
import type { Reservasi } from "@/lib/types/reservasi";
import { formatRupiah, formatDate } from "@/lib/utils/format";
import Badge from "@/components/ui/Badge";
import Table from "@/components/ui/Table";

interface ReservasiTableCardProps {
  reservasiList: Reservasi[];
}

export default function ReservasiTableCard({ reservasiList }: ReservasiTableCardProps) {
  return (
    <Table<Reservasi>
      columns={[
        {
          header: "Kode Booking",
          accessor: (row) => (
            <Link
              href={`/admin/reservasi/${row.id}`}
              className="inline-flex items-center gap-1 font-mono font-bold text-xs text-[#6367FF] hover:text-[#4A4FE0] hover:underline bg-[#EEEFFF] px-2.5 py-1 rounded-lg transition-colors"
            >
              {row.kode_booking || `CWK-${String(row.id).padStart(6, "0")}`}
            </Link>
          ),
        },
        {
          header: "Member",
          accessor: (row) => {
            const memberName = row.member?.nama_member || `Member #${row.id_member || row.id}`;
            const subText = row.member?.instansi || row.member?.telp || (row.member?.alamat ? row.member.alamat : "Member Terdaftar");
            const initial = memberName.charAt(0).toUpperCase();
            return (
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#6367FF] to-[#8494FF] text-white text-xs font-bold shadow-xs">
                  {initial}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-semibold text-xs sm:text-sm text-slate-900 truncate">
                    {memberName}
                  </span>
                  <span className="text-[11px] text-slate-500 truncate max-w-[180px]">
                    {subText}
                  </span>
                </div>
              </div>
            );
          },
        },
        {
          header: "Ruangan",
          accessor: (row) => (
            <div className="flex flex-col">
              <span className="font-semibold text-xs text-slate-800">
                {row.space?.nama_space ?? `Ruangan #${row.id_space || "-"}`}
              </span>
              {row.space?.tipe && (
                <span className="text-[10px] font-medium text-slate-400 capitalize">
                  {row.space.tipe.replace("_", " ")}
                </span>
              )}
            </div>
          ),
        },
        {
          header: "Tanggal",
          accessor: (row) => (
            <span className="text-xs font-medium text-slate-700">
              {formatDate(row.tanggal_reservasi)}
            </span>
          ),
        },
        {
          header: "Waktu",
          accessor: (row) => (
            <div className="text-xs text-slate-700 font-medium">
              <span>
                {row.jam_mulai} – {row.jam_selesai}
              </span>
              <span className="text-[10px] text-slate-400 block font-normal">
                ({row.durasi_jam} jam)
              </span>
            </div>
          ),
        },
        {
          header: "Total Bayar",
          accessor: (row) => (
            <div className="flex flex-col">
              <span className="font-bold text-xs sm:text-sm text-slate-900">
                {formatRupiah(row.total_bayar)}
              </span>
              {row.nama_diskon && (
                <span className="text-[10px] font-medium text-emerald-600 truncate max-w-[120px]">
                  Diskon: {row.nama_diskon}
                </span>
              )}
            </div>
          ),
        },
        {
          header: "Status",
          accessor: (row) => <Badge status={row.status} />,
        },
        {
          header: "Aksi",
          accessor: (row) => (
            <Link
              href={`/admin/reservasi/${row.id}`}
              className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 hover:border-[#6367FF] hover:bg-[#EEEFFF] hover:text-[#6367FF] transition-all"
            >
              Detail &rarr;
            </Link>
          ),
        },
      ]}
      data={reservasiList}
      keyExtractor={(row) => row.id}
    />
  );
}
