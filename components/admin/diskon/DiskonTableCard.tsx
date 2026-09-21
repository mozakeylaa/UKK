import Link from "next/link";
import type { Diskon } from "@/lib/types/reservasi";
import Button from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import Table from "@/components/ui/Table";

function getDiskonStatus(diskon: Diskon): { label: string; active: boolean } {
  const now = new Date();
  const awal = new Date(diskon.tanggal_awal);
  const akhir = new Date(diskon.tanggal_akhir);

  if (now < awal) return { label: "Belum mulai", active: false };
  if (now > akhir) return { label: "Berakhir", active: false };
  return { label: "Aktif", active: true };
}

function formatTanggal(iso: string): string {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

interface DiskonTableCardProps {
  diskonList: Diskon[];
  onRequestDelete: (id: number, name: string) => void;
}

export default function DiskonTableCard({
  diskonList,
  onRequestDelete,
}: DiskonTableCardProps) {
  return (
    <Card>
      <Table<Diskon>
        columns={[
          { header: "Nama Diskon", accessor: (row) => row.nama_diskon },
          {
            header: "Persentase",
            accessor: (row) => `${row.persentase_diskon}%`,
          },
          {
            header: "Periode",
            accessor: (row) =>
              `${formatTanggal(row.tanggal_awal)} - ${formatTanggal(row.tanggal_akhir)}`,
          },
          {
            header: "Status",
            accessor: (row) => {
              const status = getDiskonStatus(row);
              return (
                <span
                  className={
                    status.active
                      ? "text-status-active font-medium"
                      : "text-ink-600"
                  }
                >
                  {status.label}
                </span>
              );
            },
          },
          {
            header: "Aksi",
            accessor: (row) => (
              <div className="flex items-center gap-2">
                <Link href={`/admin/diskon/${row.id}/edit`}>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </Link>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => onRequestDelete(row.id, row.nama_diskon)}
                >
                  Hapus
                </Button>
              </div>
            ),
          },
        ]}
        data={diskonList}
        keyExtractor={(row) => row.id}
      />
    </Card>
  );
}
