"use client";

import React from "react";
import { User, UserRole } from "~/models/user.model";
import { useAuth } from "~/state/contexts/session/auth.context";

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

export default function SidebarUserSection() {
  const { user } = useAuth() as { user: User };

  return (
    <section className="flex gap-3 shrink-0 w-fit items-center justify-center rounded-xl p-6">
      <span className="flex items-center justify-center rounded-full font-bold text-lg text-indigo-500 bg-indigo-100 dark:bg-indigo-950 size-12">
        {getInitials(user.name)}
      </span>
      <div>
        <span className="font-bold text-gray-900 dark:text-white">
          {user.name}
        </span>
        <span className="block text-sm text-gray-500">
          {roleToDescription(user.role)}
        </span>
      </div>
    </section>
  );
}
