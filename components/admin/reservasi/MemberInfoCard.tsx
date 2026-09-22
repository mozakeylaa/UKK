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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
        <div>
          <p className="text-slate-400 font-medium">Nama Member</p>
          <p className="font-semibold text-slate-900 mt-0.5">{member?.nama_member ?? "-"}</p>
        </div>
        <div>
          <p className="text-slate-400 font-medium">Username / ID Akun</p>
          <p className="font-semibold text-slate-900 mt-0.5">
            {member?.username ? `@${member.username}` : member?.id_user ? `User #${member.id_user}` : "-"}
          </p>
        </div>
        <div>
          <p className="text-slate-400 font-medium">Instansi</p>
          <p className="font-semibold text-slate-900 mt-0.5">{member?.instansi ?? "-"}</p>
        </div>
        <div>
          <p className="text-slate-400 font-medium">Nomor Telepon</p>
          <p className="font-semibold text-slate-900 mt-0.5">{member?.telp ?? "-"}</p>
        </div>
        {member?.alamat && (
          <div className="sm:col-span-2 border-t border-slate-100 pt-3">
            <p className="text-slate-400 font-medium">Alamat</p>
            <p className="font-semibold text-slate-900 mt-0.5">{member.alamat}</p>
          </div>
        )}
      </div>
    </Card>
  );
}
