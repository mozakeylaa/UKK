import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

interface DiskonDeleteModalProps {
  open: boolean;
  diskonName: string;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DiskonDeleteModal({
  open,
  diskonName,
  isDeleting,
  onClose,
  onConfirm,
}: DiskonDeleteModalProps) {
  return (
    <Modal open={open} onClose={onClose} title="Hapus Diskon">
      <div className="space-y-4">
        <p className="text-sm text-ink-600">
          Yakin ingin menghapus diskon <strong>{diskonName}</strong>?
        </p>
        <div className="flex gap-2 justify-end">
          <Button variant="ghost" onClick={onClose}>
            Batal
          </Button>
          <Button variant="danger" isLoading={isDeleting} onClick={onConfirm}>
            Hapus
          </Button>
        </div>
      </div>
    </Modal>
  );
}
