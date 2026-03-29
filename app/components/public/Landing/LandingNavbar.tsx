import { Button, Navbar } from "flowbite-react";
import React from "react";
import { Link } from "react-router";
import logo from "~/assets/logo.svg";

export function LandingNavbar() {
  return (
    <Navbar
      fluid
      className="bg-white/80 dark:bg-gray-950/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800"
    >
      <Link to="/" className="flex items-center">
        <img src={logo} className="mr-3 h-6 sm:h-9" alt="Flight Tracker app logo" />
        <span className="self-center whitespace-nowrap text-xl font-bold text-indigo-500 dark:text-indigo-400">
          Flight Tracker
        </span>
      </Link>
      <div className="flex md:order-2">
        <Button as={Link} to="/sign-in" color="indigo" className="font-bold">
          Sign In
        </Button>
      </div>
    </Navbar>
  );
}
