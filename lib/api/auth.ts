import apiClient from "@/lib/api/client";
import type { ApiResponse } from "@/lib/types/api";
import type {
  LoginData,
  LoginPayload,
  RegisterMemberPayload,
  RegisterAdminPayload,
  MemberProfile,
  SpaceOwnerProfile,
  ProfileData,
} from "@/lib/types/auth";

import { getStoredMemberAvatar, setStoredMemberAvatar, getImageUrl } from "@/lib/utils/format";

export type {
  LoginData,
  LoginPayload,
  RegisterMemberPayload,
  RegisterAdminPayload,
  MemberProfile,
  SpaceOwnerProfile,
  ProfileData,
};

export async function registerMember(
  payload: RegisterMemberPayload
): Promise<ApiResponse<MemberProfile>> {
  const res = await apiClient.post<ApiResponse<MemberProfile>>(
    "/api/auth/register/member",
    payload
  );
  return res.data;
}

export async function registerAdminSpace(
  payload: RegisterAdminPayload
): Promise<ApiResponse<SpaceOwnerProfile>> {
  const res = await apiClient.post<ApiResponse<SpaceOwnerProfile>>(
    "/api/auth/register/admin-space",
    payload
  );
  return res.data;
}

export async function login(
  payload: LoginPayload
): Promise<ApiResponse<LoginData>> {
  const res = await apiClient.post<ApiResponse<LoginData>>(
    "/api/auth/login",
    payload
  );
  return res.data;
}

export async function getProfile(): Promise<ApiResponse<ProfileData>> {
  const res = await apiClient.get<ApiResponse<ProfileData>>(
    "/api/auth/profile"
  );
  if (res.data && res.data.status && res.data.data?.member) {
    const member = res.data.data.member;
    const stored = getStoredMemberAvatar(member.id);
    const foto = member.foto || stored || null;
    member.foto = foto || undefined;
    if (!member.foto_url && foto) {
      member.foto_url = getImageUrl(foto, "members") || undefined;
    }
  }
  return res.data;
}

export interface UpdateMemberProfilePayload {
  nama_member: string;
  instansi?: string;
  alamat: string;
  telp: string;
  foto?: string;
}

export async function updateMemberProfile(
  payload: UpdateMemberProfilePayload
): Promise<ApiResponse<MemberProfile>> {
  try {
    const res = await fetch("/api/member/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const data: ApiResponse<MemberProfile> = await res.json();
    if (data && "data" in data && data.data && payload.foto) {
      const memberId = data.data.id;
      if (memberId) {
        setStoredMemberAvatar(memberId, payload.foto);
      }
    }
    return data;
  } catch (err: any) {
    try {
      const fallbackRes = await apiClient.post<ApiResponse<MemberProfile>>(
        "/api/member/profile",
        payload
      );
      return fallbackRes.data;
    } catch {
      throw err;
    }
  }
}
