"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { AUTH_TOKEN_KEY, AUTH_ROLE_KEY, AUTH_USER_KEY } from "@/lib/api/client";
import type { LoginData, Role } from "@/lib/types/auth";

type AuthUser = {
  id: number;
  username: string;
  role: Role;
  nama: string; // nama_member atau nama_pemilik, buat ditampilin di navbar
  foto?: string | null; // URL atau path foto profil pengguna
};

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  loginSuccess: (data: LoginData) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const raw = Cookies.get(AUTH_USER_KEY);
    if (raw) {
      try {
        setUser(JSON.parse(raw));
      } catch {
        setUser(null);
      }
    }
    setIsLoading(false);
  }, []);

  function loginSuccess(data: LoginData) {
    const nama =
      data.role === "member"
        ? data.member?.nama_member ?? data.username
        : data.space_owner?.nama_pemilik ?? data.username;

    // Ambil foto profil dari member atau space_owner (cek foto_url, foto_profil, atau foto)
    const foto =
      data.role === "member"
        ? data.member?.foto_url || data.member?.foto_profil || data.member?.foto || null
        : data.space_owner?.foto_url || data.space_owner?.foto_profil || data.space_owner?.foto || null;

    const authUser: AuthUser = {
      id: data.id,
      username: data.username,
      role: data.role,
      nama,
      foto,
    };

    Cookies.set(AUTH_TOKEN_KEY, data.access_token, { expires: 7 });
    Cookies.set(AUTH_ROLE_KEY, data.role, { expires: 7 });
    Cookies.set(AUTH_USER_KEY, JSON.stringify(authUser), { expires: 7 });

    setUser(authUser);
  }

  function logout() {
    Cookies.remove(AUTH_TOKEN_KEY);
    Cookies.remove(AUTH_ROLE_KEY);
    Cookies.remove(AUTH_USER_KEY);
    setUser(null);
    router.push("/login");
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, loginSuccess, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth harus dipakai di dalam AuthProvider");
  return ctx;
}