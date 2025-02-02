"use client";

import { useAuth } from "~/state/contexts/auth.context";
import { User } from "~/models/user.model";
import React from "react";

const getInitials = (name: string) => {
  return name
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
};

export default function PilotInformationBox() {
  const { user } = useAuth() as { user: User };
  return (
    <section className="flex items-center rounded-lg bg-gray-100 p-4 shadow dark:bg-gray-800">
      <div className="mr-4 inline-flex size-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-600">
        <span className="text-gray-600 dark:text-gray-300">
          {getInitials(user.name)}
        </span>
      </div>
      <div>
        <h2 className="text-xl font-bold dark:text-gray-300">{user.name}</h2>
        <span className="text-sm text-gray-500">{user.email}</span>
      </div>
    </section>
  );
}
