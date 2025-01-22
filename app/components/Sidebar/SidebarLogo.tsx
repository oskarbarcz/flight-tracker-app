"use client"

import {Link} from "react-router";
import React from "react";
import logo from "~/assets/logo.svg";

type SidebarLogoProps = {
  isCollapsed: boolean;
}

export default function SidebarLogo({isCollapsed}: SidebarLogoProps) {
  return (
    <Link to="/" replace={true} className="mb-4 flex items-center">
      <img src={logo} className="ms-1 h-8" alt="Flight Tracker app logo"/>
      {!isCollapsed && <span className="ms-3 text-xl font-bold text-gray-700">Flight Tracker</span>}
    </Link>
  );
}
