"use client";

import { Link } from "react-router";
import React from "react";
import logo from "~/assets/logo.white.svg";

type SidebarLogoProps = {
  isCollapsed: boolean;
};

export default function OldSidebarLogo({ isCollapsed }: SidebarLogoProps) {
  return (
    <Link to="/" replace={true} className="mb-3 mt-1 flex items-center">
      <img src={logo} className="ms-1 h-8" alt="FlightTracker app logo" />
      {!isCollapsed && (
        <span className="ms-3 text-xl font-bold">FlightTracker</span>
      )}
    </Link>
  );
}
