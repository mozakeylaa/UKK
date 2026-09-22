import type { Reservasi, ETicket } from "@/lib/types/reservasi";

export function calculateJamSelesai(jamMulai?: string, durasiJam: number = 1): string {
  if (!jamMulai) return "00:00";
  const [hStr, mStr] = jamMulai.split(":");
  const h = parseInt(hStr, 10) || 0;
  const m = parseInt(mStr, 10) || 0;
  const endH = (h + durasiJam) % 24;
  return `${String(endH).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function normalizeReservasi(raw: any): Reservasi {
  if (!raw) return raw;

  const detail = Array.isArray(raw.detail_reservasi) ? raw.detail_reservasi[0] : null;
  const durasi = Number(raw.durasi_jam) || 1;
  const jamMulai = raw.jam_mulai || "00:00";
  const jamSelesai = raw.jam_selesai || calculateJamSelesai(jamMulai, durasi);

  const space = raw.space || detail?.space || undefined;
  const idSpace = raw.id_space || detail?.id_space || space?.id || 0;

  const hargaPerJam = space?.harga_per_jam || 0;
  const calculatedHargaAwal = hargaPerJam * durasi;
  const totalBayar =
    raw.total_bayar !== undefined
      ? Number(raw.total_bayar)
      : detail?.total_harga !== undefined
      ? Number(detail.total_harga)
      : calculatedHargaAwal;
  const totalHargaAwal =
    raw.total_harga_awal !== undefined
      ? Number(raw.total_harga_awal)
      : calculatedHargaAwal > 0
      ? calculatedHargaAwal
      : totalBayar;
  const potonganDiskon =
    raw.potongan_diskon !== undefined
      ? Number(raw.potongan_diskon)
      : Math.max(0, totalHargaAwal - totalBayar);

  const namaDiskon = raw.nama_diskon || detail?.diskon?.nama_diskon || null;
  const idDiskon = raw.id_diskon || detail?.id_diskon || detail?.diskon?.id || null;

  const kodeBooking =
    raw.kode_booking || raw.booking_code || `CWK-${String(raw.id).padStart(6, "0")}`;

  return {
    ...raw,
    kode_booking: kodeBooking,
    id_space: idSpace,
    space,
    member: raw.member
      ? {
          ...raw.member,
          nama_member: raw.member.nama_member || raw.member.nama || "-",
        }
      : undefined,
    jam_mulai: jamMulai,
    jam_selesai: jamSelesai,
    durasi_jam: durasi,
    id_diskon: idDiskon,
    nama_diskon: namaDiskon,
    total_harga_awal: totalHargaAwal,
    potongan_diskon: potonganDiskon,
    total_bayar: totalBayar,
  };
}

export function normalizeETicket(raw: any, fallbackId?: number): ETicket {
  if (!raw) return raw;

  const reservasiId = raw.reservasi_id || raw.id || fallbackId || 0;
  const bookingCode =
    raw.booking_code || raw.kode_booking || `CWK-${String(reservasiId).padStart(6, "0")}`;

  const detail = Array.isArray(raw.detail_reservasi) ? raw.detail_reservasi[0] : null;

  // Jadwal
  const tanggal = raw.jadwal?.tanggal || raw.tanggal_reservasi || raw.created_at || "";
  const jamMulai = raw.jadwal?.jam_mulai || raw.jam_mulai || "00:00";
  const durasi =
    Number(raw.rincian_biaya?.durasi_jam) ||
    parseInt(String(raw.jadwal?.durasi || ""), 10) ||
    Number(raw.durasi_jam) ||
    1;
  const jamSelesai = raw.jam_selesai || calculateJamSelesai(jamMulai, durasi);

  // Space
  const rawSpace = raw.space || detail?.space || undefined;
  const idSpace =
    rawSpace?.id || raw.id_space || detail?.id_space || 0;

  const namaSpace =
    rawSpace?.nama_space || rawSpace?.nama || (idSpace ? `Space #${idSpace}` : "Ruang Kerja");
  const tipeSpace = rawSpace?.tipe || "desk";
  const kapasitasSpace =
    typeof rawSpace?.kapasitas === "number"
      ? rawSpace.kapasitas
      : parseInt(String(rawSpace?.kapasitas || 1), 10) || 1;
  const hargaPerJam =
    Number(raw.rincian_biaya?.harga_per_jam) ||
    Number(rawSpace?.harga_per_jam) ||
    0;

  const namaCoworking =
    raw.coworking_space?.nama ||
    rawSpace?.owner?.nama_coworking ||
    raw.owner?.nama_coworking ||
    "Co-Work Space";

  const space = {
    ...(rawSpace || {}),
    id: idSpace,
    nama_space: namaSpace,
    tipe: tipeSpace,
    kapasitas: kapasitasSpace,
    harga_per_jam: hargaPerJam,
    foto: rawSpace?.foto || null,
    foto_url: rawSpace?.foto_url || null,
    owner: {
      ...(rawSpace?.owner || {}),
      nama_coworking: namaCoworking,
    },
  };

  // Biaya & Pembayaran
  const calculatedHargaAwal = hargaPerJam * durasi;
  const totalBayar =
    raw.rincian_biaya?.total_pembayaran !== undefined
      ? Number(raw.rincian_biaya.total_pembayaran)
      : raw.total_bayar !== undefined
      ? Number(raw.total_bayar)
      : detail?.total_harga !== undefined
      ? Number(detail.total_harga)
      : calculatedHargaAwal;

  const totalHargaAwal =
    raw.rincian_biaya?.subtotal !== undefined
      ? Number(raw.rincian_biaya.subtotal)
      : raw.total_harga_awal !== undefined
      ? Number(raw.total_harga_awal)
      : calculatedHargaAwal > 0
      ? calculatedHargaAwal
      : totalBayar;

  const potonganDiskon =
    raw.rincian_biaya?.subtotal !== undefined && raw.rincian_biaya?.total_pembayaran !== undefined
      ? Math.max(0, Number(raw.rincian_biaya.subtotal) - Number(raw.rincian_biaya.total_pembayaran))
      : raw.potongan_diskon !== undefined
      ? Number(raw.potongan_diskon)
      : Math.max(0, totalHargaAwal - totalBayar);

  const namaDiskon =
    raw.rincian_biaya?.diskon_nama ||
    raw.nama_diskon ||
    detail?.diskon?.nama_diskon ||
    null;

  // QR Code Payload
  const qrCodePayload =
    raw.qr_code_data ||
    raw.qr_code_payload ||
    `COWORKING|${bookingCode}|${reservasiId}|${tanggal}|${jamMulai}`;

  return {
    ...raw,
    id: reservasiId,
    kode_booking: bookingCode,
    id_space: idSpace,
    space: space as any,
    member: raw.member
      ? {
          ...raw.member,
          nama_member: raw.member.nama_member || raw.member.nama || "-",
        }
      : undefined,
    tanggal_reservasi: tanggal,
    jam_mulai: jamMulai,
    jam_selesai: jamSelesai,
    durasi_jam: durasi,
    id_diskon: raw.id_diskon || detail?.id_diskon || null,
    nama_diskon: namaDiskon,
    total_harga_awal: totalHargaAwal,
    potongan_diskon: potonganDiskon,
    total_bayar: totalBayar,
    status: raw.status || "belum_dikonfirm",
    status_label: raw.status_label || "Belum Dikonfirmasi",
    qr_code_payload: qrCodePayload,
    instruksi_check_in: raw.instruksi_check_in,
    coworking_space: raw.coworking_space,
  };
}
