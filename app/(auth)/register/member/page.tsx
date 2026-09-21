"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerMember } from "@/lib/api/auth";
import { isApiSuccess } from "@/lib/types/api";
import Button from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import AuthCardHeader from "@/components/auth/AuthCardHeader";
import MemberRegisterFormFields, {
  MemberRegisterFormState,
} from "@/components/auth/MemberRegisterFormFields";

const initialState: MemberRegisterFormState = {
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
  const [form, setForm] = useState<MemberRegisterFormState>(initialState);
  const [errors, setErrors] = useState<Partial<Record<keyof MemberRegisterFormState, string>>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(field: keyof MemberRegisterFormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function validate(): boolean {
    const newErrors: Partial<Record<keyof MemberRegisterFormState, string>> = {};

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
        <AuthCardHeader
          title="Daftar Akun Member"
          subtitle="Buat akun member untuk memesan coworking space."
        />

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <MemberRegisterFormFields form={form} errors={errors} onChange={handleChange} />

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