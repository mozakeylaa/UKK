import Input from "@/components/ui/Input";

export interface AdminRegisterFormState {
  nama_coworking: string;
  nama_pemilik: string;
  telp: string;
  username: string;
  password: string;
  confirmPassword: string;
}

interface AdminRegisterFormFieldsProps {
  form: AdminRegisterFormState;
  errors: Partial<Record<keyof AdminRegisterFormState, string>>;
  onChange: (field: keyof AdminRegisterFormState, value: string) => void;
}

export default function AdminRegisterFormFields({
  form,
  errors,
  onChange,
}: AdminRegisterFormFieldsProps) {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Nama coworking"
          value={form.nama_coworking}
          onChange={(e) => onChange("nama_coworking", e.target.value)}
          error={errors.nama_coworking}
        />
        <Input
          label="Nama pemilik"
          value={form.nama_pemilik}
          onChange={(e) => onChange("nama_pemilik", e.target.value)}
          error={errors.nama_pemilik}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="No telp"
          value={form.telp}
          onChange={(e) => onChange("telp", e.target.value)}
          error={errors.telp}
        />
        <Input
          label="Username"
          value={form.username}
          onChange={(e) => onChange("username", e.target.value)}
          error={errors.username}
        />
      </div>

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
