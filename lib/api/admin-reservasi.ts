import apiClient from "@/lib/api/client";
import type { ApiResponse } from "@/lib/types/api";
import type {
  Reservasi,
  AdminReservasiFilter,
} from "@/lib/types/reservasi";
import type { ReservasiStatus } from "@/components/ui/Badge";

export async function getAdminReservasiList(
  filter?: AdminReservasiFilter
): Promise<ApiResponse<Reservasi[]>> {
  const res = await apiClient.get<ApiResponse<Reservasi[]>>(
    "/api/admin/reservasi",
    { params: filter }
  );
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
  return res.data;
}

export async function checkInReservasi(id: number): Promise<ApiResponse<Reservasi>> {
  const res = await apiClient.post<ApiResponse<Reservasi>>(
    `/api/admin/reservasi/${id}/check-in`
  );
  return res.data;
}

export async function checkOutReservasi(id: number): Promise<ApiResponse<Reservasi>> {
  const res = await apiClient.post<ApiResponse<Reservasi>>(
    `/api/admin/reservasi/${id}/check-out`
  );
  return res.data;
}