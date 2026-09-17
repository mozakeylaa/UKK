export type Role = "admin_sistem" | "space_owner" | "admin_space" | "member";

export type MemberProfile = {
  id: number;
  user_id: number;
  nama_member: string;
  instansi?: string;
  no_telepon?: string;
  telp?: string;
  alamat?: string;
  foto_profil?: string;
  foto?: string;
  foto_url?: string;
};

export type SpaceOwnerProfile = {
  id: number;
  user_id: number;
  nama_pemilik: string;
  nama_usaha?: string;
  nama_coworking?: string;
  no_telepon?: string;
  telp?: string;
  alamat?: string;
  foto_profil?: string;
  foto?: string;
  foto_url?: string;
};

export type LoginData = {
  id: number;
  username: string;
  role: Role;
  access_token: string;
  member?: MemberProfile;
  space_owner?: SpaceOwnerProfile;
};

export type LoginPayload = {
  username: string;
  kata_sandi?: string;
  password?: string;
};

export type RegisterMemberPayload = {
  username: string;
  kata_sandi?: string;
  password?: string;
  nama_member: string;
  instansi?: string;
  alamat?: string;
  no_telepon?: string;
  telp?: string;
  foto_profil?: string;
  foto?: string;
};

export type RegisterAdminPayload = {
  username: string;
  kata_sandi?: string;
  password?: string;
  nama_pemilik: string;
  nama_usaha?: string;
  nama_coworking?: string;
  no_telepon?: string;
  telp?: string;
  alamat?: string;
  foto_profil?: string;
  foto?: string;
};

export type ProfileData = {
  id: number;
  username: string;
  role: Role;
  member?: MemberProfile;
  space_owner?: SpaceOwnerProfile;
};