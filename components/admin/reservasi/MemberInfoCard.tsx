import type { ReservasiMember } from "@/lib/types/reservasi";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";

interface MemberInfoCardProps {
  member?: ReservasiMember;
}

export default function MemberInfoCard({ member }: MemberInfoCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Info Member</CardTitle>
      </CardHeader>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-ink-600">Nama</p>
          <p className="font-medium text-ink-950">{member?.nama_member ?? "-"}</p>
        </div>
        <div>
          <p className="text-ink-600">Username</p>
          <p className="font-medium text-ink-950">{member?.username ?? "-"}</p>
        </div>
        <div>
          <p className="text-ink-600">Instansi</p>
          <p className="font-medium text-ink-950">{member?.instansi ?? "-"}</p>
        </div>
        <div>
          <p className="text-ink-600">Telepon</p>
          <p className="font-medium text-ink-950">{member?.telp ?? "-"}</p>
        </div>
      </div>
    </Card>
  );
}
