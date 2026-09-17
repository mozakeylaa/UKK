export type Member = {
  id: number;
  username: string;
  nama_member: string;
  instansi: string;
  alamat: string;
  telp: string;
  foto?: string | null;
  foto_url?: string | null;
};

export type CreateMemberPayload = {
  username: string;
  password: string;
  nama_member: string;
  instansi: string;
  alamat: string;
  telp: string;
  foto?: string;
};

export type UpdateMemberPayload = Partial<CreateMemberPayload>;