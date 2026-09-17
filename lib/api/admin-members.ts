import apiClient from "@/lib/api/client";
import type { ApiResponse } from "@/lib/types/api";
import type {
  Member,
  CreateMemberPayload,
  UpdateMemberPayload,
} from "@/lib/types/member";

export async function getAdminMembers(
  search?: string
): Promise<ApiResponse<Member[]>> {
  const res = await apiClient.get<ApiResponse<Member[]>>(
    "/api/admin/members",
    { params: search ? { search } : undefined }
  );
  return res.data;
}

export async function getAdminMemberDetail(
  id: number
): Promise<ApiResponse<Member>> {
  const res = await apiClient.get<ApiResponse<Member>>(
    `/api/admin/members/${id}`
  );
  return res.data;
}

export async function createAdminMember(
  payload: CreateMemberPayload
): Promise<ApiResponse<Member>> {
  const res = await apiClient.post<ApiResponse<Member>>(
    "/api/admin/members",
    payload
  );
  return res.data;
}

export async function updateAdminMember(
  id: number,
  payload: UpdateMemberPayload
): Promise<ApiResponse<Member>> {
  const res = await apiClient.put<ApiResponse<Member>>(
    `/api/admin/members/${id}`,
    payload
  );
  return res.data;
}

export async function deleteAdminMember(id: number): Promise<ApiResponse<null>> {
  const res = await apiClient.delete<ApiResponse<null>>(
    `/api/admin/members/${id}`
  );
  return res.data;
}