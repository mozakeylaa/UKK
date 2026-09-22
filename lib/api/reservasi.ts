import apiClient from "@/lib/api/client";
import { type ApiResponse, isApiSuccess } from "@/lib/types/api";
import type {
  Reservasi,
  CreateReservasiPayload,
  HistoryResponse,
  ETicket,
} from "@/lib/types/reservasi";
import { normalizeReservasi, normalizeETicket } from "@/lib/api/reservasi-helper";

export async function createReservasi(
  payload: CreateReservasiPayload
): Promise<ApiResponse<Reservasi>> {
  const res = await apiClient.post<ApiResponse<Reservasi>>(
    "/api/reservasi",
    payload
  );
  if (isApiSuccess(res.data) && res.data.data) {
    return {
      ...res.data,
      data: normalizeReservasi(res.data.data),
    };
  }
  return res.data;
}

export async function getReservasiById(
  id: number
): Promise<ApiResponse<Reservasi>> {
  const res = await apiClient.get<ApiResponse<Reservasi>>(
    `/api/reservasi/${id}`
  );
  if (isApiSuccess(res.data) && res.data.data) {
    return {
      ...res.data,
      data: normalizeReservasi(res.data.data),
    };
  }
  return res.data;
}

export async function getMyReservasi(): Promise<ApiResponse<Reservasi[]>> {
  const res = await apiClient.get<ApiResponse<Reservasi[]>>(
    "/api/reservasi/my"
  );
  if (isApiSuccess(res.data) && Array.isArray(res.data.data)) {
    return {
      ...res.data,
      data: res.data.data.map(normalizeReservasi),
    };
  }
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
  if (isApiSuccess(res.data) && res.data.data && Array.isArray(res.data.data.items)) {
    return {
      ...res.data,
      data: {
        ...res.data.data,
        items: res.data.data.items.map(normalizeReservasi),
      },
    };
  }
  return res.data;
}

export async function getETicket(id: number): Promise<ApiResponse<ETicket>> {
  try {
    const res = await apiClient.get<ApiResponse<any>>(
      `/api/reservasi/${id}/e-ticket`
    );
    if (isApiSuccess(res.data) && res.data.data) {
      return {
        ...res.data,
        data: normalizeETicket(res.data.data, id),
      };
    }
  } catch {
    // Fallback if e-ticket endpoint errors
  }

  // Resilient fallback: ambil langsung dari detail reservasi
  const resDetail = await getReservasiById(id);
  if (isApiSuccess(resDetail) && resDetail.data) {
    return {
      ...resDetail,
      data: normalizeETicket(resDetail.data, id),
    };
  }

  return {
    status: false,
    statusCode: 404,
    message: "Data E-Ticket tidak ditemukan",
  };
}

export async function cancelReservasi(
  id: number
): Promise<ApiResponse<Reservasi>> {
  const res = await apiClient.patch<ApiResponse<Reservasi>>(
    `/api/reservasi/${id}/cancel`
  );
  if (isApiSuccess(res.data) && res.data.data) {
    return {
      ...res.data,
      data: normalizeReservasi(res.data.data),
    };
  }
  return res.data;
}