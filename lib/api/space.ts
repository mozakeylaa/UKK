import apiClient from "@/lib/api/client";
import type { ApiResponse } from "@/lib/types/api";
import type {
  Space,
  SpaceType,
  AvailabilityQuery,
  AvailabilityResult,
  BookedSlot,
} from "@/lib/types/space";

function addHours(timeStr: string, hours: number): string {
  const [h, m] = timeStr.split(":").map(Number);
  const totalMin = (h || 0) * 60 + (m || 0) + (hours || 0) * 60;
  const endH = Math.floor(totalMin / 60) % 24;
  const endM = totalMin % 60;
  return `${String(endH).padStart(2, "0")}:${String(endM).padStart(2, "0")}`;
}

export async function getSpaceTypes(): Promise<ApiResponse<SpaceType[]>> {
  const res = await apiClient.get<ApiResponse<SpaceType[]>>(
    "/api/spaces/types"
  );
  return res.data;
}

export type GetSpacesParams = {
  tipe?: string;
  search?: string;
};

export async function getSpaces(
  params?: GetSpacesParams
): Promise<ApiResponse<Space[]>> {
  const res = await apiClient.get<ApiResponse<Space[]>>("/api/spaces", {
    params,
  });
  return res.data;
}

export async function getSpaceById(id: number): Promise<ApiResponse<Space>> {
  const res = await apiClient.get<ApiResponse<Space>>(`/api/spaces/${id}`);
  return res.data;
}

export async function checkAvailability(
  query: AvailabilityQuery
): Promise<ApiResponse<AvailabilityResult>> {
  const res = await apiClient.get<ApiResponse<any>>(
    "/api/spaces/availability",
    { params: query }
  );

  if (!res.data || !res.data.status) {
    return res.data;
  }

  const rawData = res.data.data;
  let spaceData: any = null;

  if (Array.isArray(rawData)) {
    spaceData = rawData.find((s: any) => s.id === query.id_space) || rawData[0];
  } else {
    spaceData = rawData;
  }

  const isAvailable = spaceData?.is_available ?? spaceData?.available ?? true;
  const rawConflicts = spaceData?.conflicts || [];
  const conflicts = rawConflicts.map((c: any) => ({
    ...c,
    jam_selesai: addHours(c.jam_mulai, c.durasi_jam),
  }));

  const durasiJam = query.durasi_jam || 1;
  const jamMulai = query.jam_mulai || "08:00";
  const jamSelesai = addHours(jamMulai, durasiJam);
  const estimasiTotal = (spaceData?.harga_per_jam || 0) * durasiJam;

  return {
    status: true,
    statusCode: res.data.statusCode || 200,
    message: res.data.message || "Berhasil memeriksa ketersediaan",
    data: {
      is_available: isAvailable,
      available: isAvailable,
      jam_selesai: jamSelesai,
      estimasi_total: estimasiTotal,
      conflicts,
    },
    timestamp: res.data.timestamp,
  };
}

export async function getDaySchedule(
  id_space: number,
  tanggal: string
): Promise<ApiResponse<BookedSlot[]>> {
  const res = await apiClient.get<ApiResponse<any>>(
    "/api/spaces/availability",
    { params: { id_space, tanggal } }
  );

  if (!res.data || !res.data.status) {
    return {
      status: false,
      statusCode: res.data?.statusCode || 400,
      message: res.data?.message || "Gagal memuat jadwal",
    };
  }

  const rawData = res.data.data;
  let spaceData: any = null;

  if (Array.isArray(rawData)) {
    spaceData = rawData.find((s: any) => s.id === id_space) || rawData[0];
  } else {
    spaceData = rawData;
  }

  const detailReservasi = spaceData?.detail_reservasi || [];
  const bookedSlots: BookedSlot[] = detailReservasi
    .filter((d: any) => d.reservasi && d.reservasi.status !== "dibatalkan")
    .map((d: any) => {
      const r = d.reservasi;
      return {
        jam_mulai: r.jam_mulai,
        durasi_jam: r.durasi_jam,
        jam_selesai: addHours(r.jam_mulai, r.durasi_jam),
        status: r.status,
      };
    });

  return {
    status: true,
    statusCode: 200,
    message: "Jadwal harian berhasil dimuat",
    data: bookedSlots,
  };
}