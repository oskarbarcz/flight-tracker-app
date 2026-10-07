import React from "react";
import { LuLogOut, LuMoon, LuSun, LuSunMoon } from "react-icons/lu";
import { Link } from "react-router";
import { useAuth } from "~/app-state/useAuth";
import { roleToLabel } from "~/features/user/lib/roleToLabel";
import type { User } from "~/features/user/model";
import { type ThemeMode, useThemeSwitch } from "~/shared/hooks/useThemeSwitch";
import { getInitials } from "~/shared/lib/getInitials";
import { IconSwap } from "~/shared/ui/Display/IconSwap";

const THEME_ICONS: Record<ThemeMode, React.ReactNode> = {
  light: <LuSun size={18} />,
  dark: <LuMoon size={18} />,
  auto: <LuSunMoon size={18} />,
};

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

export function TopBarUserTile() {
  const { user } = useAuth() as { user: User };
  const { mode, setMode } = useThemeSwitch();

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-3 px-3 py-2">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-fuchsia-600 text-2xs font-bold text-white">
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
        className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-left text-sm text-gray-500 dark:text-gray-400 transition-[color,background-color,scale] duration-150 ease-out hover:bg-indigo-50 hover:text-indigo-600 active:scale-[0.96] dark:hover:bg-gray-800 dark:hover:text-white"
      >
        <IconSwap current={mode} icons={THEME_ICONS} />
        <span className="capitalize">{mode} mode</span>
      </button>
      <Link
        to="/sign-out"
        viewTransition
        className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-gray-500 dark:text-gray-400 transition-[color,background-color,scale] duration-150 ease-out hover:bg-red-50 hover:text-red-600 active:scale-[0.96] dark:hover:bg-red-950/40 dark:hover:text-red-400"
      >
        <LuLogOut size={18} />
        Sign out
      </Link>
    </div>
  );
}
