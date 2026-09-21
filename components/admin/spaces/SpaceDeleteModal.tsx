import type { AdminSpace } from "@/lib/types/admin";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

interface SpaceDeleteModalProps {
  deleteTarget: AdminSpace | null;
  isDeleting: boolean;
  deleteError: string | null;
  onClose: () => void;
  onConfirm: () => void;
}

export default function SpaceDeleteModal({
  deleteTarget,
  isDeleting,
  deleteError,
  onClose,
  onConfirm,
}: SpaceDeleteModalProps) {
  return (
    <Modal open={!!deleteTarget} onClose={onClose} title="Hapus Space">
      <p className="text-sm text-ink-600">
        Yakin ingin menghapus <strong>{deleteTarget?.nama_space}</strong>? Tindakan ini tidak bisa dibatalkan.
      </p>
      {deleteError && <p className="mt-3 text-sm text-status-cancelled">{deleteError}</p>}
      <div className="mt-4 flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          Batal
        </Button>
        <Button variant="danger" isLoading={isDeleting} onClick={onConfirm}>
          Ya, Hapus
        </Button>
      </div>
    </Modal>
  );
}
