"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LucideIcon, LogOut } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useAuth } from "@/lib/context/AuthContext";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

interface DashboardShellProps {
  navItems: NavItem[];
  roleLabel: string;
  children: ReactNode;
}

function DashboardShell({ navItems, roleLabel, children }: DashboardShellProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <div className="flex min-h-screen bg-surface-50">
      {/* Sidebar - desktop */}
      <aside className="hidden w-64 shrink-0 flex-col bg-navy-gradient md:flex">
        <div className="px-6 py-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 font-display text-sm font-bold text-white ring-1 ring-white/20">
              CW
            </div>
            <span className="font-display text-lg font-semibold text-white">Co-Work</span>
          </div>
          <p className="mt-1 text-xs text-blue-100/60">{roleLabel}</p>
        </div>

        <nav className="flex flex-1 flex-col gap-1 px-3">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-full px-4 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-white text-navy-900 shadow-sm"
                    : "text-blue-100/80 hover:bg-white/10 hover:text-white"
                )}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3">
          <div className="mb-2 rounded-2xl bg-white/5 px-4 py-3">
            <p className="truncate text-sm font-medium text-white">
              {user?.nama ?? "Pengguna"}
            </p>
            <p className="truncate text-xs text-blue-100/60">{user?.username}</p>
          </div>
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-full px-4 py-2.5 text-sm font-medium text-red-200 hover:bg-white/10"
          >
            <LogOut size={18} />
            Keluar
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        {/* Topbar - mobile */}
        <header className="flex items-center justify-between bg-navy-gradient px-4 py-4 md:hidden">
          <div>
            <p className="font-display text-base font-semibold text-white">Co-Work</p>
            <p className="text-xs text-blue-100/60">{roleLabel}</p>
          </div>
          <button
            onClick={logout}
            aria-label="Keluar"
            className="rounded-full bg-white/10 p-2.5 text-red-200 hover:bg-white/20"
          >
            <LogOut size={18} />
          </button>
        </header>

        <main className="flex-1 px-4 py-6 pb-24 md:px-8 md:py-8 md:pb-8">{children}</main>

        {/* Bottom nav - mobile */}
        <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-surface-200 bg-white/95 px-2 py-2 backdrop-blur md:hidden">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "mx-0.5 flex flex-1 flex-col items-center gap-1 rounded-2xl py-2 text-xs font-medium transition-colors",
                  isActive ? "bg-brand-50 text-brand-600" : "text-ink-600"
                )}
              >
                <Icon size={20} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

export default DashboardShell;