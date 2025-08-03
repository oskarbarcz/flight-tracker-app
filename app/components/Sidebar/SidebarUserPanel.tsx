"use client";

import React from "react";
import { useAuth } from "~/state/contexts/auth.context";
import { User, UserRole } from "~/models/user.model";
import { PiSignOutBold } from "react-icons/pi";
import { Link } from "react-router";

type SidebarUserPanelProps = {
  isCollapsed: boolean;
};

function roleToDescription(role: UserRole): string {
  switch (role) {
    case UserRole.Operations:
      return "Operations";
    case UserRole.Admin:
      return "Administrator";
    case UserRole.CabinCrew:
      return "Cabin crew";
  }
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
}

export default function SidebarUserPanel({
  isCollapsed,
}: SidebarUserPanelProps) {
  const { user } = useAuth() as { user: User };

  return (
    <div className="flex shrink-0 w-fit md:w-full items-center justify-center rounded-xl border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 p-2 duration-100">
      <div className="flex items-center justify-center rounded bg-indigo-500">
        <span
          className={`
            rounded-full font-bold text-white text-xs flex items-center justify-center
            ${isCollapsed ? "size-6" : "size-8"}
          `}
        >
          {getInitials(user.name)}
        </span>
      </div>
      {!isCollapsed && (
        <>
          <div className="mx-3">
            <span className="font-bold">{user.name}</span>
            <span className="block text-xs uppercase">
              {roleToDescription(user.role)}
            </span>
          </div>
          <Link
            to="/sign-out"
            replace
            viewTransition
            className="ms-auto flex size-8 cursor-pointer items-center justify-center rounded text-red-700 transition-colors duration-100 hover:bg-red-700 hover:text-white"
          >
            <PiSignOutBold />
          </Link>
        </>
      )}
    </div>
  );
}
