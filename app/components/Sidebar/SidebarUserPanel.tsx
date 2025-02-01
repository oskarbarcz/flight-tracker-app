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
    <div className="my-1 flex w-full items-center rounded-lg bg-gray-100 p-2 text-gray-900 duration-100  dark:bg-gray-800 dark:text-gray-200">
      <div className="flex items-center justify-center rounded-full bg-gray-300 dark:bg-gray-600">
        <span
          className={`rounded-full text-gray-500 dark:text-gray-300 ${isCollapsed ? "p-1 text-xs" : "p-2 text-base"}`}
        >
          {getInitials(user.name)}
        </span>
      </div>
      {!isCollapsed && (
        <>
          <div className="mx-3">
            <span>{user.name}</span>
            <span className="block text-xs font-bold uppercase text-gray-500">
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
