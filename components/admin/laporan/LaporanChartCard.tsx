import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { RincianTipeSpace } from "@/lib/types/admin";
import { formatRupiah } from "@/lib/utils/format";
import EmptyState from "@/components/ui/EmptyState";

interface LaporanChartCardProps {
  rincian?: RincianTipeSpace[];
}

export default function LaporanChartCard({ rincian = [] }: LaporanChartCardProps) {
  const hasData = rincian.length > 0 && rincian.some((r) => (r.total_pendapatan ?? 0) > 0 || (r.total_booking ?? 0) > 0);

  return (
    <div>
      <div className="mb-4">
        <h3 className="font-display text-base font-bold text-slate-900">
          Pendapatan per Tipe Ruangan
        </h3>
        <p className="text-xs text-slate-400">
          Perbandingan omzet antar tipe coworking space pada periode ini
        </p>
      </div>

      {!hasData ? (
        <EmptyState
          title="Belum ada transaksi"
          description="Belum ada transaksi atau omzet tercatat pada periode yang dipilih"
        />
      ) : (
        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={rincian} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis 
                dataKey="label" 
                tick={{ fontSize: 12, fill: "#64748b" }} 
                axisLine={{ stroke: "#e2e8f0" }}
                tickLine={false}
              />
              <YAxis 
                tick={{ fontSize: 11, fill: "#64748b" }} 
                axisLine={false}
                tickLine={false}
                tickFormatter={(val) => {
                  if (val >= 1000000) return `${(val / 1000000).toFixed(1)}jt`;
                  if (val >= 1000) return `${(val / 1000).toFixed(0)}rb`;
                  return String(val);
                }}
              />
              <Tooltip
                formatter={(value: any) =>
                  typeof value === "number" ? [formatRupiah(value), "Total Pendapatan"] : ["", ""]
                }
                contentStyle={{
                  borderRadius: "16px",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05)",
                  fontSize: "12px",
                }}
              />
              <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "12px" }} />
              <Bar
                dataKey="total_pendapatan"
                name="Total Pendapatan"
                fill="#6367FF"
                radius={[8, 8, 0, 0]}
                maxBarSize={60}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

