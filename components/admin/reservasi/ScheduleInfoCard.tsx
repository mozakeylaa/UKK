import { Card, CardHeader, CardTitle } from "@/components/ui/Card";

interface ScheduleInfoCardProps {
  namaSpace?: string;
  tanggalReservasi: string;
  jamMulai: string;
  jamSelesai: string;
  durasiJam: number;
  checkedInAt?: string | null;
  checkedOutAt?: string | null;
}

export default function ScheduleInfoCard({
  namaSpace,
  tanggalReservasi,
  jamMulai,
  jamSelesai,
  durasiJam,
  checkedInAt,
  checkedOutAt,
}: ScheduleInfoCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Info Ruangan & Jadwal</CardTitle>
      </CardHeader>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-ink-600">Ruangan</p>
          <p className="font-medium text-ink-950">{namaSpace ?? "-"}</p>
        </div>
        <div>
          <p className="text-ink-600">Tanggal</p>
          <p className="font-medium text-ink-950">{tanggalReservasi}</p>
        </div>
        <div>
          <p className="text-ink-600">Jam</p>
          <p className="font-medium text-ink-950">
            {jamMulai} - {jamSelesai}
          </p>
        </div>
        <div>
          <p className="text-ink-600">Durasi</p>
          <p className="font-medium text-ink-950">{durasiJam} jam</p>
        </div>
        {checkedInAt && (
          <div>
            <p className="text-ink-600">Check-In</p>
            <p className="font-medium text-ink-950">{checkedInAt}</p>
          </div>
        )}
        {checkedOutAt && (
          <div>
            <p className="text-ink-600">Check-Out</p>
            <p className="font-medium text-ink-950">{checkedOutAt}</p>
          </div>
        )}
      </div>
    </Card>
  );
}
