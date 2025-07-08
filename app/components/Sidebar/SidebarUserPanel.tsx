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
    <div className="flex w-full items-center rounded-3xl border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 p-2 duration-100">
      <div className="flex items-center justify-center rounded-full bg-indigo-500">
        <span className={`rounded-full text-white text-xs size-6 flex items-center justify-center`}>
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
            className="ms-auto flex size-10 cursor-pointer items-center justify-center rounded-full border-red-700 transition-colors duration-100 hover:bg-red-700 hover:text-white"
          >
            <PiSignOutBold />
          </Link>
        </>
      )}
    </div>
  );
}
