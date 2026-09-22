import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "https://learn.smktelkom-mlg.sch.id/coworking";
const MAKER_KEY =
  process.env.NEXT_PUBLIC_MAKER_KEY ??
  "mk_e33effe6e2a245c1bec5bd460b077284";
const ADMIN_USERNAME = process.env.ADMIN_USERNAME ?? "admin_moklet";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "Password123!";

export async function PUT(req: NextRequest) {
  try {
    // 1. Dapatkan token member dari header Authorization atau cookies
    let token = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
    if (!token) {
      token = req.cookies.get("coworking_access_token")?.value;
    }

    if (!token) {
      return NextResponse.json(
        { status: false, message: "Autentikasi diperlukan. Silakan login kembali." },
        { status: 401 }
      );
    }

    // 2. Verifikasi profil member yang sedang login
    const profileRes = await axios.get(`${BASE_URL}/api/auth/profile`, {
      headers: {
        "x-maker-key": MAKER_KEY,
        Authorization: `Bearer ${token}`,
      },
    }).catch((e) => e.response);

    if (!profileRes || profileRes.status !== 200 || !profileRes.data?.data?.member?.id) {
      return NextResponse.json(
        { status: false, message: "Sesi member tidak valid atau profil tidak ditemukan." },
        { status: 401 }
      );
    }

    const memberId = profileRes.data.data.member.id;
    const body = await req.json();

    const updatePayload = {
      nama_member: body.nama_member,
      instansi: body.instansi,
      alamat: body.alamat,
      telp: body.telp || body.no_telepon,
      foto: body.foto || body.foto_profil || undefined,
    };

    // 3. Dapatkan admin token untuk menjembatani update ke database
    const adminLoginRes = await axios.post(
      `${BASE_URL}/api/auth/login`,
      {
        username: ADMIN_USERNAME,
        password: ADMIN_PASSWORD,
      },
      {
        headers: { "x-maker-key": MAKER_KEY },
      }
    ).catch((e) => e.response);

    const adminToken = adminLoginRes?.data?.data?.access_token;
    if (!adminToken) {
      return NextResponse.json(
        { status: false, message: "Gagal mengautentikasi layanan admin jembatan." },
        { status: 500 }
      );
    }

    // 4. Eksekusi pembaruan data member ke backend
    const updateRes = await axios.put(
      `${BASE_URL}/api/admin/members/${memberId}`,
      updatePayload,
      {
        headers: {
          "x-maker-key": MAKER_KEY,
          Authorization: `Bearer ${adminToken}`,
        },
      }
    ).catch((e) => e.response);

    if (updateRes && (updateRes.status === 200 || updateRes.data?.status)) {
      return NextResponse.json({
        status: true,
        message: updateRes.data?.message || "Profil berhasil diperbarui",
        data: updateRes.data?.data,
      });
    }

    return NextResponse.json(
      {
        status: false,
        message: updateRes?.data?.message || "Gagal memperbarui data member di backend.",
      },
      { status: updateRes?.status || 400 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        status: false,
        message: error?.message || "Terjadi kesalahan internal pada server.",
      },
      { status: 500 }
    );
  }
}
