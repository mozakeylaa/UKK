"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LucideIcon, LogOut, Calendar } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useAuth } from "@/lib/context/AuthContext";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: number | string;
};

interface DashboardShellProps {
  navItems: NavItem[];
  roleLabel: string;
  children: ReactNode;
}

function getInitial(name?: string): string {
  if (!name) return "?";
  return name.trim().charAt(0).toUpperCase();
}

function DashboardShell({ navItems, roleLabel, children }: DashboardShellProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <div className="flex min-h-screen bg-[#F8F9FD]">
      {/* Sidebar - Desktop */}
      <aside className="hidden w-64 shrink-0 flex-col bg-navy-gradient md:flex border-r border-white/5 shadow-2xl">
        {/* Brand Header */}
        <div className="px-6 py-7">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FF8FC2] to-[#FF5DA2] font-display text-sm font-bold text-white shadow-lg shadow-[#FF5DA2]/30">
              CW
            </div>
            <div>
              <span className="font-display text-base font-bold text-white tracking-wide block">
                Co-Work
              </span>
              <p className="text-[11px] font-medium text-slate-300/80 -mt-0.5">
                {roleLabel === "Member" ? "Member" : "Admin Space"}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-1 flex-col gap-1.5 px-3 py-2">
          {navItems.map((item, index) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-200",
                  isActive
                    ? "bg-white text-slate-900 shadow-md shadow-black/10"
                    : "text-slate-300/80 hover:bg-white/10 hover:text-white"
                )}
                style={{
                  animation: `slideInLeft 0.35s ease ${0.05 + index * 0.04}s forwards`,
                }}
              >
                <div className="flex items-center gap-3.5">
                  <Icon
                    size={19}
                    className={cn(
                      "transition-colors",
                      isActive ? "text-[#FF5DA2]" : "text-slate-400 group-hover:text-white"
                    )}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge ? (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#FF5DA2] px-1.5 text-[11px] font-bold text-white">
                    {item.badge}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>

        {/* User Footer & Logout */}
        <div className="p-4 border-t border-white/10">
          <div className="mb-2 flex items-center gap-3 rounded-2xl bg-white/5 p-3 backdrop-blur-sm">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#6367FF] to-[#8494FF] font-display text-sm font-bold text-white shadow-inner">
              {getInitial(user?.nama)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-white">
                {user?.nama ?? "Pengguna"}
              </p>
              <p className="truncate text-[11px] text-slate-400">@{user?.username ?? "user"}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-xs font-semibold text-rose-300 transition-colors hover:bg-rose-500/10 hover:text-rose-200"
          >
            <LogOut size={16} />
            Keluar
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col">
        {/* Top Header - Desktop Bar (Hanya Indikator Tanggal) */}
        <div className="hidden md:flex h-16 items-center justify-end px-8 py-4 bg-white/60 backdrop-blur-md border-b border-slate-100">
          <div className="flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-xs font-medium text-slate-600 border border-slate-200/80 shadow-sm">
            <Calendar size={13} className="text-[#FF5DA2]" />
            <span>Sabtu, 21 Sep 2026</span>
          </div>
        </div>

        {/* Topbar - Mobile */}
        <header className="flex items-center justify-between bg-navy-gradient px-4 py-4 md:hidden">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF8FC2] to-[#FF5DA2] font-display text-xs font-bold text-white">
              CW
            </div>
            <div>
              <p className="font-display text-sm font-bold text-white">
                Halo, {user?.nama?.split(" ")[0] ?? "Pengguna"}
              </p>
              <p className="text-[11px] text-slate-300">{roleLabel}</p>
            </div>
          </div>
          <button
            onClick={logout}
            aria-label="Keluar"
            className="rounded-xl bg-white/10 p-2 text-rose-200 hover:bg-white/20"
          >
            <LogOut size={16} />
          </button>
        </header>

        {/* Main View Container */}
        <main className="flex-1 px-4 py-6 pb-24 md:px-8 md:py-6 md:pb-12">
          {children}
        </main>

        {/* Bottom Nav - Mobile */}
        <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-slate-200 bg-white/95 px-2 py-2 backdrop-blur md:hidden">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative mx-0.5 flex flex-1 flex-col items-center gap-1 rounded-2xl py-2 text-[10px] font-semibold transition-colors duration-200",
                  isActive ? "bg-[#EEEFFF] text-[#6367FF]" : "text-slate-500"
                )}
              >
                <Icon size={18} />
                {item.label}
                {item.badge ? (
                  <span className="absolute top-1 right-3 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#FF5DA2] px-1 text-[9px] font-bold text-white">
                    {item.badge}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

export default DashboardShell;