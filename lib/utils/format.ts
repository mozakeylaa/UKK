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

// lib/utils/format.ts (tambahkan fungsi ini)
export function getImageUrl(
  pathOrFilename?: string | null,
  folder: "members" | "spaces" = "members"
): string | null {
  if (!pathOrFilename) return null;
  
  // Jika sudah berupa URL lengkap (http://... atau data:image/...)
  if (pathOrFilename.startsWith("http://") || pathOrFilename.startsWith("https://") || pathOrFilename.startsWith("data:")) {
    return pathOrFilename;
  }

  // Ambil base URL API dari env atau apiClient
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  
  // Sesuaikan route static file di backend kamu (biasanya /uploads/members/... atau /storage/...)
  const cleanPath = pathOrFilename.replace(/^\/+/, "");
  if (cleanPath.startsWith("uploads/")) {
    return `${baseUrl}/${cleanPath}`;
  }

  return `${baseUrl}/uploads/${folder}/${cleanPath}`;
}