import { useThemeMode } from "flowbite-react";
import React from "react";
import type { IconType } from "react-icons";
import { HiChevronRight, HiOutlineLogout } from "react-icons/hi";
import { MdBrightnessAuto, MdBrightnessHigh, MdBrightnessLow } from "react-icons/md";
import { Link } from "react-router";
import { useAuth } from "~/app-state/useAuth";
import { roleToLabel } from "~/features/user/lib/roleToLabel";
import type { User } from "~/features/user/model";
import { getInitials } from "~/shared/lib/getInitials";

export type MorePageItem = {
  label: string;
  href: string;
  icon: IconType;
  badge?: number;
};

type Props = {
  itemsLabel: string;
  items: MorePageItem[];
};

const themeModes = [
  { value: "light", label: "Light", icon: MdBrightnessHigh },
  { value: "dark", label: "Dark", icon: MdBrightnessLow },
  { value: "auto", label: "Auto", icon: MdBrightnessAuto },
] as const;

export function MorePage({ itemsLabel, items }: Props) {
  const { user } = useAuth() as { user: User };
  const { mode, setMode } = useThemeMode();

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="flex items-center gap-4 px-1 py-1">
        <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-indigo-500 text-base font-bold text-white">
          {getInitials(user.name)}
        </span>
        <span className="min-w-0">
          <span className="block truncate text-2xl font-bold leading-tight text-gray-900 dark:text-white">
            {user.name}
          </span>
          <span className="block truncate text-sm text-gray-500 dark:text-gray-400">{roleToLabel(user.role)}</span>
        </span>
      </div>

      {items.length > 0 && (
        <section className="space-y-2">
          <h2 className="px-1 text-[11px] font-semibold uppercase tracking-wide text-gray-400">{itemsLabel}</h2>
          <div className="divide-y divide-gray-200 overflow-hidden rounded-2xl border border-gray-200 bg-white dark:divide-gray-800 dark:border-gray-800 dark:bg-gray-900">
            {items.map(({ label, href, icon: Icon, badge }) => (
              <Link
                key={href}
                to={href}
                viewTransition
                className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-indigo-50 active:bg-indigo-100 dark:hover:bg-gray-800 dark:active:bg-gray-700"
              >
                <Icon size={18} className="shrink-0 text-gray-500 dark:text-gray-400" aria-hidden />
                <span className="flex-1 text-sm font-medium text-gray-800 dark:text-gray-100">{label}</span>
                {typeof badge === "number" && badge > 0 && (
                  <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-500 px-1.5 text-xs font-bold text-white">
                    {badge}
                  </span>
                )}
                <HiChevronRight size={18} className="shrink-0 text-gray-300 dark:text-gray-600" aria-hidden />
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="space-y-2">
        <h2 className="px-1 text-[11px] font-semibold uppercase tracking-wide text-gray-400">Appearance</h2>
        <div className="grid grid-cols-3 gap-1 rounded-2xl border border-gray-200 bg-white p-1 dark:border-gray-800 dark:bg-gray-900">
          {themeModes.map(({ value, label, icon: Icon }) => {
            const isActive = mode === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => setMode(value)}
                aria-pressed={isActive}
                className={`flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-indigo-100 text-indigo-600 dark:bg-gray-800 dark:text-white"
                    : "text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800/60"
                }`}
              >
                <Icon size={16} aria-hidden />
                {label}
              </button>
            );
          })}
        </div>
      </section>

      <Link
        to="/sign-out"
        viewTransition
        className="flex items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white py-3.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 active:bg-red-100 dark:border-gray-800 dark:bg-gray-900 dark:text-red-400 dark:hover:bg-red-950/40"
      >
        <HiOutlineLogout size={18} aria-hidden />
        Sign out
      </Link>
    </div>
  );
}
