"use client";

import { Home, CalendarCheck, History, UserCircle } from "lucide-react";
import DashboardShell, { NavItem } from "@/components/shared/DashboardShell";

const memberNavItems: NavItem[] = [
  { label: "Beranda", href: "/member/dashboard", icon: Home },
  { label: "Reservasi", href: "/member/reservasi", icon: CalendarCheck },
  { label: "Histori", href: "/member/histori", icon: History },
  { label: "Akun", href: "/member/akun", icon: UserCircle },
];

export default function MemberLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell navItems={memberNavItems} roleLabel="Member">
      {children}
    </DashboardShell>
  );
}