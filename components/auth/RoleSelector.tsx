import type { Role } from "@/lib/types/auth";
import { cn } from "@/lib/utils/cn";

export const ROLE_TABS: { label: string; value: Role }[] = [
  { label: "Member", value: "member" },
  { label: "Admin Space", value: "admin_space" },
];

interface RoleSelectorProps {
  selectedRole: Role;
  onSelectRole: (role: Role) => void;
}

export default function RoleSelector({
  selectedRole,
  onSelectRole,
}: RoleSelectorProps) {
  return (
    <div className="mb-6 flex rounded-full bg-surface-100 p-1">
      {ROLE_TABS.map((tab) => (
        <button
          key={tab.value}
          type="button"
          onClick={() => onSelectRole(tab.value)}
          className={cn(
            "flex-1 rounded-full py-2 text-sm font-medium transition-colors",
            selectedRole === tab.value
              ? "bg-white text-brand-700 shadow-sm"
              : "text-ink-600 hover:text-ink-950"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
