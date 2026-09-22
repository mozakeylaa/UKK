import type { SpaceTipe } from "@/lib/types/space";

export type AdminProfile = {
  id: number;
  nama_coworking: string;
  nama_pemilik: string;
  telp: string;
  username?: string;
};

export type UpdateProfilePayload = {
  nama_coworking: string;
  nama_pemilik: string;
  telp: string;
};

export type AdminSpace = {
  id: number;
  nama_space: string;
  tipe: SpaceTipe;
  harga_per_jam: number;
  kapasitas: number;
  deskripsi: string;
  foto?: string | null;
  foto_url?: string | null;
};

export type CreateSpacePayload = {
  nama_space: string;
  harga_per_jam: number;
  tipe: SpaceTipe;
  kapasitas: number;
  deskripsi: string;
  foto?: string;
};

export type UpdateSpacePayload = Partial<CreateSpacePayload>;

export type ReportPeriode = {
  bulan: number;
  nama_bulan: string;
  tahun: number;
};

export type ReportStatusReservasi = {
  belum_dikonfirm: number;
  disetujui: number;
  aktif: number;
  selesai: number;
  dibatalkan: number;
};

export type ReportRingkasan = {
  total_reservasi: number;
  estimasi_pendapatan_total: number;
  realisasi_pendapatan: number;
  status_reservasi: ReportStatusReservasi;
};

export type ReportTipeSpaceItem = {
  count: number;
  total_income: number;
};

export type ReportPendapatanPerTipe = {
  desk?: ReportTipeSpaceItem;
  meeting_room?: ReportTipeSpaceItem;
  private_office?: ReportTipeSpaceItem;
  [key: string]: ReportTipeSpaceItem | undefined;
};

export type ReportTrenHarian = {
  tanggal: string;
  total_reservations: number;
  total_income: number;
};

export type RincianTipeSpace = {
  tipe: SpaceTipe;
  label: string;
  total_booking: number;
  total_jam?: number;
  total_pendapatan: number;
};

export type MonthlyReport = {
  periode?: ReportPeriode;
  ringkasan?: ReportRingkasan;
  pendapatan_per_tipe_space?: ReportPendapatanPerTipe;
  tren_harian?: ReportTrenHarian[];
  // Normalized / convenience fields
  total_transaksi?: number;
  total_jam_terpakai?: number;
  estimasi_pendapatan_kotor?: number;
  total_potongan_diskon?: number;
  realisasi_pendapatan_bersih?: number;
  rincian_per_tipe_space?: RincianTipeSpace[];
};