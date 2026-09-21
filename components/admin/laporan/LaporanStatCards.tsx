import type { MonthlyReport } from "@/lib/types/admin";
import { formatRupiah } from "@/lib/utils/format";
import { Card } from "@/components/ui/Card";

interface LaporanStatCardsProps {
  report: MonthlyReport;
}

export default function LaporanStatCards({ report }: LaporanStatCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
      <Card>
        <p className="text-sm text-ink-600">Total Transaksi</p>
        <p className="mt-1 text-2xl font-semibold text-ink-950">
          {report.total_transaksi ?? 0}
        </p>
      </Card>
      <Card>
        <p className="text-sm text-ink-600">Total Jam Terpakai</p>
        <p className="mt-1 text-2xl font-semibold text-ink-950">
          {report.total_jam_terpakai ?? 0} jam
        </p>
      </Card>
      <Card>
        <p className="text-sm text-ink-600">Pendapatan Kotor</p>
        <p className="mt-1 text-2xl font-semibold text-ink-950">
          {formatRupiah(report.estimasi_pendapatan_kotor)}
        </p>
      </Card>
      <Card>
        <p className="text-sm text-ink-600">Total Potongan Diskon</p>
        <p className="mt-1 text-2xl font-semibold text-status-cancelled">
          -{formatRupiah(report.total_potongan_diskon)}
        </p>
      </Card>
      <Card className="col-span-2 md:col-span-1">
        <p className="text-sm text-ink-600">Pendapatan Bersih</p>
        <p className="mt-1 text-2xl font-semibold text-status-active">
          {formatRupiah(report.realisasi_pendapatan_bersih)}
        </p>
      </Card>
    </div>
  );
}
