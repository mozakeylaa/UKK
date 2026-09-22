import type { ReservasiStatus } from "@/components/ui/Badge";
import type { Space } from "@/lib/types/space";

export type Diskon = {
  id: number;
  nama_diskon: string;
  persentase_diskon: number;
  tanggal_awal: string;
  tanggal_akhir: string;
  kode_diskon?: string;
  nama?: string;
  persentase?: number;
  tanggal_mulai?: string;
  tanggal_berakhir?: string;
  periode?: string;
  status?: string;
  is_active?: boolean;
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
  username?: string;
  instansi?: string;
  alamat?: string;
  telp?: string;
  id_user?: number;
  foto?: string | null;
  foto_url?: string | null;
};

export type DetailReservasi = {
  id?: number;
  id_reservasi?: number;
  id_space: number;
  id_diskon?: number | null;
  total_harga: number;
  space?: Space;
  diskon?: Diskon;
};

export type Reservasi = {
  id: number;
  kode_booking: string;
  id_space: number;
  id_owner?: number;
  id_member?: number;
  space?: Space;
  member?: ReservasiMember;
  detail_reservasi?: DetailReservasi[];
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
  status_label?: string;
  checked_in_at?: string | null;
  checked_out_at?: string | null;
  created_at?: string;
  updated_at?: string;
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
  ticket_title?: string;
  instruksi_check_in?: string[];
  coworking_space?: {
    nama: string;
    penanggung_jawab?: string;
    telp?: string;
  };
  jadwal?: {
    tanggal: string;
    jam_mulai: string;
    durasi: string;
  };
  rincian_biaya?: {
    harga_per_jam: number;
    durasi_jam: number;
    subtotal: number;
    diskon_nama?: string | null;
    diskon_persen?: string | null;
    total_pembayaran: number;
  };
};

export type AdminReservasiFilter = {
  month?: number;
  year?: number;
  status?: ReservasiStatus;
  id_space?: number;
  tanggal?: string;
};