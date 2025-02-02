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
      className="my-1 hidden items-center rounded-lg bg-indigo-500 p-2 transition-colors duration-100 hover:bg-indigo-400 md:flex"
    >
      <HiChevronDoubleLeft
        size="24px"
        className={`transition-transform duration-300 ${isCollapsed ? "rotate-180" : ""}`}
      />
    </button>
  );
}
