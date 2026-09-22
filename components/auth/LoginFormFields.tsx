import { FormEvent, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

interface LoginFormFieldsProps {
  username: string;
  password: string;
  errors: { username?: string; password?: string };
  serverError: string | null;
  isSubmitting: boolean;
  onChangeUsername: (value: string) => void;
  onChangePassword: (value: string) => void;
  onSubmit: (e: FormEvent) => void;
}

export default function LoginFormFields({
  username,
  password,
  errors,
  serverError,
  isSubmitting,
  onChangeUsername,
  onChangePassword,
  onSubmit,
}: LoginFormFieldsProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <Input
        label="Username"
        value={username}
        onChange={(e) => onChangeUsername(e.target.value)}
        error={errors.username}
      />
      <div className="relative">
        <Input
          label="Password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => onChangePassword(e.target.value)}
          error={errors.password}
          className="pr-11"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          aria-label={showPassword ? "Sembunyikan password" : "Lihat password"}
          className="absolute right-3.5 top-[38px] text-slate-400 hover:text-slate-600 transition-colors"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      {serverError && <p className="text-sm text-status-cancelled">{serverError}</p>}

      <Button type="submit" isLoading={isSubmitting} className="mt-2 w-full">
        Masuk
      </Button>
    </form>
  );
}
