export function formatRupiah(value: number | null | undefined): string {
  return `Rp ${(value ?? 0).toLocaleString("id-ID")}`;
}

export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return d.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// Koleksi foto coworking space nyata beresolusi tinggi (Unsplash CDN)
export const DEFAULT_SPACE_IMAGES: Record<string, string[]> = {
  desk: [
    "https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80",
  ],
  meeting_room: [
    "https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1497215842964-222b430dc094?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1200&q=80",
  ],
  private_office: [
    "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1504384764586-bb4cdc1707b0?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1568992687947-868a62a9f521?auto=format&fit=crop&w=1200&q=80",
  ],
};

// Koleksi foto potret profesional untuk avatar member
export const DEFAULT_MEMBER_AVATARS: string[] = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80",
];

export function getImageUrl(
  pathOrFilename?: string | null,
  folder: "members" | "spaces" = "members"
): string | null {
  if (!pathOrFilename || pathOrFilename.trim() === "") return null;

  const trimmed = pathOrFilename.trim();

  // Jika sudah berupa data URL
  if (trimmed.startsWith("data:")) {
    return trimmed;
  }

  // Ambil base URL API dari env (NEXT_PUBLIC_API_BASE_URL atau NEXT_PUBLIC_API_URL)
  const apiBase =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "https://learn.smktelkom-mlg.sch.id/coworking";

  const normalizedBase = apiBase.replace(/\/+$/, "");

  // Perbaiki URL dari backend panitia yang mengembalikan tanpa subpath /coworking
  // Contoh: http://learn.smktelkom-mlg.sch.id/uploads/... -> https://learn.smktelkom-mlg.sch.id/coworking/uploads/...
  if (
    trimmed.startsWith("http://learn.smktelkom-mlg.sch.id/uploads") ||
    trimmed.startsWith("https://learn.smktelkom-mlg.sch.id/uploads")
  ) {
    return trimmed.replace(
      /^https?:\/\/learn\.smktelkom-mlg\.sch\.id\/uploads/,
      "https://learn.smktelkom-mlg.sch.id/coworking/uploads"
    );
  }

  // Jika berupa URL eksternal lengkap lainnya
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  // Jika berupa path relatif uploads/
  const cleanPath = trimmed.replace(/^\/+/, "");
  if (cleanPath.startsWith("uploads/")) {
    return `${normalizedBase}/${cleanPath}`;
  }

  // Jika berupa nama file mentah
  return `${normalizedBase}/uploads/${folder}/${cleanPath}`;
}

export function getSpaceImageUrl(space?: {
  id?: number;
  foto?: string | null;
  foto_url?: string | null;
  tipe?: string;
} | null): string {
  if (!space) {
    return DEFAULT_SPACE_IMAGES.desk[0];
  }

  // 1. Coba ambil dari foto_url atau foto jika ada
  const resolved = getImageUrl(space.foto_url || space.foto, "spaces");
  if (resolved) {
    return resolved;
  }

  // 2. Jika null/kosong, berikan foto berkualitas tinggi terkurasi sesuai tipe space
  const tipe = space.tipe || "desk";
  const list = DEFAULT_SPACE_IMAGES[tipe] || DEFAULT_SPACE_IMAGES.desk;
  const index = Math.abs((space.id ?? 0) % list.length);
  return list[index];
}

export function getMemberAvatarUrl(member?: {
  id?: number | string | null;
  foto?: string | null;
  foto_url?: string | null;
  foto_profil?: string | null;
  nama_member?: string | null;
  username?: string | null;
} | null): string {
  if (!member) {
    return DEFAULT_MEMBER_AVATARS[0];
  }

  const candidate = member.foto || member.foto_url || member.foto_profil;
  const resolved = getImageUrl(candidate, "members");
  if (resolved) {
    return resolved;
  }

  const hashVal = typeof member.id === "number"
    ? member.id
    : ((member.nama_member?.length ?? 0) + (member.username?.length ?? 0));
  const index = Math.abs(hashVal % DEFAULT_MEMBER_AVATARS.length);
  return DEFAULT_MEMBER_AVATARS[index];
}