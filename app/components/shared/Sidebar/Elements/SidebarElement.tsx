"use client";

import React from "react";
import type { IconType } from "react-icons";
import { Link } from "react-router";

type Props = {
  isSelected: boolean;
  label: string;
  href: string;
  icon: IconType;
};

export function SidebarElement({ isSelected, label, href, icon: Icon }: Props) {
  if (isSelected) {
    return (
      <Link
        to={href}
        className="text-indigo-500 bg-indigo-100 dark:bg-indigo-900/30 hover:bg-indigo-200 dark:hover:bg-indigo-900/50 active:bg-indigo-300 dark:active:bg-indigo-900/60 active:scale-[0.97] items-center cursor-pointer flex gap-3 py-2 px-3 rounded-xl text-sm ease-in-out transition duration-75"
        replace
        viewTransition
      >
        <Icon size={18} />
        <span>{label}</span>
      </Link>
    );
  }

  return (
    <Link
      to={href}
      className="text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-800 active:bg-gray-300 dark:active:bg-gray-700 active:scale-[0.97] items-center cursor-pointer flex gap-3 py-2 px-3 rounded-xl text-sm ease-in-out transition duration-75"
      replace
      viewTransition
    >
      <Icon size={18} />
      <span>{label}</span>
    </Link>
  );
}
