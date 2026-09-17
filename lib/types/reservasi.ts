import type { ReservasiStatus } from "@/components/ui/Badge";
import type { Space } from "@/lib/types/space";

export type Diskon = {
  id: number;
  nama_diskon: string;
  persentase_diskon: number;
  tanggal_awal: string;
  tanggal_akhir: string;
};

export type CreateDiskonPayload = {
  nama_diskon: string;
  persentase_diskon: number;
  tanggal_awal: string;
  tanggal_akhir: string;
};

export type UpdateDiskonPayload = Partial<CreateDiskonPayload>;

export type ReservasiMember = {
  id: number;
  nama_member: string;
  username: string;
  instansi?: string;
  telp?: string;
};

export type Reservasi = {
  id: number;
  kode_booking: string;
  id_space: number;
  space?: Space;
  member?: ReservasiMember;
  tanggal_reservasi: string;
  jam_mulai: string;
  jam_selesai: string;
  durasi_jam: number;
  id_diskon?: number | null;
  nama_diskon?: string | null;
  total_harga_awal: number;
  potongan_diskon: number;
  total_bayar: number;
  status: ReservasiStatus;
  checked_in_at?: string | null;
  checked_out_at?: string | null;
  created_at?: string;
};

export type CreateReservasiPayload = {
  id_space: number;
  tanggal_reservasi: string;
  jam_mulai: string;
  durasi_jam: number;
  id_diskon?: number;
  kode_promo?: string;
};

export type HistoryResponse = {
  total_reservasi: number;
  total_pengeluaran: number;
  items: Reservasi[];
};

export type ETicket = Reservasi & {
  qr_code_payload: string;
};

export type AdminReservasiFilter = {
  month?: number;
  year?: number;
  status?: ReservasiStatus;
  id_space?: number;
  tanggal?: string;
};