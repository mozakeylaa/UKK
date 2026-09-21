import Input from "@/components/ui/Input";

export interface MemberRegisterFormState {
  nama_member: string;
  instansi: string;
  alamat: string;
  telp: string;
  username: string;
  password: string;
  confirmPassword: string;
}

interface MemberRegisterFormFieldsProps {
  form: MemberRegisterFormState;
  errors: Partial<Record<keyof MemberRegisterFormState, string>>;
  onChange: (field: keyof MemberRegisterFormState, value: string) => void;
}

export default function MemberRegisterFormFields({
  form,
  errors,
  onChange,
}: MemberRegisterFormFieldsProps) {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Nama lengkap"
          value={form.nama_member}
          onChange={(e) => onChange("nama_member", e.target.value)}
          error={errors.nama_member}
        />
        <Input
          label="Instansi (opsional)"
          value={form.instansi}
          onChange={(e) => onChange("instansi", e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Alamat"
          value={form.alamat}
          onChange={(e) => onChange("alamat", e.target.value)}
          error={errors.alamat}
        />
        <Input
          label="No telp"
          value={form.telp}
          onChange={(e) => onChange("telp", e.target.value)}
          error={errors.telp}
        />
      </div>

      <Input
        label="Username"
        value={form.username}
        onChange={(e) => onChange("username", e.target.value)}
        error={errors.username}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Password"
          type="password"
          value={form.password}
          onChange={(e) => onChange("password", e.target.value)}
          error={errors.password}
        />
        <Input
          label="Konfirmasi password"
          type="password"
          value={form.confirmPassword}
          onChange={(e) => onChange("confirmPassword", e.target.value)}
          error={errors.confirmPassword}
        />
      </div>
    </>
  );
}
