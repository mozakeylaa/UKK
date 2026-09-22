import axios from "axios";
import Cookies from "js-cookie";
import { AUTH_USER_KEY } from "@/lib/api/client";

const BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "https://learn.smktelkom-mlg.sch.id/coworking"
).replace(/\/+$/, "");

const MAKER_KEY =
  process.env.NEXT_PUBLIC_MAKER_KEY ??
  "mk_e33effe6e2a245c1bec5bd460b077284";

export const MASTER_ADMIN_USERNAME =
  process.env.ADMIN_USERNAME ?? "admin_moklet";
export const MASTER_ADMIN_PASSWORD =
  process.env.ADMIN_PASSWORD ?? "Password123!";

let cachedMasterToken: string | null = null;
let tokenExpiryTime: number = 0;

/**
 * Mendapatkan token autentikasi admin master (admin_moklet).
 * Berfungsi sebagai administrative bridge agar akun admin baru
 * dapat mengelola reservasi, space, dan laporan Moklet Hub secara seamless.
 */
export async function getMasterAdminToken(): Promise<string | null> {
  if (cachedMasterToken && Date.now() < tokenExpiryTime - 300000) {
    return cachedMasterToken;
  }

  try {
    const res = await axios.post(
      `${BASE_URL}/api/auth/login`,
      {
        username: MASTER_ADMIN_USERNAME,
        password: MASTER_ADMIN_PASSWORD,
      },
      {
        headers: {
          "x-maker-key": MAKER_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    if (res.data?.status && res.data?.data?.access_token) {
      cachedMasterToken = res.data.data.access_token;
      tokenExpiryTime = Date.now() + 24 * 60 * 60 * 1000;
      return cachedMasterToken;
    }
  } catch (err) {
    console.error("[AdminBridge] Gagal memperoleh token admin master:", err);
  }

  return cachedMasterToken;
}

/**
 * Cek apakah admin yang sedang login adalah akun master bawaan (admin_moklet).
 */
export function isCurrentAdminMaster(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = Cookies.get(AUTH_USER_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.username === MASTER_ADMIN_USERNAME) {
        return true;
      }
    }
  } catch {
    // ignore
  }
  return false;
}

export function getMasterAdminHeaders(masterToken: string) {
  return {
    "x-maker-key": MAKER_KEY,
    Authorization: `Bearer ${masterToken}`,
    "Content-Type": "application/json",
  };
}

export { BASE_URL, MAKER_KEY };
