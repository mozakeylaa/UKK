"use client";

import { useState, FormEvent, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { login } from "@/lib/api/auth";
import { isApiSuccess } from "@/lib/types/api";
import { useAuth } from "@/lib/context/AuthContext";
import type { Role } from "@/lib/types/auth";
import RoleSelector from "@/components/auth/RoleSelector";
import AuthCardHeader from "@/components/auth/AuthCardHeader";
import LoginFormFields from "@/components/auth/LoginFormFields";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loginSuccess } = useAuth();

  const [selectedRole, setSelectedRole] = useState<Role>("member");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const registered = searchParams.get("registered");

  function validate(): boolean {
    const newErrors: { username?: string; password?: string } = {};
    if (!username.trim()) newErrors.username = "Username wajib diisi";
    if (!password) newErrors.password = "Password wajib diisi";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setServerError(null);
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const res = await login({ username, password });

      if (isApiSuccess(res)) {
        if (res.data.role !== selectedRole) {
          setServerError(
            selectedRole === "member"
              ? "Akun ini terdaftar sebagai Admin Space, bukan Member. Silakan pilih tab \"Admin Space\"."
              : "Akun ini terdaftar sebagai Member, bukan Admin Space. Silakan pilih tab \"Member\"."
          );
          setIsSubmitting(false);
          return;
        }

        loginSuccess(res.data);
        if (res.data.role === "member") {
          router.push("/member/dashboard");
        } else {
          router.push("/admin/dashboard");
        }
      } else {
        setServerError(res.message);
      }
    } catch {
      setServerError("Terjadi kendala saat menghubungkan ke server. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-navy-gradient px-4 py-12">
      {/* Background Ambient Glows */}
      <div className="pointer-events-none absolute -right-16 -top-20 h-80 w-80 rounded-full bg-[#8494FF]/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-10 h-72 w-72 rounded-full bg-[#FF8FC2]/20 blur-3xl" />

      <div
        className="relative w-full max-w-md opacity-0"
        style={{ animation: "fadeUp 0.6s ease 0.05s forwards" }}
      >
        {/* Brand Logo Header */}
        <div className="mb-6 flex flex-col items-center text-center">
          <Link href="/" className="group flex items-center gap-2.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FF8FC2] to-[#FF5DA2] font-display text-base font-bold text-white shadow-lg shadow-[#FF5DA2]/30 transition-transform group-hover:scale-105">
              CW
            </div>
            <span className="font-display text-xl font-bold text-white tracking-wide">
              Co-Work <span className="text-xs font-normal text-slate-300">space</span>
            </span>
          </Link>
        </div>

        {/* Card Container */}
        <div className="rounded-3xl bg-white/95 p-6 sm:p-8 backdrop-blur-xl border border-white/20 shadow-2xl shadow-slate-950/20">
          <AuthCardHeader
            title="Selamat Datang Kembali"
            subtitle="Masuk sebagai member atau pengelola space."
          />

          {registered && (
            <div className="mt-4 flex items-center gap-2 rounded-2xl bg-[#EEEFFF] border border-[#C9BEFF] px-4 py-2.5 text-xs font-semibold text-[#6367FF]">
              <Sparkles size={15} className="shrink-0" />
              <span>Akun berhasil didaftarkan! Silakan masuk dengan akun barumu.</span>
            </div>
          )}

          <div className="mt-5">
            <RoleSelector
              selectedRole={selectedRole}
              onSelectRole={(role) => {
                setSelectedRole(role);
                setServerError(null);
              }}
            />
          </div>

          <div className="mt-5">
            <LoginFormFields
              username={username}
              password={password}
              errors={errors}
              serverError={serverError}
              isSubmitting={isSubmitting}
              onChangeUsername={setUsername}
              onChangePassword={setPassword}
              onSubmit={handleSubmit}
            />
          </div>

          {/* Switch Register Links */}
          <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col gap-1 text-center text-xs text-slate-500">
            {selectedRole === "member" ? (
              <p>
                Belum punya akun member?{" "}
                <Link
                  href="/register/member"
                  className="font-bold text-[#6367FF] hover:text-[#4A4FE0] hover:underline ml-1"
                >
                  Daftar di sini
                </Link>
              </p>
            ) : (
              <p>
                Belum punya akun pengelola space?{" "}
                <Link
                  href="/register/admin"
                  className="font-bold text-[#6367FF] hover:text-[#4A4FE0] hover:underline ml-1"
                >
                  Daftar pengelola
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}