"use client";

import React from "react";
import { IconType } from "react-icons";
import { Link } from "react-router";

type SidebarElementProps = {
  isSelected: boolean;
  label: string;
  href: string;
  icon: IconType;
};

export default function SidebarElement({
  isSelected,
  label,
  href,
  icon: Icon,
}: SidebarElementProps) {
  if (isSelected) {
    return (
      <Link
        to={href}
        className="text-indigo-500 bg-indigo-100 dark:bg-indigo-900/30 hover:bg-indigo-200 dark:hover:bg-indigo-900/50 items-center cursor-pointer flex gap-3 py-2 px-3 rounded-xl ease-in-out transition-colors"
        replace={true}
        viewTransition
      >
        <Icon size={20} />
        <span>{label}</span>
      </Link>
    );
  }

  return (
    <Link
      to={href}
      className="text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 items-center cursor-pointer flex gap-3 py-2 px-3 rounded-xl ease-in-out transition-colors"
      replace={true}
      viewTransition
    >
      <Icon size={20} />
      <span>{label}</span>
    </Link>
  );
}
