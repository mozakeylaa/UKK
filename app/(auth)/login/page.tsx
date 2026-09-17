"use client";

import { useState, FormEvent, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { login } from "@/lib/api/auth";
import { isApiSuccess } from "@/lib/types/api";
import { useAuth } from "@/lib/context/AuthContext";
import type { Role } from "@/lib/types/auth";
import { cn } from "@/lib/utils/cn";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const ROLE_TABS: { label: string; value: Role }[] = [
  { label: "Member", value: "member" },
  { label: "Admin Space", value: "admin_space" },
];

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
              ? "Akun ini terdaftar sebagai Admin Space, bukan Member. Pilih tab \"Admin Space\"."
              : "Akun ini terdaftar sebagai Member, bukan Admin Space. Pilih tab \"Member\"."
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
      setServerError("Terjadi kesalahan. Coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-navy-gradient px-4 py-10">
      <Card className="w-full max-w-md">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-navy-800 font-display text-lg font-bold text-white">
          CW
        </div>

        <h1 className="text-center font-display text-xl font-semibold text-ink-950">
          Selamat Datang Kembali
        </h1>
        <p className="mb-6 mt-1 text-center text-sm text-ink-600">
          Masuk sebagai member atau pengelola space.
        </p>

        {registered && (
          <p className="mb-4 rounded-2xl bg-brand-50 px-3 py-2 text-center text-sm text-brand-700">
            Akun berhasil dibuat, silakan masuk.
          </p>
        )}

        <div className="mb-6 flex rounded-full bg-surface-100 p-1">
          {ROLE_TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => {
                setSelectedRole(tab.value);
                setServerError(null);
              }}
              className={cn(
                "flex-1 rounded-full py-2 text-sm font-medium transition-colors",
                selectedRole === tab.value
                  ? "bg-white text-brand-700 shadow-sm"
                  : "text-ink-600 hover:text-ink-950"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            error={errors.username}
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
          />

          {serverError && <p className="text-sm text-status-cancelled">{serverError}</p>}

          <Button type="submit" isLoading={isSubmitting} className="mt-2 w-full">
            Masuk
          </Button>
        </form>

        <div className="mt-5 flex flex-col gap-1 text-center text-sm text-ink-600">
          {selectedRole === "member" ? (
            <p>
              Belum punya akun member?{" "}
              <Link href="/register/member" className="font-medium text-brand-600 hover:underline">
                Daftar
              </Link>
            </p>
          ) : (
            <p>
              Belum punya akun pengelola space?{" "}
              <Link href="/register/admin" className="font-medium text-brand-600 hover:underline">
                Daftar di sini
              </Link>
            </p>
          )}
        </div>
      </Card>
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