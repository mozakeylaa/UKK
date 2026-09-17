import apiClient from "@/lib/api/client";
import type { ApiResponse } from "@/lib/types/api";
import type {
  Reservasi,
  CreateReservasiPayload,
  HistoryResponse,
  ETicket,
} from "@/lib/types/reservasi";

export async function createReservasi(
  payload: CreateReservasiPayload
): Promise<ApiResponse<Reservasi>> {
  const res = await apiClient.post<ApiResponse<Reservasi>>(
    "/api/reservasi",
    payload
  );
  return res.data;
}

export async function getReservasiById(
  id: number
): Promise<ApiResponse<Reservasi>> {
  const res = await apiClient.get<ApiResponse<Reservasi>>(
    `/api/reservasi/${id}`
  );
  return res.data;
}

export async function getMyReservasi(): Promise<ApiResponse<Reservasi[]>> {
  const res = await apiClient.get<ApiResponse<Reservasi[]>>(
    "/api/reservasi/my"
  );
  return res.data;
}

export type HistoryParams = {
  month?: number;
  year?: number;
};

export async function getMyHistory(
  params?: HistoryParams
): Promise<ApiResponse<HistoryResponse>> {
  const res = await apiClient.get<ApiResponse<HistoryResponse>>(
    "/api/reservasi/my/history",
    { params }
  );
  return res.data;
}

export async function getETicket(id: number): Promise<ApiResponse<ETicket>> {
  const res = await apiClient.get<ApiResponse<ETicket>>(
    `/api/reservasi/${id}/e-ticket`
  );
  return res.data;
}

export async function cancelReservasi(
  id: number
): Promise<ApiResponse<Reservasi>> {
  const res = await apiClient.patch<ApiResponse<Reservasi>>(
    `/api/reservasi/${id}/cancel`
  );
  return res.data;
}