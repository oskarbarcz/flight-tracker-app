"use client";

import { Link } from "react-router";
import React from "react";
import { IconType } from "react-icons";

type SidebarUserPanelProps = {
  isCollapsed: boolean;
};

export default function SidebarUserPanel({
  isCollapsed,
}: SidebarUserPanelProps) {
  return (
    <span className="my-1 flex w-full items-center rounded-lg bg-gray-100 p-2 text-gray-900 transition-colors duration-100 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700">
      ICON
      {!isCollapsed && <span className="mx-3">name</span>}
    </span>
  );
}
