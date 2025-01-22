"use client"

import React from "react";
import {HiChevronDoubleLeft} from "react-icons/hi";
import {Button} from "flowbite-react";
import {Link} from "react-router";

type SidebarExpanderProps = {
  handleDesktopCollapse: () => void,
  isCollapsed: boolean
}

export default function SidebarExpander({handleDesktopCollapse, isCollapsed}: SidebarExpanderProps) {
  return (
    <button
      onClick={handleDesktopCollapse}
      className="hidden items-center rounded-lg bg-gray-100 p-2 text-gray-900 transition-colors duration-100 hover:bg-gray-200 active:bg-gray-300 md:flex"
    >
      <HiChevronDoubleLeft size="24px" className={`text-gray-500 transition-transform duration-300 ${isCollapsed ? "rotate-180" : ""}`}/>
    </button>
  );
}
