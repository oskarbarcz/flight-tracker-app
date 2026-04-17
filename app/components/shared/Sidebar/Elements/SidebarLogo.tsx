"use client";

import React from "react";
import { Link } from "react-router";
import logo from "~/assets/logo.svg";

export function SidebarLogo() {
  return (
    <Link to="/dashboard" replace className="flex justify-center items-center py-2 md:py-6">
      <img src={logo} className="h-7" alt="Flight Tracker app logo" />
      <span className="text-2xl text-indigo-500 ms-2 font-bold">Flight Tracker</span>
    </Link>
  );
}
