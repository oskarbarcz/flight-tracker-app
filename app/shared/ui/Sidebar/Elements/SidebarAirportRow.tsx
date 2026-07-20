import React from "react";
import { Link, useLocation } from "react-router";

type Props = {
  id: string;
  iataCode: string;
  name: string;
};

export function SidebarAirportRow({ id, iataCode, name }: Props) {
  const isActive = useLocation().pathname.startsWith(`/airports-library/${id}`);

  return (
    <Link
      to={`/airports-library/${id}`}
      replace
      viewTransition
      className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm ${
        isActive
          ? "bg-indigo-100 text-indigo-600 dark:bg-gray-800 dark:text-white"
          : "text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
      }`}
    >
      <span className="shrink-0 font-mono font-semibold">{iataCode}</span>
      <span className="min-w-0 truncate">{name}</span>
    </Link>
  );
}
