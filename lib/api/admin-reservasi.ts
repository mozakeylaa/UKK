import apiClient from "@/lib/api/client";
import type { ApiResponse } from "@/lib/types/api";
import type {
  Reservasi,
  AdminReservasiFilter,
} from "@/lib/types/reservasi";
import type { ReservasiStatus } from "@/components/ui/Badge";
import { normalizeReservasi } from "@/lib/api/reservasi-helper";

function cleanAdminFilter(filter?: AdminReservasiFilter): Record<string, unknown> | undefined {
  if (!filter) return undefined;
  const cleaned: Record<string, unknown> = {};
  if (filter.month !== undefined && filter.month !== null && Number(filter.month) > 0) {
    cleaned.month = Number(filter.month);
  }
  if (filter.year !== undefined && filter.year !== null && Number(filter.year) > 0) {
    cleaned.year = Number(filter.year);
  }
  if (filter.status && typeof filter.status === "string" && filter.status.trim() !== "") {
    cleaned.status = filter.status.trim();
  }
  if (filter.id_space !== undefined && filter.id_space !== null && Number(filter.id_space) > 0) {
    cleaned.id_space = Number(filter.id_space);
  }
  if (filter.tanggal && typeof filter.tanggal === "string" && filter.tanggal.trim() !== "") {
    cleaned.tanggal = filter.tanggal.trim();
  }
  return Object.keys(cleaned).length > 0 ? cleaned : undefined;
}

import { isApiSuccess } from "@/lib/types/api";

export async function getAdminReservasiList(
  filter?: AdminReservasiFilter
): Promise<ApiResponse<Reservasi[]>> {
  const cleanedParams = cleanAdminFilter(filter);
  const res = await apiClient.get<ApiResponse<Reservasi[]>>(
    "/api/admin/reservasi",
    { params: cleanedParams }
  );
  if (isApiSuccess(res.data) && Array.isArray(res.data.data)) {
    return {
      ...res.data,
      data: res.data.data.map(normalizeReservasi),
    };
  }
  return res.data;
}

export async function updateReservasiStatus(
  id: number,
  status: ReservasiStatus
): Promise<ApiResponse<Reservasi>> {
  const res = await apiClient.patch<ApiResponse<Reservasi>>(
    `/api/admin/reservasi/${id}/status`,
    { status }
  );
  if (isApiSuccess(res.data) && res.data.data) {
    return {
      ...res.data,
      data: normalizeReservasi(res.data.data),
    };
  }
  return res.data;
}

export async function checkInReservasi(id: number): Promise<ApiResponse<Reservasi>> {
  const res = await apiClient.post<ApiResponse<Reservasi>>(
    `/api/admin/reservasi/${id}/check-in`
  );
  if (isApiSuccess(res.data) && res.data.data) {
    return {
      ...res.data,
      data: normalizeReservasi(res.data.data),
    };
  }
  return res.data;
}

export async function checkOutReservasi(id: number): Promise<ApiResponse<Reservasi>> {
  const res = await apiClient.post<ApiResponse<Reservasi>>(
    `/api/admin/reservasi/${id}/check-out`
  );
  if (isApiSuccess(res.data) && res.data.data) {
    return {
      ...res.data,
      data: normalizeReservasi(res.data.data),
    };
  }
  return res.data;
}