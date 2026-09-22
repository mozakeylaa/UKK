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
  const res = await fetch("/api/member/profile", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  return res.json();
}
