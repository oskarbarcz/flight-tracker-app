import React from "react";
import { Link } from "react-router";
import logo from "~/assets/logo.svg";

export function TopBarLogo() {
  return (
    <Link to="/dashboard" replace className="flex items-center">
      <img src={logo} className="h-5" alt="Flight Tracker app logo" />
      <span className="text-lg text-indigo-500 ms-2 font-bold">Flight Tracker</span>
    </Link>
  );
}
