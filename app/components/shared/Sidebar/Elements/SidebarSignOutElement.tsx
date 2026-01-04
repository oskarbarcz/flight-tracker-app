"use client";

import React from "react";
import { FaSignOutAlt } from "react-icons/fa";
import { Link } from "react-router";

export default function SidebarSignOutElement() {
  return (
    <Link
      to="/sign-out"
      className="text-gray-500 hover:text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 items-center cursor-pointer flex gap-3 py-2 px-3 rounded-xl ease-in-out transition-colors"
      replace={true}
      viewTransition
    >
      <FaSignOutAlt size={20} />
      <span>Sign out</span>
    </Link>
  );
}
