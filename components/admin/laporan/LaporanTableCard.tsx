import type { MonthlyReport } from "@/lib/types/admin";
import { formatRupiah } from "@/lib/utils/format";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";
import Table from "@/components/ui/Table";

interface LaporanTableCardProps {
  rincian: MonthlyReport["rincian_per_tipe_space"];
}

export default function LaporanTableCard({ rincian }: LaporanTableCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Rincian per Tipe Ruangan</CardTitle>
      </CardHeader>
      {rincian.length === 0 ? (
        <EmptyState
          title="Belum ada data"
          description="Belum ada transaksi pada periode ini"
        />
      ) : (
        <Table
          columns={[
            { header: "Tipe", accessor: (row) => row.label },
            { header: "Total Booking", accessor: (row) => row.total_booking },
            { header: "Total Jam", accessor: (row) => `${row.total_jam} jam` },
            {
              header: "Total Pendapatan",
              accessor: (row) => formatRupiah(row.total_pendapatan),
            },
          ]}
          data={rincian}
          keyExtractor={(row) => row.tipe}
        />
      )}
    </Card>
  );
}
