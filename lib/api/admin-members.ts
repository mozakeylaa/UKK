import apiClient from "@/lib/api/client";
import type { ApiResponse } from "@/lib/types/api";
import type {
  Member,
  CreateMemberPayload,
  UpdateMemberPayload,
} from "@/lib/types/member";
import {
  getStoredMemberAvatar,
  setStoredMemberAvatar,
  removeStoredMemberAvatar,
  getImageUrl,
} from "@/lib/utils/format";

function normalizeAdminMember(m: Member): Member {
  if (!m) return m;
  const stored = getStoredMemberAvatar(m.id);
  const foto = m.foto || stored || null;
  return {
    ...m,
    foto,
    foto_url: m.foto_url || (foto ? getImageUrl(foto, "members") : null),
  };
}

export async function getAdminMembers(
  search?: string
): Promise<ApiResponse<Member[]>> {
  const res = await apiClient.get<ApiResponse<Member[]>>(
    "/api/admin/members",
    { params: search ? { search } : undefined }
  );
  if (res.data && res.data.status && Array.isArray(res.data.data)) {
    return {
      ...res.data,
      data: res.data.data.map(normalizeAdminMember),
    };
  }
  return res.data;
}

export async function getAdminMemberDetail(
  id: number
): Promise<ApiResponse<Member>> {
  const res = await apiClient.get<ApiResponse<Member>>(
    `/api/admin/members/${id}`
  );
  if (res.data && res.data.status && res.data.data) {
    return {
      ...res.data,
      data: normalizeAdminMember(res.data.data),
    };
  }
  return res.data;
}

export async function createAdminMember(
  payload: CreateMemberPayload
): Promise<ApiResponse<Member>> {
  const res = await apiClient.post<ApiResponse<Member>>(
    "/api/admin/members",
    payload
  );
  if (res.data && res.data.status && res.data.data) {
    if (payload.foto && res.data.data.id) {
      setStoredMemberAvatar(res.data.data.id, payload.foto);
    }
    return {
      ...res.data,
      data: normalizeAdminMember(res.data.data),
    };
  }
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
  if (res.data && res.data.status) {
    if (payload.foto) {
      setStoredMemberAvatar(id, payload.foto);
    }
    if (res.data.data) {
      return {
        ...res.data,
        data: normalizeAdminMember(res.data.data),
      };
    }
  }
  return res.data;
}

export async function deleteAdminMember(id: number): Promise<ApiResponse<null>> {
  removeStoredMemberAvatar(id);
  const res = await apiClient.delete<ApiResponse<null>>(
    `/api/admin/members/${id}`
  );
  return res.data;
}