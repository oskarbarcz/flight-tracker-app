import { useThemeMode } from "flowbite-react";
import React from "react";
import type { IconType } from "react-icons";
import { HiOutlineLogout } from "react-icons/hi";
import { MdBrightnessAuto, MdBrightnessHigh, MdBrightnessLow } from "react-icons/md";
import { Link } from "react-router";
import { useAuth } from "~/app-state/useAuth";
import { type User, UserRole } from "~/features/user/model";
import { getInitials } from "~/shared/lib/getInitials";

type ThemeMode = "light" | "dark" | "auto";

function nextMode(mode: ThemeMode): ThemeMode {
  switch (mode) {
    case "light":
      return "dark";
    case "dark":
      return "auto";
    case "auto":
      return "light";
  }
}

function getIconForMode(mode: ThemeMode): IconType {
  switch (mode) {
    case "light":
      return MdBrightnessHigh;
    case "dark":
      return MdBrightnessLow;
    case "auto":
      return MdBrightnessAuto;
  }
}

function roleToLabel(role: UserRole): string {
  switch (role) {
    case UserRole.Operations:
      return "Dispatcher · OCC";
    case UserRole.Admin:
      return "Administrator";
    case UserRole.CabinCrew:
      return "Cabin crew";
  }
}

export function TopBarUserTile() {
  const { user } = useAuth() as { user: User };
  const { mode, setMode } = useThemeMode();
  const ThemeIcon = getIconForMode(mode);

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-3 px-3 py-2">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-[11px] font-bold text-white shadow-sm">
          {getInitials(user.name)}
        </span>
        <span className="min-w-0">
          <span className="block truncate text-sm font-semibold leading-tight text-gray-900 dark:text-white">
            {user.name}
          </span>
          <span className="block truncate text-xs text-gray-500 dark:text-gray-400">{roleToLabel(user.role)}</span>
        </span>
      </div>
      <button
        type="button"
        onClick={() => setMode(nextMode(mode))}
        className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-left text-sm text-gray-500 transition duration-75 ease-in-out hover:bg-indigo-50 hover:text-indigo-600 active:scale-[0.97] dark:hover:bg-gray-800 dark:hover:text-white"
      >
        <ThemeIcon size={18} />
        <span className="capitalize">{mode} mode</span>
      </button>
      <Link
        to="/sign-out"
        viewTransition
        className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-gray-500 transition duration-75 ease-in-out hover:bg-red-50 hover:text-red-600 active:scale-[0.97] dark:hover:bg-red-950/40 dark:hover:text-red-400"
      >
        <HiOutlineLogout size={18} />
        Sign out
      </Link>
    </div>
  );
}
