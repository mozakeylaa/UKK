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