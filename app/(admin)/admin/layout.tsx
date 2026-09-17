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

const adminNavItems: NavItem[] = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Reservasi", href: "/admin/reservasi", icon: CalendarCheck },
  { label: "Space", href: "/admin/spaces", icon: Building2 },
  { label: "Diskon", href: "/admin/diskon", icon: Tag },
  { label: "Member", href: "/admin/member", icon: Users },
  { label: "Laporan", href: "/admin/laporan", icon: FileBarChart },
  { label: "Akun", href: "/admin/profil", icon: UserCircle },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell navItems={adminNavItems} roleLabel="Admin Space">
      {children}
    </DashboardShell>
  );
}