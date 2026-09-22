"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LucideIcon, LogOut, Calendar, PanelLeftClose, PanelLeftOpen } from "lucide-react";
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

export default function DashboardShell({
  navItems,
  roleLabel,
  children,
}: DashboardShellProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen w-full bg-[#F8F9FD] text-slate-800 antialiased selection:bg-[#6367FF]/20 selection:text-[#6367FF]">
      {/* =========================================================================
          1. SIDEBAR DESKTOP (Fixed, Statis, Collapsible)
      ========================================================================= */}
      <aside
        className={cn(
          "hidden md:flex fixed inset-y-0 left-0 z-30 flex-col bg-navy-gradient border-r border-white/5 shadow-2xl transition-all duration-300 ease-in-out h-screen",
          isCollapsed ? "w-20" : "w-64"
        )}
      >
        {/* Brand Header: Logo & Toggle */}
        <div
          className={cn(
            "flex border-b border-white/5 transition-all duration-300 shrink-0",
            isCollapsed
              ? "flex-col items-center justify-center gap-3 px-2 py-4"
              : "items-center justify-between px-4 py-6"
          )}
        >
          <div className={cn("flex items-center gap-3 overflow-hidden", isCollapsed && "justify-center")}>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FF8FC2] to-[#FF5DA2] font-display text-sm font-bold text-white shadow-lg shadow-[#FF5DA2]/30">
              CW
            </div>
            {!isCollapsed && (
              <div className="transition-opacity duration-200 truncate">
                <span className="font-display text-base font-bold text-white tracking-wide block leading-none">
                  Co-Work
                </span>
                <p className="text-[11px] font-medium text-slate-300/80 mt-1 truncate">
                  {roleLabel === "Member" ? "Member Space" : "Admin Space"}
                </p>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
            title={isCollapsed ? "Buka Sidebar" : "Ciutkan Sidebar"}
          >
            {isCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
          </button>
        </div>

        {/* Menu Navigasi Desktop */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-1.5 no-scrollbar">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                title={isCollapsed ? item.label : undefined}
                className={cn(
                  "relative flex items-center rounded-2xl py-3 font-semibold transition-all duration-200",
                  isCollapsed ? "justify-center px-0" : "justify-between px-4 text-sm",
                  isActive
                    ? "bg-white text-slate-900 shadow-md shadow-black/10 font-bold"
                    : "text-slate-300/80 hover:bg-white/10 hover:text-white"
                )}
              >
                <div className="flex items-center gap-3.5">
                  <Icon
                    size={20}
                    className={cn(
                      "shrink-0 transition-colors",
                      isActive ? "text-[#FF5DA2]" : "text-slate-400"
                    )}
                  />
                  {!isCollapsed && <span>{item.label}</span>}
                </div>

                {!isCollapsed && item.badge ? (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#FF5DA2] px-1.5 text-[11px] font-bold text-white shadow-sm">
                    {item.badge}
                  </span>
                ) : null}

                {isCollapsed && item.badge ? (
                  <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-[#FF5DA2] ring-2 ring-slate-900" />
                ) : null}
              </Link>
            );
          })}
        </nav>

        {/* Footer User & Logout Desktop */}
        <div className="p-3 border-t border-white/10 shrink-0 bg-black/15">
          {!isCollapsed ? (
            <>
              <div className="mb-2 flex items-center gap-3 rounded-2xl bg-white/5 p-3 backdrop-blur-sm border border-white/5">
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
                type="button"
                onClick={logout}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-xs font-semibold text-rose-300 transition-colors hover:bg-rose-500/10 hover:text-rose-200"
              >
                <LogOut size={16} />
                <span>Keluar</span>
              </button>
            </>
          ) : (
            /* Tampilan saat Collapsed: Avatar Profil + Tombol Logout Berdiri Sendiri */
            <div className="flex flex-col items-center gap-3 py-1">
              <div
                title={`${user?.nama ?? "Pengguna"} (@${user?.username ?? "user"})`}
                className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6367FF] to-[#8494FF] text-sm font-bold text-white shadow-md cursor-default shrink-0"
              >
                {getInitial(user?.nama)}
              </div>
              <button
                type="button"
                onClick={logout}
                title="Keluar (Logout)"
                className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 hover:text-rose-100 transition-all border border-rose-500/20 shrink-0"
              >
                <LogOut size={18} />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* =========================================================================
          2. MAIN CONTENT AREA
      ========================================================================= */}
      <div
        className={cn(
          "flex flex-1 flex-col transition-all duration-300 ease-in-out min-w-0 w-full",
          isCollapsed ? "md:pl-20" : "md:pl-64"
        )}
      >
        {/* Top Header - Desktop Bar */}
        <header className="hidden md:flex h-16 items-center justify-end px-8 py-4 bg-white/70 backdrop-blur-md border-b border-slate-100 sticky top-0 z-20">
          <div className="flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-xs font-medium text-slate-600 border border-slate-200/80 shadow-sm">
            <Calendar size={13} className="text-[#FF5DA2]" />
            <span>Selasa, 22 Sep 2026</span>
          </div>
        </header>

        {/* Top Header - Mobile Bar */}
        <header className="flex md:hidden items-center justify-between px-4 py-3.5 bg-white border-b border-slate-100 sticky top-0 z-20 shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF8FC2] to-[#FF5DA2] text-xs font-bold text-white shadow-sm">
              CW
            </div>
            <div>
              <span className="font-display text-sm font-bold text-slate-900 leading-tight block">
                Co-Work
              </span>
              <span className="text-[10px] font-semibold text-slate-400">
                {roleLabel === "Member" ? "Member Portal" : "Admin Space"}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={logout}
            aria-label="Keluar"
            className="flex items-center gap-1.5 rounded-xl bg-rose-50 px-2.5 py-1.5 text-xs font-semibold text-rose-500 hover:bg-rose-100 transition-colors"
          >
            <LogOut size={14} />
            <span className="text-[11px]">Keluar</span>
          </button>
        </header>

        {/* Main Page View */}
        <main className="flex-1 px-4 py-5 pb-28 md:px-8 md:py-8 md:pb-12">
          {children}
        </main>
      </div>

      {/* =========================================================================
          3. BOTTOM NAVIGATION - MOBILE ONLY
      ========================================================================= */}
      <nav className="fixed inset-x-0 bottom-0 z-50 flex md:hidden items-center justify-around border-t border-slate-200/80 bg-white/95 px-2 py-2 backdrop-blur-lg shadow-lg">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex flex-1 flex-col items-center justify-center gap-1 rounded-2xl py-1.5 text-[10px] font-semibold transition-all duration-200",
                isActive
                  ? "text-[#6367FF] font-bold"
                  : "text-slate-500 hover:text-slate-900"
              )}
            >
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-xl transition-all",
                  isActive ? "bg-[#EEEFFF] text-[#6367FF]" : "text-slate-500"
                )}
              >
                <Icon size={18} />
              </div>
              <span className="truncate max-w-[64px]">{item.label}</span>

              {item.badge ? (
                <span className="absolute top-0.5 right-3 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#FF5DA2] px-1 text-[9px] font-bold text-white shadow-sm">
                  {item.badge}
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}