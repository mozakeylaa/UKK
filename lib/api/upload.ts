// import apiClient from "@/lib/api/client";
// import type { ApiResponse } from "@/lib/types/api";

// export type UploadTarget = "members" | "spaces";

// export type UploadResult = {
//   filename: string;
//   url?: string;
//   foto_url?: string;
// };

// export async function uploadFile(
//   file: File,
//   target: UploadTarget
// ): Promise<ApiResponse<UploadResult>> {
//   const formData = new FormData();
//   formData.append("file", file);

//   const res = await apiClient.post<ApiResponse<UploadResult>>(
//     `/api/upload/${target}`,
//     formData,
//     {
//       headers: {
//         "Content-Type": "multipart/form-data",
//       },
//     }
//   );

//   return res.data;
// }

import apiClient from "@/lib/api/client";
import type { ApiResponse } from "@/lib/types/api";

export type UploadTarget = "members" | "spaces";

export type UploadResult = {
  filename: string;
  url?: string;
  foto_url?: string;
};

export async function uploadFile(
  file: File,
  target: UploadTarget
): Promise<ApiResponse<UploadResult>> {
  const formData = new FormData();
  formData.append("file", file);

  // Tanpa manual Content-Type header agar browser menyusun boundary multipart secara presisi
  const res = await apiClient.post<ApiResponse<UploadResult>>(
    `/api/upload/${target}`,
    formData
  );

  return res.data;
}