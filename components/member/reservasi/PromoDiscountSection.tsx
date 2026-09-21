import type { Diskon } from "@/lib/types/reservasi";
import { Card } from "@/components/ui/Card";
import Select from "@/components/ui/Select";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

interface PromoDiscountSectionProps {
  activeDiskon: Diskon[];
  selectedDiskonId: string;
  kodePromoManual: string;
  appliedDiskon: Diskon | null;
  promoError: string | null;
  isCheckingPromo: boolean;
  onSelectDiskon: (value: string) => void;
  onChangeKodeManual: (value: string) => void;
  onCheckPromoManual: () => void;
  onRemovePromo: () => void;
}

export default function PromoDiscountSection({
  activeDiskon,
  selectedDiskonId,
  kodePromoManual,
  appliedDiskon,
  promoError,
  isCheckingPromo,
  onSelectDiskon,
  onChangeKodeManual,
  onCheckPromoManual,
  onRemovePromo,
}: PromoDiscountSectionProps) {
  const diskonOptions = [
    { label: "Tanpa promo dari daftar", value: "" },
    ...activeDiskon.map((d) => ({
      label: `${d.nama_diskon} (${d.persentase_diskon}%)`,
      value: String(d.id),
    })),
  ];

  return (
    <Card>
      <h2 className="font-display text-base font-medium text-ink-950">Kode Promo</h2>
      <p className="mb-3 mt-1 text-sm text-ink-600">
        Pilih promo aktif atau masukkan kode secara manual.
      </p>

      <Select
        label="Pilih dari promo aktif"
        options={diskonOptions}
        value={selectedDiskonId}
        onChange={(e) => onSelectDiskon(e.target.value)}
      />

      <div className="mt-3 flex items-end gap-2">
        <Input
          label="Atau masukkan kode promo"
          placeholder="Contoh: HEMAT10"
          value={kodePromoManual}
          onChange={(e) => onChangeKodeManual(e.target.value)}
        />
        <Button
          type="button"
          variant="outline"
          isLoading={isCheckingPromo}
          onClick={onCheckPromoManual}
        >
          Cek
        </Button>
      </div>

      {promoError && <p className="mt-2 text-sm text-status-cancelled">{promoError}</p>}

      {appliedDiskon && (
        <div className="mt-3 flex items-center justify-between rounded-md bg-brand-50 px-3 py-2">
          <p className="text-sm text-brand-700">
            Promo <strong>{appliedDiskon.nama_diskon}</strong> diterapkan (
            {appliedDiskon.persentase_diskon}%)
          </p>
          <button
            type="button"
            onClick={onRemovePromo}
            className="text-xs text-ink-600 hover:underline"
          >
            Hapus
          </button>
        </div>
      )}
    </Card>
  );
}
