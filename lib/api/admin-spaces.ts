import axios from "axios";
import apiClient from "@/lib/api/client";
import type { ApiResponse } from "@/lib/types/api";
import type { AdminSpace, CreateSpacePayload, UpdateSpacePayload } from "@/lib/types/admin";
import {
  getStoredSpacePhoto,
  setStoredSpacePhoto,
  removeStoredSpacePhoto,
  getImageUrl,
} from "@/lib/utils/format";
import {
  BASE_URL,
  getMasterAdminToken,
  isCurrentAdminMaster,
  getMasterAdminHeaders,
} from "@/lib/api/admin-bridge";

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
  // 1. Ambil data space dari sesi admin yang sedang login
  const userRes = await apiClient
    .get<ApiResponse<AdminSpace[]>>("/api/admin/spaces")
    .catch((e) => e.response);

  // Jika akun adalah admin_moklet (master), kembalikan langsung
  if (isCurrentAdminMaster()) {
    if (userRes?.data && userRes.data.status && Array.isArray(userRes.data.data)) {
      return {
        ...userRes.data,
        data: (userRes.data.data as AdminSpace[])
          .map(normalizeAdminSpace)
          .sort((a: AdminSpace, b: AdminSpace) => b.id - a.id),
      };
    }
    return userRes?.data || { status: false, message: "Gagal memuat space" };
  }

  // 2. Jika akun adalah admin baru yang mendaftar:
  // Gabungkan space master Moklet Hub dengan space baru yang dibuat oleh admin ini
  const masterToken = await getMasterAdminToken();
  let masterSpaces: AdminSpace[] = [];

  if (masterToken) {
    try {
      const mRes = await axios.get<ApiResponse<AdminSpace[]>>(
        `${BASE_URL}/api/admin/spaces`,
        { headers: getMasterAdminHeaders(masterToken) }
      );
      if (mRes.data?.status && Array.isArray(mRes.data?.data)) {
        masterSpaces = mRes.data.data;
      }
    } catch {
      // Abaikan jika offline / master gagal
    }
  }

  const userSpaces: AdminSpace[] =
    userRes?.data?.status && Array.isArray(userRes.data.data)
      ? userRes.data.data
      : [];

  const spaceMap = new Map<number, AdminSpace>();
  for (const s of masterSpaces) {
    spaceMap.set(s.id, s);
  }
  for (const s of userSpaces) {
    spaceMap.set(s.id, s);
  }

  const combined = Array.from(spaceMap.values())
    .map(normalizeAdminSpace)
    .sort((a, b) => b.id - a.id);

  return {
    status: true,
    message: "Berhasil memproses permintaan",
    data: combined,
  };
}

export async function getAdminSpaceById(id: number): Promise<ApiResponse<AdminSpace>> {
  const userRes = await apiClient
    .get<ApiResponse<AdminSpace>>(`/api/admin/spaces/${id}`)
    .catch((e) => e.response);

  if (userRes?.data && userRes.data.status && userRes.data.data) {
    return {
      ...userRes.data,
      data: normalizeAdminSpace(userRes.data.data),
    };
  }

  // Fallback ke token master jika space terdaftar di bawah master owner (Moklet Hub)
  const masterToken = await getMasterAdminToken();
  if (masterToken) {
    try {
      const mRes = await axios.get<ApiResponse<AdminSpace>>(
        `${BASE_URL}/api/admin/spaces/${id}`,
        { headers: getMasterAdminHeaders(masterToken) }
      );
      if (mRes.data?.status && mRes.data?.data) {
        return {
          ...mRes.data,
          data: normalizeAdminSpace(mRes.data.data),
        };
      }
    } catch {
      // Abaikan
    }
  }

  return userRes?.data || { status: false, message: "Space tidak ditemukan" };
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
  const userRes = await apiClient
    .put<ApiResponse<AdminSpace>>(`/api/admin/spaces/${id}`, payload)
    .catch((e) => e.response);

  if (userRes?.data && userRes.data.status) {
    if (payload.foto) {
      setStoredSpacePhoto(id, payload.foto);
    }
    if (userRes.data.data) {
      return {
        ...userRes.data,
        data: normalizeAdminSpace(userRes.data.data),
      };
    }
    return userRes.data;
  }

  // Jika gagal 404 (karena space milik master Moklet Hub), perbarui via master bridge token
  const masterToken = await getMasterAdminToken();
  if (masterToken) {
    try {
      const mRes = await axios.put<ApiResponse<AdminSpace>>(
        `${BASE_URL}/api/admin/spaces/${id}`,
        payload,
        { headers: getMasterAdminHeaders(masterToken) }
      );
      if (mRes.data?.status) {
        if (payload.foto) {
          setStoredSpacePhoto(id, payload.foto);
        }
        if (mRes.data.data) {
          return {
            ...mRes.data,
            data: normalizeAdminSpace(mRes.data.data),
          };
        }
        return mRes.data;
      }
    } catch {
      // Abaikan
    }
  }

  return userRes?.data || { status: false, message: "Gagal memperbarui space" };
}

export async function deleteAdminSpace(id: number): Promise<ApiResponse<null>> {
  removeStoredSpacePhoto(id);

  const userRes = await apiClient
    .delete<ApiResponse<null>>(`/api/admin/spaces/${id}`)
    .catch((e) => e.response);

  if (userRes?.data && userRes.data.status) {
    return userRes.data;
  }

  // Fallback via master bridge token jika space milik master Moklet Hub
  const masterToken = await getMasterAdminToken();
  if (masterToken) {
    try {
      const mRes = await axios.delete<ApiResponse<null>>(
        `${BASE_URL}/api/admin/spaces/${id}`,
        { headers: getMasterAdminHeaders(masterToken) }
      );
      if (mRes.data?.status) {
        return mRes.data;
      }
    } catch {
      // Abaikan
    }
  }

  return userRes?.data || { status: false, message: "Gagal menghapus space" };
}