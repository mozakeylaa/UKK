import apiClient from "@/lib/api/client";
import type { ApiResponse } from "@/lib/types/api";
import type { AdminSpace, CreateSpacePayload, UpdateSpacePayload } from "@/lib/types/admin";

export async function getAdminSpaces(): Promise<ApiResponse<AdminSpace[]>> {
  const res = await apiClient.get<ApiResponse<AdminSpace[]>>("/api/admin/spaces");
  return res.data;
}

export async function getAdminSpaceById(id: number): Promise<ApiResponse<AdminSpace>> {
  const res = await apiClient.get<ApiResponse<AdminSpace>>(`/api/admin/spaces/${id}`);
  return res.data;
}

export async function createAdminSpace(payload: CreateSpacePayload): Promise<ApiResponse<AdminSpace>> {
  const res = await apiClient.post<ApiResponse<AdminSpace>>("/api/admin/spaces", payload);
  return res.data;
}

export async function updateAdminSpace(id: number, payload: UpdateSpacePayload): Promise<ApiResponse<AdminSpace>> {
  const res = await apiClient.put<ApiResponse<AdminSpace>>(`/api/admin/spaces/${id}`, payload);
  return res.data;
}

export async function deleteAdminSpace(id: number): Promise<ApiResponse<null>> {
  const res = await apiClient.delete<ApiResponse<null>>(`/api/admin/spaces/${id}`);
  return res.data;
}