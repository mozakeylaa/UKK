import Link from "next/link";
import type { Reservasi } from "@/lib/types/reservasi";
import { formatRupiah } from "@/lib/utils/format";
import Badge from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import Table from "@/components/ui/Table";

interface ReservasiTableCardProps {
  reservasiList: Reservasi[];
}

export default function ReservasiTableCard({ reservasiList }: ReservasiTableCardProps) {
  return (
    <Card>
      <Table<Reservasi>
        columns={[
          {
            header: "Kode Booking",
            accessor: (row) => (
              <Link
                href={`/admin/reservasi/${row.id}`}
                className="font-medium text-brand-600 hover:underline"
              >
                {row.kode_booking}
              </Link>
            ),
          },
          {
            header: "Member",
            accessor: (row) => row.member?.nama_member ?? "-",
          },
          {
            header: "Ruangan",
            accessor: (row) => row.space?.nama_space ?? "-",
          },
          {
            header: "Tanggal",
            accessor: (row) => row.tanggal_reservasi,
          },
          {
            header: "Jam",
            accessor: (row) => `${row.jam_mulai} - ${row.jam_selesai}`,
          },
          {
            header: "Total Bayar",
            accessor: (row) => formatRupiah(row.total_bayar),
          },
          {
            header: "Status",
            accessor: (row) => <Badge status={row.status} />,
          },
        ]}
        data={reservasiList}
        keyExtractor={(row) => row.id}
      />
    </Card>
  );
}
