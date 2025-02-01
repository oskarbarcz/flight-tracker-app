"use client";

import { Link } from "react-router";
import React from "react";
import logo from "~/assets/logo.white.svg";

type SidebarLogoProps = {
  isCollapsed: boolean;
};

export default function SidebarLogo({ isCollapsed }: SidebarLogoProps) {
  return (
    <Link to="/" replace={true} className="mb-3 mt-1 flex items-center">
      <img src={logo} className="ms-1 h-8" alt="Flight Tracker app logo" />
      {!isCollapsed && (
        <span className="ms-3 text-xl font-bold text-white dark:text-gray-200">
          Flight Tracker
        </span>
      )}
    </Link>
  );
}
