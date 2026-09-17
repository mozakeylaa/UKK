import apiClient from "@/lib/api/client";
import type { ApiResponse } from "@/lib/types/api";
import type { Diskon } from "@/lib/types/reservasi";

export async function getActiveDiskon(): Promise<ApiResponse<Diskon[]>> {
  const res = await apiClient.get<ApiResponse<Diskon[]>>("/api/diskon/active");
  return res.data;
}

export async function checkDiskon(
  nama_diskon: string
): Promise<ApiResponse<Diskon>> {
  const res = await apiClient.post<ApiResponse<Diskon>>("/api/diskon/check", {
    nama_diskon,
  });
  return res.data;
}