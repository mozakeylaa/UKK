export type SpaceTipe = "desk" | "meeting_room" | "private_office";

export type SpaceType = {
  tipe: SpaceTipe;
  label: string;
  deskripsi: string;
};

export type SpaceOwner = {
  nama_coworking: string;
  nama_pemilik?: string;
  telp?: string;
};

export type Space = {
  id: number;
  nama_space: string;
  tipe: SpaceTipe;
  deskripsi: string;
  kapasitas: number;
  harga_per_jam: number;
  foto?: string | null;
  foto_url?: string | null;
  owner: SpaceOwner;
};

export type AvailabilityQuery = {
  id_space: number;
  tanggal: string; // YYYY-MM-DD
  jam_mulai?: string; // HH:mm
  durasi_jam?: number;
};

export type AvailabilityConflict = {
  reservasi_id?: number;
  tanggal?: string;
  jam_mulai: string;
  durasi_jam: number;
  jam_selesai?: string;
  status?: string;
};

export type BookedSlot = {
  jam_mulai: string;
  jam_selesai: string;
  durasi_jam: number;
  status: string;
};

export type AvailabilityResult = {
  is_available: boolean;
  available: boolean;
  jam_selesai: string;
  estimasi_total: number;
  conflicts: AvailabilityConflict[];
};