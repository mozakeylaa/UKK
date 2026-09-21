import Link from "next/link";
import type { Member } from "@/lib/types/member";
import Button from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import Table from "@/components/ui/Table";

interface MemberTableCardProps {
  members: Member[];
  onRequestDelete: (id: number, name: string) => void;
}

export default function MemberTableCard({
  members,
  onRequestDelete,
}: MemberTableCardProps) {
  return (
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
                  onClick={() => onRequestDelete(row.id, row.nama_member)}
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
  );
}
