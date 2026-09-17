import apiClient from "@/lib/api/client";
import type { ApiResponse } from "@/lib/types/api";
import type {
  Diskon,
  CreateDiskonPayload,
  UpdateDiskonPayload,
} from "@/lib/types/reservasi";

export async function getAdminDiskon(): Promise<ApiResponse<Diskon[]>> {
  const res = await apiClient.get<ApiResponse<Diskon[]>>("/api/admin/diskon");
  return res.data;
}

export async function getAdminDiskonDetail(
  id: number
): Promise<ApiResponse<Diskon>> {
  const res = await apiClient.get<ApiResponse<Diskon>>(
    `/api/admin/diskon/${id}`
  );
  return res.data;
}

export async function createAdminDiskon(
  payload: CreateDiskonPayload
): Promise<ApiResponse<Diskon>> {
  const res = await apiClient.post<ApiResponse<Diskon>>(
    "/api/admin/diskon",
    payload
  );
  return res.data;
}

export async function updateAdminDiskon(
  id: number,
  payload: UpdateDiskonPayload
): Promise<ApiResponse<Diskon>> {
  const res = await apiClient.put<ApiResponse<Diskon>>(
    `/api/admin/diskon/${id}`,
    payload
  );
  return res.data;
}

export async function deleteAdminDiskon(id: number): Promise<ApiResponse<null>> {
  const res = await apiClient.delete<ApiResponse<null>>(
    `/api/admin/diskon/${id}`
  );
  return res.data;
}