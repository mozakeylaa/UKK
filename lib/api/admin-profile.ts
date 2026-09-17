import apiClient from "@/lib/api/client";
import type { ApiResponse } from "@/lib/types/api";
import type { AdminProfile, UpdateProfilePayload } from "@/lib/types/admin";

export async function getAdminProfile(): Promise<ApiResponse<AdminProfile>> {
  const res = await apiClient.get<ApiResponse<AdminProfile>>(
    "/api/admin/profile"
  );
  return res.data;
}

export async function updateAdminProfile(
  payload: UpdateProfilePayload
): Promise<ApiResponse<AdminProfile>> {
  const res = await apiClient.put<ApiResponse<AdminProfile>>(
    "/api/admin/profile",
    payload
  );
  return res.data;
}