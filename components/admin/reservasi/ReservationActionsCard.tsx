import type { ReservasiStatus } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";

const STATUS_OPTIONS: { label: string; value: ReservasiStatus }[] = [
  { label: "Belum Dikonfirmasi", value: "belum_dikonfirm" },
  { label: "Disetujui", value: "disetujui" },
  { label: "Aktif", value: "aktif" },
  { label: "Selesai", value: "selesai" },
  { label: "Dibatalkan", value: "dibatalkan" },
];

interface ReservationActionsCardProps {
  status: ReservasiStatus;
  statusUpdating: boolean;
  checkActionLoading: boolean;
  onStatusChange: (newStatus: ReservasiStatus) => void;
  onCheckIn: () => void;
  onCheckOut: () => void;
}

export default function ReservationActionsCard({
  status,
  statusUpdating,
  checkActionLoading,
  onStatusChange,
  onCheckIn,
  onCheckOut,
}: ReservationActionsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Aksi</CardTitle>
      </CardHeader>
      <div className="flex flex-col gap-4">
        <Select
          label="Ubah Status"
          options={STATUS_OPTIONS}
          value={status}
          onChange={(e) => onStatusChange(e.target.value as ReservasiStatus)}
          disabled={statusUpdating}
        />

        <div className="flex gap-2">
          <Button
            onClick={onCheckIn}
            disabled={status !== "disetujui"}
            isLoading={checkActionLoading}
          >
            Check-In
          </Button>
          <Button
            onClick={onCheckOut}
            disabled={status !== "aktif"}
            isLoading={checkActionLoading}
          >
            Check-Out
          </Button>
        </div>
      </div>
    </Card>
  );
}
