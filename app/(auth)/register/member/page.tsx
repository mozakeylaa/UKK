"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { registerMember } from "@/lib/api/auth";
import { isApiSuccess } from "@/lib/types/api";
import Button from "@/components/ui/Button";
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
      setServerError("Terjadi kesalahan koneksi. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-navy-gradient px-4 py-12">
      {/* Glow ambient background */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-[#8494FF]/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-16 h-80 w-80 rounded-full bg-[#FF8FC2]/20 blur-3xl" />

      <div
        className="relative w-full max-w-2xl opacity-0"
        style={{ animation: "fadeUp 0.6s ease 0.05s forwards" }}
      >
        {/* Logo Branding */}
        <div className="mb-6 flex flex-col items-center text-center">
          <Link href="/" className="group flex items-center gap-2.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FF8FC2] to-[#FF5DA2] font-display text-base font-bold text-white shadow-lg shadow-[#FF5DA2]/30 transition-transform group-hover:scale-105">
              CW
            </div>
            <span className="font-display text-xl font-bold text-white tracking-wide">
              Co-Work <span className="text-xs font-normal text-slate-300">member</span>
            </span>
          </Link>
        </div>

        {/* Card Container */}
        <div className="rounded-3xl bg-white/95 p-6 sm:p-10 backdrop-blur-xl border border-white/20 shadow-2xl shadow-slate-950/20">
          <AuthCardHeader
            title="Daftar Akun Member"
            subtitle="Buat akun member untuk memesan dan menikmati coworking space."
          />

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            <MemberRegisterFormFields form={form} errors={errors} onChange={handleChange} />

            {serverError && (
              <div className="flex items-center gap-2 rounded-2xl bg-rose-50 border border-rose-200 px-4 py-3 text-xs font-medium text-rose-600">
                <AlertCircle size={15} className="shrink-0" />
                <span>{serverError}</span>
              </div>
            )}

            <Button
              type="submit"
              isLoading={isSubmitting}
              className="mt-4 w-full !bg-gradient-to-r !from-[#6367FF] !to-[#8494FF] !py-3 !text-sm !font-bold !text-white !shadow-lg !shadow-[#6367FF]/25 hover:!opacity-95"
            >
              Daftar Sebagai Member
            </Button>
          </form>

          <p className="mt-6 pt-5 border-t border-slate-100 text-center text-xs text-slate-500">
            Sudah punya akun?{" "}
            <Link href="/login" className="font-bold text-[#6367FF] hover:text-[#4A4FE0] hover:underline ml-1">
              Masuk sekarang
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}