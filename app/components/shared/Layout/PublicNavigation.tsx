"use client";

import { Navbar, NavbarBrand, NavbarCollapse, NavbarLink, NavbarToggle } from "flowbite-react";
import { Link } from "react-router";
import logo from "~/assets/logo.svg";

export default function PublicNavigation() {
  return (
    <div className="py-3 px-4 md:px-8 w-full">
      <div className="max-w-7xl mx-auto">
        <Navbar fluid rounded className="!bg-transparent !p-0 dark:!bg-transparent">
          <NavbarBrand as={Link} to="/live-tracking">
            <img src={logo} className="h-6 mr-2" alt="Flight Tracker app logo" />
            <span className="text-xl font-bold text-indigo-500 dark:text-indigo-400">
              Flight Tracker
            </span>
          </NavbarBrand>
          <NavbarToggle />
          <NavbarCollapse>
            <NavbarLink
              as={Link}
              to="/live-tracking"
              className="text-gray-700 dark:text-gray-300 hover:text-indigo-500 dark:hover:text-indigo-400"
            >
              Live Tracking
            </NavbarLink>
          </NavbarCollapse>
        </Navbar>
      </div>
    </div>
  );
}
