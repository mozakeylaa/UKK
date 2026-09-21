import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

interface ProfileEditFormProps {
  editForm: {
    nama_member: string;
    instansi: string;
    alamat: string;
    telp: string;
    foto: string;
  };
  isSaving: boolean;
  onChangeForm: (field: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export default function ProfileEditForm({
  editForm,
  isSaving,
  onChangeForm,
  onSubmit,
  onCancel,
}: ProfileEditFormProps) {
  return (
    <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-4 border-t border-surface-200 pt-4">
      <Input
        label="Nama Lengkap"
        value={editForm.nama_member}
        onChange={(e) => onChangeForm("nama_member", e.target.value)}
        required
      />
      <Input
        label="Instansi"
        value={editForm.instansi}
        onChange={(e) => onChangeForm("instansi", e.target.value)}
      />
      <Input
        label="Alamat"
        value={editForm.alamat}
        onChange={(e) => onChangeForm("alamat", e.target.value)}
        required
      />
      <Input
        label="No Telepon"
        value={editForm.telp}
        onChange={(e) => onChangeForm("telp", e.target.value)}
        required
      />

      <div className="mt-2 flex gap-2">
        <Button type="submit" isLoading={isSaving} className="flex-1">
          Simpan Perubahan
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSaving}
        >
          Batal
        </Button>
      </div>
    </form>
  );
}
