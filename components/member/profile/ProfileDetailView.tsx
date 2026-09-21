import Button from "@/components/ui/Button";

interface ProfileDetailViewProps {
  instansi?: string;
  alamat?: string;
  telp?: string;
  onEdit: () => void;
  onLogout: () => void;
}

export default function ProfileDetailView({
  instansi,
  alamat,
  telp,
  onEdit,
  onLogout,
}: ProfileDetailViewProps) {
  return (
    <>
      <div className="mt-5 flex flex-col gap-3 border-t border-surface-200 pt-4 text-sm">
        <div className="flex justify-between">
          <span className="text-ink-600">Instansi</span>
          <span className="text-ink-950">{instansi || "-"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-ink-600">Alamat</span>
          <span className="text-ink-950">{alamat || "-"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-ink-600">No telp</span>
          <span className="text-ink-950">{telp || "-"}</span>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-2">
        <Button variant="outline" onClick={onEdit}>
          Edit Profil & Foto
        </Button>
        <Button variant="outline" className="text-status-cancelled hover:bg-red-50" onClick={onLogout}>
          Keluar
        </Button>
      </div>
    </>
  );
}
