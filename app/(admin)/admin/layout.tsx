"use client";

import {
  LayoutDashboard,
  CalendarCheck,
  Building2,
  Tag,
  Users,
  FileBarChart,
  UserCircle,
} from "lucide-react";
import DashboardShell, { NavItem } from "@/components/shared/DashboardShell";
import {
  AdminReservasiProvider,
  useAdminReservasi,
} from "@/lib/context/AdminReservasiContext";

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { unreadCount } = useAdminReservasi();

  const adminNavItems: NavItem[] = [
    { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    {
      label: "Reservasi",
      href: "/admin/reservasi",
      icon: CalendarCheck,
      badge: unreadCount > 0 ? unreadCount : undefined,
    },
    { label: "Space", href: "/admin/spaces", icon: Building2 },
    { label: "Diskon", href: "/admin/diskon", icon: Tag },
    { label: "Member", href: "/admin/members", icon: Users },
    { label: "Laporan", href: "/admin/laporan", icon: FileBarChart },
    { label: "Akun", href: "/admin/profil", icon: UserCircle },
  ];

  return (
    <DashboardShell navItems={adminNavItems} roleLabel="Admin Space">
      {children}
    </DashboardShell>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminReservasiProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AdminReservasiProvider>
  );
}