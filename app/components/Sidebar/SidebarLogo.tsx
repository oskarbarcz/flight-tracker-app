"use client";

import { Link } from "react-router";
import React from "react";
import logo from "~/assets/logo.svg";

type SidebarLogoProps = {
  isCollapsed: boolean;
};

export default function SidebarLogo({ isCollapsed }: SidebarLogoProps) {
  return (
    <Link to="/" replace={true} className="mx-auto mb-2 p-1 flex items-center">
      <img src={logo} className="h-8" alt="FlightTracker app logo" />
      {!isCollapsed && (
        <span className="text-2xl text-indigo-500 ms-2 font-bold">
          FlightTracker
        </span>
      )}
    </Link>
  );
}
