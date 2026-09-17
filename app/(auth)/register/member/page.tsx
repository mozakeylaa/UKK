"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerMember } from "@/lib/api/auth";
import { isApiSuccess } from "@/lib/types/api";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

type FormState = {
  nama_member: string;
  instansi: string;
  alamat: string;
  telp: string;
  username: string;
  password: string;
  confirmPassword: string;
};

const initialState: FormState = {
  nama_member: "",
  instansi: "",
  alamat: "",
  telp: "",
  username: "",
  password: "",
  confirmPassword: "",
};

export default function RegisterMemberPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function validate(): boolean {
    const newErrors: Partial<Record<keyof FormState, string>> = {};

    if (!form.nama_member.trim()) newErrors.nama_member = "Nama lengkap wajib diisi";
    if (!form.alamat.trim()) newErrors.alamat = "Alamat wajib diisi";
    if (!form.telp.trim()) newErrors.telp = "No telp wajib diisi";
    if (!form.username.trim()) newErrors.username = "Username wajib diisi";
    if (!form.password) newErrors.password = "Password wajib diisi";
    else if (form.password.length < 6) newErrors.password = "Password minimal 6 karakter";
    if (form.confirmPassword !== form.password)
      newErrors.confirmPassword = "Konfirmasi password tidak cocok";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setServerError(null);
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const res = await registerMember({
        username: form.username,
        password: form.password,
        kata_sandi: form.password,
        nama_member: form.nama_member,
        instansi: form.instansi || undefined,
        alamat: form.alamat,
        telp: form.telp,
        no_telepon: form.telp,
      });

      if (isApiSuccess(res)) {
        router.push("/login?registered=member");
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
      <Card className="w-full max-w-2xl shadow-xl">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-navy-800 font-display text-lg font-bold text-white shadow-md">
          CW
        </div>

        <h1 className="text-center font-display text-xl font-semibold text-ink-950">
          Daftar Akun Member
        </h1>
        <p className="mb-6 mt-1 text-center text-sm text-ink-600">
          Buat akun member untuk memesan coworking space.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Nama lengkap"
              value={form.nama_member}
              onChange={(e) => handleChange("nama_member", e.target.value)}
              error={errors.nama_member}
            />
            <Input
              label="Instansi (opsional)"
              value={form.instansi}
              onChange={(e) => handleChange("instansi", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Alamat"
              value={form.alamat}
              onChange={(e) => handleChange("alamat", e.target.value)}
              error={errors.alamat}
            />
            <Input
              label="No telp"
              value={form.telp}
              onChange={(e) => handleChange("telp", e.target.value)}
              error={errors.telp}
            />
          </div>

          <Input
            label="Username"
            value={form.username}
            onChange={(e) => handleChange("username", e.target.value)}
            error={errors.username}
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Password"
              type="password"
              value={form.password}
              onChange={(e) => handleChange("password", e.target.value)}
              error={errors.password}
            />
            <Input
              label="Konfirmasi password"
              type="password"
              value={form.confirmPassword}
              onChange={(e) => handleChange("confirmPassword", e.target.value)}
              error={errors.confirmPassword}
            />
          </div>

          {serverError && <p className="text-sm text-status-cancelled">{serverError}</p>}

          <Button type="submit" isLoading={isSubmitting} className="mt-2 w-full">
            Daftar
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-ink-600">
          Sudah punya akun?{" "}
          <Link href="/login" className="font-medium text-brand-600 hover:underline">
            Masuk
          </Link>
        </p>
      </Card>
    </main>
  );
}