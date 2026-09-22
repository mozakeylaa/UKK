import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import ImageUpload from "@/components/ui/ImageUpload";

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
    <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-4 border-t border-slate-100 pt-4">
      <Input
        label="Nama Lengkap"
        value={editForm.nama_member}
        onChange={(e) => onChangeForm("nama_member", e.target.value)}
        placeholder="Nama lengkap member"
        required
      />
      <Input
        label="Instansi"
        value={editForm.instansi}
        onChange={(e) => onChangeForm("instansi", e.target.value)}
        placeholder="Nama perusahaan, instansi, atau kampus"
      />
      <Input
        label="Alamat"
        value={editForm.alamat}
        onChange={(e) => onChangeForm("alamat", e.target.value)}
        placeholder="Alamat domisili"
        required
      />
      <Input
        label="No Telepon"
        value={editForm.telp}
        onChange={(e) => onChangeForm("telp", e.target.value)}
        placeholder="Nomor kontak WhatsApp/telepon"
        required
      />

      <ImageUpload
        target="members"
        value={editForm.foto}
        onUploaded={(filename) => onChangeForm("foto", filename)}
        label="Foto Profil (Unggah Gambar)"
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
