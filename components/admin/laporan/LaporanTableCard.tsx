import type { RincianTipeSpace } from "@/lib/types/admin";
import { formatRupiah } from "@/lib/utils/format";
import EmptyState from "@/components/ui/EmptyState";

interface LaporanTableCardProps {
  rincian?: RincianTipeSpace[];
}

export default function LaporanTableCard({ rincian = [] }: LaporanTableCardProps) {
  const hasData = rincian.length > 0 && rincian.some((r) => (r.total_pendapatan ?? 0) > 0 || (r.total_booking ?? 0) > 0);
  const totalOmzet = rincian.reduce((acc, curr) => acc + (curr.total_pendapatan ?? 0), 0);

  return (
    <div>
      <div className="mb-4">
        <h3 className="font-display text-base font-bold text-slate-900">
          Rincian per Tipe Ruangan
        </h3>
        <p className="text-xs text-slate-400">
          Detail jumlah booking dan kontribusi omzet tiap kategori space
        </p>
      </div>

      {!hasData ? (
        <EmptyState
          title="Belum ada transaksi"
          description="Belum ada transaksi pada periode yang dipilih"
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                <th className="pb-3 pr-4">Tipe Space</th>
                <th className="pb-3 pr-4 text-center">Total Booking</th>
                <th className="pb-3 pr-4 text-right">Kontribusi</th>
                <th className="pb-3 text-right">Total Pendapatan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rincian.map((row) => {
                const pct = totalOmzet > 0 ? Math.round(((row.total_pendapatan ?? 0) / totalOmzet) * 100) : 0;
                return (
                  <tr key={row.tipe} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 pr-4">
                      <span className="font-bold text-slate-800">{row.label}</span>
                    </td>
                    <td className="py-3.5 pr-4 text-center">
                      <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 font-semibold text-slate-700">
                        {row.total_booking} booking
                      </span>
                    </td>
                    <td className="py-3.5 pr-4 text-right">
                      <span className="text-xs font-medium text-slate-500">{pct}%</span>
                    </td>
                    <td className="py-3.5 text-right font-bold text-slate-900">
                      {formatRupiah(row.total_pendapatan ?? 0)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-slate-100 font-bold text-slate-900">
                <td className="pt-3.5 pr-4">Total Keseluruhan</td>
                <td className="pt-3.5 pr-4 text-center">
                  {rincian.reduce((acc, curr) => acc + (curr.total_booking ?? 0), 0)} booking
                </td>
                <td className="pt-3.5 pr-4 text-right">100%</td>
                <td className="pt-3.5 text-right text-emerald-600">
                  {formatRupiah(totalOmzet)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
}

