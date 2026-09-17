import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import Cookies from "js-cookie";
import type { ApiResponse } from "@/lib/types/api";

export const AUTH_TOKEN_KEY = "coworking_access_token";
export const AUTH_ROLE_KEY = "coworking_role";
export const AUTH_USER_KEY = "coworking_user";

const apiClient = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    "https://learn.smktelkom-mlg.sch.id/coworking",
  headers: {
    Accept: "application/json",
  },
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const makerKey = process.env.NEXT_PUBLIC_MAKER_KEY;
  if (makerKey) {
    config.headers.set("x-maker-key", makerKey);
  }

  const token = Cookies.get(AUTH_TOKEN_KEY);
  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }

  return config;
});

function clearAuthAndRedirect() {
  Cookies.remove(AUTH_TOKEN_KEY);
  Cookies.remove(AUTH_ROLE_KEY);
  Cookies.remove(AUTH_USER_KEY);

  if (typeof window !== "undefined" && window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
}

apiClient.interceptors.response.use(
  (response) => {
    const data = response.data as ApiResponse<unknown>;
    if (data && data.status === false && response.status === 401) {
      clearAuthAndRedirect();
    }
    return response;
  },
  (error: AxiosError<ApiResponse<unknown>>) => {
    if (error.response?.status === 401) {
      clearAuthAndRedirect();
    }
    if (error.response?.data) {
      return Promise.resolve(error.response);
    }
    return Promise.reject(error);
  }
);

export default apiClient;