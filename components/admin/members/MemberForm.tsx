"use client";

import { useState, useEffect, FormEvent } from "react";
import Button from "@/components/ui/Button";
import ImageUpload from "@/components/ui/ImageUpload";
import Input from "@/components/ui/Input";

export interface MemberFormData {
  username: string;
  password?: string;
  nama_member: string;
  instansi: string;
  alamat: string;
  telp: string;
  foto?: string;
}

interface MemberFormProps {
  initialData?: Partial<MemberFormData>;
  isEditMode?: boolean;
  onSubmit: (data: MemberFormData) => void;
  submitting: boolean;
  error: string | null;
  onCancel: () => void;
}

export default function MemberForm({
  initialData,
  isEditMode = false,
  onSubmit,
  submitting,
  error,
  onCancel,
}: MemberFormProps) {
  const [username, setUsername] = useState(initialData?.username ?? "");
  const [password, setPassword] = useState(initialData?.password ?? "");
  const [namaMember, setNamaMember] = useState(initialData?.nama_member ?? "");
  const [instansi, setInstansi] = useState(initialData?.instansi ?? "");
  const [alamat, setAlamat] = useState(initialData?.alamat ?? "");
  const [telp, setTelp] = useState(initialData?.telp ?? "");
  const [foto, setFoto] = useState<string | undefined>(initialData?.foto);

  useEffect(() => {
    if (initialData) {
      if (initialData.username !== undefined) setUsername(initialData.username);
      if (initialData.nama_member !== undefined) setNamaMember(initialData.nama_member);
      if (initialData.instansi !== undefined) setInstansi(initialData.instansi);
      if (initialData.alamat !== undefined) setAlamat(initialData.alamat);
      if (initialData.telp !== undefined) setTelp(initialData.telp);
      if (initialData.foto !== undefined) setFoto(initialData.foto);
    }
  }, [initialData]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const payload: MemberFormData = {
      username,
      nama_member: namaMember,
      instansi,
      alamat,
      telp,
      foto,
    };
    if (password.trim()) {
      payload.password = password;
    }
    onSubmit(payload);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Username"
        name="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder={isEditMode ? undefined : "Misal: budi123"}
        required
      />

      {isEditMode ? (
        <Input
          label="Reset Password (opsional)"
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Kosongkan jika tidak ingin mengubah"
          minLength={6}
          hint="Isi hanya jika ingin mereset password member"
        />
      ) : (
        <Input
          label="Password"
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Minimal 6 karakter"
          minLength={6}
          required
        />
      )}

      <Input
        label="Nama Lengkap"
        name="nama_member"
        value={namaMember}
        onChange={(e) => setNamaMember(e.target.value)}
        placeholder={isEditMode ? undefined : "Misal: Budi Santoso"}
        required
      />

      <Input
        label="Instansi"
        name="instansi"
        value={instansi}
        onChange={(e) => setInstansi(e.target.value)}
        placeholder={isEditMode ? undefined : "Misal: PT Maju Jaya"}
        required
      />

      <Input
        label="Alamat"
        name="alamat"
        value={alamat}
        onChange={(e) => setAlamat(e.target.value)}
        placeholder={isEditMode ? undefined : "Alamat lengkap"}
        required
      />

      <Input
        label="Nomor Telepon"
        name="telp"
        type="tel"
        value={telp}
        onChange={(e) => setTelp(e.target.value)}
        placeholder={isEditMode ? undefined : "Misal: 08123456789"}
        required
      />

      <ImageUpload
        target="members"
        value={foto}
        onUploaded={(filename) => setFoto(filename)}
        label={isEditMode ? "Foto Member" : "Foto Member (opsional)"}
      />

      {error && (
        <div className="rounded-md bg-status-cancelled/10 p-3 text-sm text-status-cancelled">
          {error}
        </div>
      )}

      <div className="flex gap-2">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Batal
        </Button>
        <Button type="submit" isLoading={submitting}>
          {isEditMode ? "Simpan Perubahan" : "Buat Member"}
        </Button>
      </div>
    </form>
  );
}
