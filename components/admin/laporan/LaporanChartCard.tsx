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
import type { MonthlyReport } from "@/lib/types/admin";
import { formatRupiah } from "@/lib/utils/format";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";

interface LaporanChartCardProps {
  rincian: MonthlyReport["rincian_per_tipe_space"];
}

export default function LaporanChartCard({ rincian }: LaporanChartCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pendapatan per Tipe Ruangan</CardTitle>
      </CardHeader>
      {rincian.length === 0 ? (
        <EmptyState
          title="Belum ada data"
          description="Belum ada transaksi pada periode ini"
        />
      ) : (
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={rincian}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="label" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value: any) =>
                  typeof value === "number" ? formatRupiah(value) : ""
                }
              />
              <Legend />
              <Bar
                dataKey="total_pendapatan"
                name="Total Pendapatan"
                fill="#6366f1"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}
