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
  if (isCollapsed) {
    return (
      <Link to={href} replace={true} viewTransition>
        <span className="flex justify-center items-center rounded-3xl text-indigo-500 hover:bg-gray-100 dark:hover:bg-gray-700 p-2 transition-colors duration-100 ease-in-out">
          <Icon size="24px" />
        </span>
      </Link>
    );
  }

  return (
    <Link to={href} replace={true} viewTransition>
      <span className="flex items-center rounded-3xl text-indigo-500 hover:bg-gray-100 dark:hover:bg-gray-700 p-2 transition-colors duration-100 ease-in-out">
        <Icon size="24px" />
        <span className="mx-3">{label}</span>
      </span>
    </Link>
  );
}
