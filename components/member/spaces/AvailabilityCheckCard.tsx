import type { AvailabilityResult } from "@/lib/types/space";
import { formatRupiah } from "@/lib/utils/format";
import { Card } from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";

const DURASI_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8].map((d) => ({
  label: `${d} jam`,
  value: String(d),
}));

interface AvailabilityCheckCardProps {
  tanggal: string;
  jamMulai: string;
  durasiJam: string;
  formError: string | null;
  isChecking: boolean;
  availError: string | null;
  result: AvailabilityResult | null;
  onChangeTanggal: (value: string) => void;
  onChangeJamMulai: (value: string) => void;
  onChangeDurasi: (value: string) => void;
  onCheckAvailability: () => void;
  onLanjutkan: () => void;
}

export default function AvailabilityCheckCard({
  tanggal,
  jamMulai,
  durasiJam,
  formError,
  isChecking,
  availError,
  result,
  onChangeTanggal,
  onChangeJamMulai,
  onChangeDurasi,
  onCheckAvailability,
  onLanjutkan,
}: AvailabilityCheckCardProps) {
  return (
    <Card>
      <h2 className="font-display text-lg font-medium text-ink-950">Cek Ketersediaan</h2>
      <p className="mb-4 mt-1 text-sm text-ink-600">
        Pilih tanggal dan jam untuk memeriksa ketersediaan space ini.
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Input
          type="date"
          label="Tanggal"
          value={tanggal}
          onChange={(e) => onChangeTanggal(e.target.value)}
        />
        <Input
          type="time"
          label="Jam mulai"
          value={jamMulai}
          onChange={(e) => onChangeJamMulai(e.target.value)}
        />
        <Select
          label="Durasi"
          options={DURASI_OPTIONS}
          value={durasiJam}
          onChange={(e) => onChangeDurasi(e.target.value)}
        />
      </div>

      {formError && <p className="mt-3 text-sm text-status-cancelled">{formError}</p>}

      <Button
        type="button"
        variant="outline"
        className="mt-4"
        isLoading={isChecking}
        onClick={onCheckAvailability}
      >
        Cek Ketersediaan
      </Button>

      {availError && (
        <p className="mt-4 rounded-md bg-status-cancelled/10 px-3 py-2 text-sm text-status-cancelled">
          {availError}
        </p>
      )}

      {result && (
        <div className="mt-4 flex flex-col gap-3 rounded-md bg-brand-50 px-4 py-3">
          {result.available ? (
            <>
              <p className="text-sm text-brand-700">
                Tersedia sampai pukul <strong>{result.jam_selesai}</strong>. Estimasi total:{" "}
                <strong>{formatRupiah(result.estimasi_total)}</strong>
              </p>
              <Button type="button" onClick={onLanjutkan} className="w-fit">
                Lanjutkan
              </Button>
            </>
          ) : (
            <p className="text-sm text-status-cancelled">
              Jadwal bentrok, space tidak tersedia pada waktu tersebut.
            </p>
          )}
        </div>
      )}
    </Card>
  );
}
