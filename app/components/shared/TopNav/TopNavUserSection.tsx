import React from "react";
import { HiOutlineLogout } from "react-icons/hi";
import { Link } from "react-router";
import { getInitials } from "~/functions/getInitials";
import { type User, UserRole } from "~/models/user.model";
import { useAuth } from "~/state/api/context/useAuth";

function roleToTopNavLabel(role: UserRole): string {
  switch (role) {
    case UserRole.Operations:
      return "Dispatcher · OCC";
    case UserRole.Admin:
      return "Administrator";
    case UserRole.CabinCrew:
      return "Cabin crew";
  }
}

export function TopNavUserSection() {
  const { user } = useAuth() as { user: User };

  return (
    <div className="relative group">
      <button
        type="button"
        aria-haspopup="menu"
        className="relative z-10 w-full flex items-center gap-2.5 shrink-0 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 pl-1.5 pr-4 py-1.5 select-none cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 group-hover:rounded-b-none group-focus-within:rounded-b-none group-hover:border-b-transparent group-focus-within:border-b-transparent group-hover:shadow-lg group-focus-within:shadow-lg transition-[border-radius,border-color,box-shadow] duration-150"
      >
        <span className="flex items-center justify-center rounded-md size-8 m-[3px] font-bold text-xs text-white bg-gradient-to-br from-indigo-500 to-fuchsia-500 shadow-sm">
          {getInitials(user.name)}
        </span>
        <div className="hidden sm:flex flex-col leading-tight text-left">
          <span className="font-semibold text-sm text-gray-900 dark:text-white">{user.name}</span>
          <span className="text-xs text-gray-500">{roleToTopNavLabel(user.role)}</span>
        </div>
      </button>
      <div className="absolute right-0 left-0 top-full z-20 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-opacity duration-150">
        <div className="rounded-b-xl border border-t-0 border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-lg overflow-hidden py-1">
          <Link
            to="/sign-out"
            viewTransition
            className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-red-50 dark:hover:bg-red-950/40 hover:text-red-600 dark:hover:text-red-400 transition-colors"
          >
            <HiOutlineLogout className="text-base" />
            Sign out
          </Link>
        </div>
      </div>
    </div>
  );
}
