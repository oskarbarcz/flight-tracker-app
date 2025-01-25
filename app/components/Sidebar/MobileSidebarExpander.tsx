"use client";

import React from "react";
import { HiMenu } from "react-icons/hi";

type MobileSidebarExpanderProps = {
  handleMobileToggle: () => void;
};

export default function MobileSidebarExpander({
  handleMobileToggle,
}: MobileSidebarExpanderProps) {
  return (
    <button
      onClick={handleMobileToggle}
      className="my-1 items-center rounded-lg bg-gray-100 p-2 transition-colors duration-100 hover:bg-gray-200 active:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 dark:active:bg-gray-600"
    >
      <HiMenu
        size="24px"
        className={`text-gray-500 transition-transform duration-300`}
      />
    </button>
  );
}
