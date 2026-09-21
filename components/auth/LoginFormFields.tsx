import { FormEvent } from "react";
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
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <Input
        label="Username"
        value={username}
        onChange={(e) => onChangeUsername(e.target.value)}
        error={errors.username}
      />
      <Input
        label="Password"
        type="password"
        value={password}
        onChange={(e) => onChangePassword(e.target.value)}
        error={errors.password}
      />

      {serverError && <p className="text-sm text-status-cancelled">{serverError}</p>}

      <Button type="submit" isLoading={isSubmitting} className="mt-2 w-full">
        Masuk
      </Button>
    </form>
  );
}
