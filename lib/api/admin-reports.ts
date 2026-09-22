import apiClient from "@/lib/api/client";
import { isApiSuccess, type ApiResponse } from "@/lib/types/api";
import type { MonthlyReport, RincianTipeSpace } from "@/lib/types/admin";
import type { SpaceTipe } from "@/lib/types/space";

export type MonthlyReportParams = {
  month?: number;
  year?: number;
};

export function normalizeMonthlyReport(data: any): MonthlyReport {
  if (!data) return data;

  const ringkasan = data.ringkasan ?? {};
  const statusReservasi = ringkasan.status_reservasi ?? {};
  const pendapatanTipe = data.pendapatan_per_tipe_space ?? {};

  // Build rincian array for UI charts & tables
  const TIPE_CONFIG: Array<{ tipe: SpaceTipe; label: string; key: string }> = [
    { tipe: "meeting_room", label: "Meeting Room", key: "meeting_room" },
    { tipe: "private_office", label: "Private Office", key: "private_office" },
    { tipe: "desk", label: "Desk / Hot Desk", key: "desk" },
  ];

  const rincian: RincianTipeSpace[] = TIPE_CONFIG.map(({ tipe, label, key }) => {
    const item = pendapatanTipe[key] ?? {};
    return {
      tipe,
      label,
      total_booking: Number(item.count ?? 0),
      total_pendapatan: Number(item.total_income ?? 0),
    };
  });

  return {
    ...data,
    periode: data.periode,
    ringkasan: {
      total_reservasi: Number(ringkasan.total_reservasi ?? 0),
      estimasi_pendapatan_total: Number(ringkasan.estimasi_pendapatan_total ?? 0),
      realisasi_pendapatan: Number(ringkasan.realisasi_pendapatan ?? 0),
      status_reservasi: {
        belum_dikonfirm: Number(statusReservasi.belum_dikonfirm ?? 0),
        disetujui: Number(statusReservasi.disetujui ?? 0),
        aktif: Number(statusReservasi.aktif ?? 0),
        selesai: Number(statusReservasi.selesai ?? 0),
        dibatalkan: Number(statusReservasi.dibatalkan ?? 0),
      },
    },
    pendapatan_per_tipe_space: pendapatanTipe,
    tren_harian: Array.isArray(data.tren_harian) ? data.tren_harian : [],
    // Convenience fields
    total_transaksi: Number(ringkasan.total_reservasi ?? 0),
    estimasi_pendapatan_kotor: Number(ringkasan.estimasi_pendapatan_total ?? 0),
    realisasi_pendapatan_bersih: Number(ringkasan.realisasi_pendapatan ?? 0),
    total_potongan_diskon: Math.max(
      0,
      Number(ringkasan.estimasi_pendapatan_total ?? 0) - Number(ringkasan.realisasi_pendapatan ?? 0)
    ),
    rincian_per_tipe_space: rincian,
  };
}

export async function getMonthlyReport(
  params?: MonthlyReportParams
): Promise<ApiResponse<MonthlyReport>> {
  const res = await apiClient.get<ApiResponse<MonthlyReport>>(
    "/api/admin/reports/monthly",
    {
      params: {
        ...params,
        _t: Date.now(),
      },
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
      },
    }
  );
  if (isApiSuccess(res.data) && res.data.data) {
    return {
      ...res.data,
      data: normalizeMonthlyReport(res.data.data),
    };
  }
  return res.data;
}
