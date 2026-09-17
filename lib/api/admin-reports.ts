import apiClient from "@/lib/api/client";
import type { ApiResponse } from "@/lib/types/api";
import type { MonthlyReport } from "@/lib/types/admin";

export type MonthlyReportParams = {
  month?: number;
  year?: number;
};

export async function getMonthlyReport(
  params?: MonthlyReportParams
): Promise<ApiResponse<MonthlyReport>> {
  const res = await apiClient.get<ApiResponse<MonthlyReport>>(
    "/api/admin/reports/monthly",
    { params }
  );
  return res.data;
}