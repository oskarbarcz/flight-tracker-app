"use client";

import {
  Avatar,
  Dropdown,
  Navbar,
  ThemeMode,
  useThemeMode,
} from "flowbite-react";
import lightLogo from "~/assets/logo.light.svg";
import darkLogo from "~/assets/logo.dark.svg";
import { Link, useLocation } from "react-router";
import { useAuth } from "~/state/contexts/auth.context";
import { User } from "~/models/user.model";
import React from "react";

export function AppNavigation() {
  const { mode: currentMode, setMode } = useThemeMode();
  const location = useLocation();

  const { user } = useAuth() as { user: User };

  return (
    <Navbar fluid>
      <Navbar.Brand>
        <img
          src={lightLogo}
          className="mr-4 h-6 dark:hidden sm:h-9"
          alt="FlightModel Tracker Logo"
        />
        <img
          src={darkLogo}
          className="mr-4 hidden h-6 dark:block sm:h-9"
          alt="FlightModel Tracker Logo"
        />
        <span className="self-center whitespace-nowrap text-xl font-semibold text-gray-950 dark:text-white">
          Flight Tracker
        </span>
      </Navbar.Brand>
      <div className="flex md:order-2">
        <Dropdown
          arrowIcon={false}
          inline
          label={
            <Avatar
              alt="User settings"
              img="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
              rounded
            />
          }
        >
          <Dropdown.Header>
            <span className="block text-sm">{user.name}</span>
            <span className="block truncate text-xs font-medium text-gray-500">
              {user.email}
            </span>
          </Dropdown.Header>
          <Dropdown.Header>
            <span className="block text-xs">Theme</span>
            <span className="block">
              {["light", "dark", "auto"].map((mode, index) => {
                let classList = "truncate cursor-pointer text-xs";
                if (currentMode === mode) {
                  classList += " font-bold";
                }

                return (
                  <span
                    key={index}
                    onClick={() => setMode(mode as ThemeMode)}
                    className={classList}
                  >
                    {mode + " "}
                  </span>
                );
              })}
            </span>
            <span className="block truncate text-xs font-medium text-gray-500"></span>
          </Dropdown.Header>
          <Dropdown.Item>
            <Link to="/sign-out">Sign out</Link>
          </Dropdown.Item>
        </Dropdown>
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Navbar.Link as="span" href="/" active={location.pathname === "/"}>
          Home
        </Navbar.Link>

        {user.role === "operations" && (
          <Navbar.Link as="span" active={location.pathname === "/flights"}>
            <Link to="/flights">Flights</Link>
          </Navbar.Link>
        )}

        {user.role === "operations" && (
          <Navbar.Link as="span" active={location.pathname === "/airports"}>
            <Link to="/airports">Airports</Link>
          </Navbar.Link>
        )}

        {user.role === "operations" && (
          <Navbar.Link as="span" active={location.pathname === "/aircraft"}>
            <Link to="/aircraft">Aircraft</Link>
          </Navbar.Link>
        )}

        <Navbar.Link as="span" active={location.pathname === "/track"}>
          <Link to="/track/DLH415">Track flight</Link>
        </Navbar.Link>
        <Navbar.Link as="span" href="#">
          Flights history
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}
