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
    <Link to={href} replace={true} className="shrink-0" viewTransition>
      <span
        className={`flex flex-col md:flex-row md:min-w-fit items-center rounded-3xl my-1 transition-colors duration-200 ease-in-out
         ${isSelected ? "text-indigo-500 cursor-default" : "text-gray-500 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"}
         ${isCollapsed ? "justify-center p-2 md:p-2" : " p-2 md:px-4 md:py-2"}
      `}
      >
        <Icon size={20} className="hidden md:block" />
        <Icon size={28} className="block md:hidden" />
        <span
          className={`
          text-xs md:text-base text-center md:text-start md:ms-3 mt-2 md:mt-0
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
