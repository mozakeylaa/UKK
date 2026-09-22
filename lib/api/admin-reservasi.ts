import axios from "axios";
import apiClient from "@/lib/api/client";
import type { ApiResponse } from "@/lib/types/api";
import type {
  Reservasi,
  AdminReservasiFilter,
} from "@/lib/types/reservasi";
import type { ReservasiStatus } from "@/components/ui/Badge";
import { normalizeReservasi } from "@/lib/api/reservasi-helper";
import { isApiSuccess } from "@/lib/types/api";
import {
  BASE_URL,
  getMasterAdminToken,
  isCurrentAdminMaster,
  getMasterAdminHeaders,
} from "@/lib/api/admin-bridge";

function cleanAdminFilter(filter?: AdminReservasiFilter): Record<string, unknown> | undefined {
  if (!filter) return undefined;
  const cleaned: Record<string, unknown> = {};
  if (filter.month !== undefined && filter.month !== null && Number(filter.month) > 0) {
    cleaned.month = Number(filter.month);
  }
  if (filter.year !== undefined && filter.year !== null && Number(filter.year) > 0) {
    cleaned.year = Number(filter.year);
  }
  if (filter.status && typeof filter.status === "string" && filter.status.trim() !== "") {
    cleaned.status = filter.status.trim();
  }
  if (filter.id_space !== undefined && filter.id_space !== null && Number(filter.id_space) > 0) {
    cleaned.id_space = Number(filter.id_space);
  }
  if (filter.tanggal && typeof filter.tanggal === "string" && filter.tanggal.trim() !== "") {
    cleaned.tanggal = filter.tanggal.trim();
  }
  return Object.keys(cleaned).length > 0 ? cleaned : undefined;
}

export async function getAdminReservasiList(
  filter?: AdminReservasiFilter
): Promise<ApiResponse<Reservasi[]>> {
  const cleanedParams = cleanAdminFilter(filter);

  // 1. Ambil data reservasi dari sesi admin yang sedang login
  const userRes = await apiClient
    .get<ApiResponse<Reservasi[]>>("/api/admin/reservasi", {
      params: {
        ...cleanedParams,
        _t: Date.now(),
      },
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
      },
    })
    .catch((e) => e.response);

  // Jika akun adalah admin_moklet (master), kembalikan langsung
  if (isCurrentAdminMaster()) {
    if (userRes?.data && isApiSuccess(userRes.data) && Array.isArray(userRes.data.data)) {
      return {
        ...userRes.data,
        data: (userRes.data.data as Reservasi[])
          .map(normalizeReservasi)
          .sort((a: Reservasi, b: Reservasi) => b.id - a.id),
      };
    }
    return userRes?.data || { status: false, message: "Gagal memuat reservasi" };
  }

  // 2. Jika akun adalah admin baru yang mendaftar:
  // Gabungkan reservasi Moklet Hub dengan reservasi pada space admin ini
  const masterToken = await getMasterAdminToken();
  let masterReservasi: Reservasi[] = [];

  if (masterToken) {
    try {
      const mRes = await axios.get<ApiResponse<Reservasi[]>>(
        `${BASE_URL}/api/admin/reservasi`,
        {
          params: {
            ...cleanedParams,
            _t: Date.now(),
          },
          headers: getMasterAdminHeaders(masterToken),
        }
      );
      if (mRes.data?.status && Array.isArray(mRes.data?.data)) {
        masterReservasi = mRes.data.data;
      }
    } catch {
      // Abaikan jika master gagal
    }
  }

  const userReservasi: Reservasi[] =
    userRes?.data?.status && Array.isArray(userRes.data.data)
      ? userRes.data.data
      : [];

  const resMap = new Map<number, Reservasi>();
  for (const r of masterReservasi) {
    resMap.set(r.id, r);
  }
  for (const r of userReservasi) {
    resMap.set(r.id, r);
  }

  const combined = Array.from(resMap.values())
    .map(normalizeReservasi)
    .sort((a, b) => b.id - a.id);

  return {
    status: true,
    message: "Berhasil memproses permintaan",
    data: combined,
  };
}

export async function updateReservasiStatus(
  id: number,
  status: ReservasiStatus
): Promise<ApiResponse<Reservasi>> {
  const userRes = await apiClient
    .patch<ApiResponse<Reservasi>>(`/api/admin/reservasi/${id}/status`, { status })
    .catch((e) => e.response);

  if (userRes?.data && isApiSuccess(userRes.data) && userRes.data.data) {
    return {
      ...userRes.data,
      data: normalizeReservasi(userRes.data.data),
    };
  }

  // Jika gagal 404 (karena reservasi berada pada space milik master Moklet Hub), mutasikan via master bridge token
  const masterToken = await getMasterAdminToken();
  if (masterToken) {
    try {
      const mRes = await axios.patch<ApiResponse<Reservasi>>(
        `${BASE_URL}/api/admin/reservasi/${id}/status`,
        { status },
        { headers: getMasterAdminHeaders(masterToken) }
      );
      if (mRes.data?.status && mRes.data?.data) {
        return {
          ...mRes.data,
          data: normalizeReservasi(mRes.data.data),
        };
      }
    } catch {
      // Abaikan
    }
  }

  return userRes?.data || { status: false, message: "Gagal memperbarui status reservasi" };
}

export async function checkInReservasi(id: number): Promise<ApiResponse<Reservasi>> {
  const userRes = await apiClient
    .post<ApiResponse<Reservasi>>(`/api/admin/reservasi/${id}/check-in`)
    .catch((e) => e.response);

  if (userRes?.data && isApiSuccess(userRes.data) && userRes.data.data) {
    return {
      ...userRes.data,
      data: normalizeReservasi(userRes.data.data),
    };
  }

  // Fallback via master bridge token
  const masterToken = await getMasterAdminToken();
  if (masterToken) {
    try {
      const mRes = await axios.post<ApiResponse<Reservasi>>(
        `${BASE_URL}/api/admin/reservasi/${id}/check-in`,
        {},
        { headers: getMasterAdminHeaders(masterToken) }
      );
      if (mRes.data?.status && mRes.data?.data) {
        return {
          ...mRes.data,
          data: normalizeReservasi(mRes.data.data),
        };
      }
    } catch {
      // Abaikan
    }
  }

  return userRes?.data || { status: false, message: "Gagal memproses check-in" };
}

export async function checkOutReservasi(id: number): Promise<ApiResponse<Reservasi>> {
  const userRes = await apiClient
    .post<ApiResponse<Reservasi>>(`/api/admin/reservasi/${id}/check-out`)
    .catch((e) => e.response);

  if (userRes?.data && isApiSuccess(userRes.data) && userRes.data.data) {
    return {
      ...userRes.data,
      data: normalizeReservasi(userRes.data.data),
    };
  }

  // Fallback via master bridge token
  const masterToken = await getMasterAdminToken();
  if (masterToken) {
    try {
      const mRes = await axios.post<ApiResponse<Reservasi>>(
        `${BASE_URL}/api/admin/reservasi/${id}/check-out`,
        {},
        { headers: getMasterAdminHeaders(masterToken) }
      );
      if (mRes.data?.status && mRes.data?.data) {
        return {
          ...mRes.data,
          data: normalizeReservasi(mRes.data.data),
        };
      }
    } catch {
      // Abaikan
    }
  }

  return userRes?.data || { status: false, message: "Gagal memproses check-out" };
}