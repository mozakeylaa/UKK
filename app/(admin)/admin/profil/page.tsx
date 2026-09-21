"use client";

import { useEffect, useState } from "react";
import { getAdminProfile, updateAdminProfile } from "@/lib/api/admin-profile";
import { isApiSuccess } from "@/lib/types/api";
import { Card } from "@/components/ui/Card";
import Spinner from "@/components/ui/Spinner";
import AdminProfileForm, {
  AdminProfileData,
} from "@/components/admin/profil/AdminProfileForm";

export default function AdminProfilPage() {
  const [profileData, setProfileData] = useState<AdminProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    getAdminProfile().then((res) => {
      if (isApiSuccess(res)) {
        setProfileData({
          nama_coworking: res.data.nama_coworking ?? "",
          nama_pemilik: res.data.nama_pemilik ?? "",
          telp: res.data.telp ?? "",
        });
      } else {
        setLoadError(res.message);
      }
      setIsLoading(false);
    });
  }, []);

  async function handleSubmit(data: AdminProfileData) {
    setSubmitError(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    try {
      const res = await updateAdminProfile(data);
      if (isApiSuccess(res)) {
        setSuccessMessage("Profil berhasil diperbarui.");
        setProfileData(data);
      } else {
        setSubmitError(res.message);
      }
    } catch {
      setSubmitError("Terjadi kesalahan. Coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) return <Spinner label="Memuat profil..." />;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink-950">Profil Lokasi</h1>
        <p className="mt-1 text-sm text-ink-600">Kelola informasi coworking space kamu.</p>
      </div>

      <Card className="max-w-lg">
        {loadError && <p className="mb-4 text-sm text-status-cancelled">{loadError}</p>}

        {profileData && (
          <AdminProfileForm
            initialData={profileData}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            submitError={submitError}
            successMessage={successMessage}
          />
        )}
      </Card>
    </div>
  );
}