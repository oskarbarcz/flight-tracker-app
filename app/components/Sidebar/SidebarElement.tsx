"use client";

import { Link } from "react-router";
import React from "react";
import { IconType } from "react-icons";

type SidebarElementProps = {
  isCollapsed: boolean;
  isSelected: boolean;
  label: string;
  href: string;
  icon: IconType;
};

export default function SidebarElement({
  isCollapsed,
  isSelected,
  label,
  href,
  icon: Icon,
}: SidebarElementProps) {
  return (
    <Link to={href} replace={true} viewTransition>
      <span
        className={`flex items-center rounded-3xl my-1 transition-colors duration-200 ease-in-out
         ${isSelected ? "text-indigo-500 cursor-default" : "text-gray-500 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"}
         ${isCollapsed ? "justify-center p-2" : "px-4 py-2"}
      `}
      >
        <Icon size="20px" />
        <span
          className={`
          ms-3
          ${isSelected ? "text-indigo-500" : "text-gray-500"}
          ${isCollapsed ? "hidden" : ""}
        `}
        >
          {label}
        </span>
      </span>
    </Link>
  );
}
