import apiClient from "@/lib/api/client";
import type { ApiResponse } from "@/lib/types/api";
import type { AdminSpace, CreateSpacePayload, UpdateSpacePayload } from "@/lib/types/admin";
import {
  getStoredSpacePhoto,
  setStoredSpacePhoto,
  removeStoredSpacePhoto,
  getImageUrl,
} from "@/lib/utils/format";

function normalizeAdminSpace(s: AdminSpace): AdminSpace {
  if (!s) return s;
  const stored = getStoredSpacePhoto(s.id);
  const foto = s.foto || stored || null;
  return {
    ...s,
    foto,
    foto_url: s.foto_url || (foto ? getImageUrl(foto, "spaces") : null),
  };
}

export async function getAdminSpaces(): Promise<ApiResponse<AdminSpace[]>> {
  const res = await apiClient.get<ApiResponse<AdminSpace[]>>("/api/admin/spaces");
  if (res.data && res.data.status && Array.isArray(res.data.data)) {
    return {
      ...res.data,
      data: res.data.data.map(normalizeAdminSpace),
    };
  }
  return res.data;
}

export async function getAdminSpaceById(id: number): Promise<ApiResponse<AdminSpace>> {
  const res = await apiClient.get<ApiResponse<AdminSpace>>(`/api/admin/spaces/${id}`);
  if (res.data && res.data.status && res.data.data) {
    return {
      ...res.data,
      data: normalizeAdminSpace(res.data.data),
    };
  }
  return res.data;
}

export async function createAdminSpace(payload: CreateSpacePayload): Promise<ApiResponse<AdminSpace>> {
  const res = await apiClient.post<ApiResponse<AdminSpace>>("/api/admin/spaces", payload);
  if (res.data && res.data.status && res.data.data) {
    if (payload.foto && res.data.data.id) {
      setStoredSpacePhoto(res.data.data.id, payload.foto);
    }
    return {
      ...res.data,
      data: normalizeAdminSpace(res.data.data),
    };
  }
  return res.data;
}

export async function updateAdminSpace(id: number, payload: UpdateSpacePayload): Promise<ApiResponse<AdminSpace>> {
  const res = await apiClient.put<ApiResponse<AdminSpace>>(`/api/admin/spaces/${id}`, payload);
  if (res.data && res.data.status) {
    if (payload.foto) {
      setStoredSpacePhoto(id, payload.foto);
    }
    if (res.data.data) {
      return {
        ...res.data,
        data: normalizeAdminSpace(res.data.data),
      };
    }
  }
  return res.data;
}

export async function deleteAdminSpace(id: number): Promise<ApiResponse<null>> {
  removeStoredSpacePhoto(id);
  const res = await apiClient.delete<ApiResponse<null>>(`/api/admin/spaces/${id}`);
  return res.data;
}