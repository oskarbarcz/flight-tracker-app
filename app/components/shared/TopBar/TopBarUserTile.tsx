import { useThemeMode } from "flowbite-react";
import React, { useEffect, useRef, useState } from "react";
import type { IconType } from "react-icons";
import { HiOutlineLogout } from "react-icons/hi";
import { MdBrightnessAuto, MdBrightnessHigh, MdBrightnessLow } from "react-icons/md";
import { Link } from "react-router";
import { getInitials } from "~/functions/getInitials";
import { type User, UserRole } from "~/models/user.model";
import { useAuth } from "~/state/api/context/useAuth";

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

const BORDER = "border-gray-200/60 dark:border-gray-800/60";

export function TopBarUserTile() {
  const { user } = useAuth() as { user: User };
  const { mode, setMode } = useThemeMode();
  const ThemeIcon = getIconForMode(mode);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const openState = open ? "shadow-md rounded-b-none border-b-transparent" : "";
  const menuState = open ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-1";

  return (
    <div ref={containerRef} className="relative group">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className={`relative z-10 w-full flex items-center gap-2.5 shrink-0 rounded-2xl border ${BORDER} bg-white dark:bg-gray-950 pl-3 pr-6 py-1.5 select-none cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 group-hover:shadow-md group-hover:rounded-b-none group-hover:border-b-transparent ${openState} transition-[border-radius,border-color,box-shadow] duration-200 ease-out`}
      >
        <span className="flex items-center justify-center rounded-full size-7 font-bold text-[10px] text-white bg-gradient-to-br from-indigo-500 to-fuchsia-500 shadow-sm">
          {getInitials(user.name)}
        </span>
        <span className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">{user.name}</span>
      </button>
      <div
        className={`absolute right-0 left-0 top-full z-20 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 ${menuState} transition-[opacity,transform] duration-200 ease-out`}
      >
        <div
          className={`rounded-b-2xl border border-t-0 ${BORDER} bg-white dark:bg-gray-950 shadow-md overflow-hidden pb-1`}
        >
          <div className={`px-4 py-2 border-b ${BORDER} text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap`}>
            {roleToLabel(user.role)}
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setMode(nextMode(mode));
            }}
            className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left cursor-pointer whitespace-nowrap"
          >
            <ThemeIcon className="text-base" />
            <span className="capitalize">{mode} mode</span>
          </button>
          <Link
            to="/sign-out"
            viewTransition
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-red-50 dark:hover:bg-red-950/40 hover:text-red-600 dark:hover:text-red-400 transition-colors whitespace-nowrap"
          >
            <HiOutlineLogout className="text-base" />
            Sign out
          </Link>
        </div>
      </div>
    </div>
  );
}
