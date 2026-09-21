import type { Reservasi } from "@/lib/types/reservasi";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

interface CancelReservationModalProps {
  cancelTarget: Reservasi | null;
  isCancelling: boolean;
  cancelError: string | null;
  onClose: () => void;
  onConfirm: () => void;
}

export default function CancelReservationModal({
  cancelTarget,
  isCancelling,
  cancelError,
  onClose,
  onConfirm,
}: CancelReservationModalProps) {
  return (
    <Modal
      open={!!cancelTarget}
      onClose={onClose}
      title="Batalkan Reservasi"
    >
      <p className="text-sm text-ink-600">
        Yakin ingin membatalkan reservasi{" "}
        <strong>{cancelTarget?.kode_booking}</strong>? Tindakan ini tidak bisa dibatalkan.
      </p>
      {cancelError && (
        <p className="mt-3 text-sm text-status-cancelled">{cancelError}</p>
      )}
      <div className="mt-4 flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          Batal
        </Button>
        <Button variant="danger" isLoading={isCancelling} onClick={onConfirm}>
          Ya, Batalkan
        </Button>
      </div>
    </Modal>
  );
}
