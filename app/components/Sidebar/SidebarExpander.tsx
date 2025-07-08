"use client";

import React from "react";
import { HiChevronDoubleLeft } from "react-icons/hi";

type SidebarExpanderProps = {
  handleDesktopCollapse: () => void;
  isCollapsed: boolean;
};

export default function SidebarExpander({
  handleDesktopCollapse,
  isCollapsed,
}: SidebarExpanderProps) {
  return (
    <button
      onClick={handleDesktopCollapse}
      className="hidden w-min cursor-pointer items-center text-indigo-500 rounded-3xl p-2 transition-colors duration-100 hover:bg-gray-100 dark:hover:bg-gray-700 md:flex"
    >
      <HiChevronDoubleLeft
        size="24px"
        className={`transition-transform duration-300 ${isCollapsed ? "rotate-180" : ""}`}
      />
    </button>
  );
}
