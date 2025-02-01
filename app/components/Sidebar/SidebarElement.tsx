"use client";

import { Link } from "react-router";
import React from "react";
import { IconType } from "react-icons";

type SidebarElementProps = {
  isCollapsed: boolean;
  label: string;
  href: string;
  icon: IconType;
};

export default function SidebarElement({
  isCollapsed,
  label,
  href,
  icon: Icon,
}: SidebarElementProps) {
  return (
    <Link to={href} replace={true} viewTransition>
      <span className="my-1 flex w-full items-center rounded-lg bg-indigo-500 p-2 transition-colors duration-100 hover:bg-indigo-600 dark:bg-gray-800 dark:hover:bg-gray-700">
        <Icon size="24px" />
        {!isCollapsed && <span className="mx-3">{label}</span>}
      </span>
    </Link>
  );
}
