import apiClient from "@/lib/api/client";
import type { ApiResponse } from "@/lib/types/api";
import type {
  Space,
  SpaceType,
  AvailabilityQuery,
  AvailabilityResult,
} from "@/lib/types/space";

export async function getSpaceTypes(): Promise<ApiResponse<SpaceType[]>> {
  const res = await apiClient.get<ApiResponse<SpaceType[]>>(
    "/api/spaces/types"
  );
  return res.data;
}

export type GetSpacesParams = {
  tipe?: string;
  search?: string;
};

export async function getSpaces(
  params?: GetSpacesParams
): Promise<ApiResponse<Space[]>> {
  const res = await apiClient.get<ApiResponse<Space[]>>("/api/spaces", {
    params,
  });
  return res.data;
}

export async function getSpaceById(id: number): Promise<ApiResponse<Space>> {
  const res = await apiClient.get<ApiResponse<Space>>(`/api/spaces/${id}`);
  return res.data;
}

export async function checkAvailability(
  query: AvailabilityQuery
): Promise<ApiResponse<AvailabilityResult>> {
  const res = await apiClient.get<ApiResponse<AvailabilityResult>>(
    "/api/spaces/availability",
    { params: query }
  );
  return res.data;
}