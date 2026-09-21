import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

interface MemberDeleteModalProps {
  open: boolean;
  memberName: string;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function MemberDeleteModal({
  open,
  memberName,
  isDeleting,
  onClose,
  onConfirm,
}: MemberDeleteModalProps) {
  return (
    <Modal open={open} onClose={onClose} title="Hapus Member">
      <div className="space-y-4">
        <p className="text-sm text-ink-600">
          Yakin ingin menghapus member <strong>{memberName}</strong>?
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
