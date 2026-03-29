import { Button, Navbar } from "flowbite-react";
import { useThemeMode } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { MdBrightnessAuto, MdBrightnessHigh, MdBrightnessLow } from "react-icons/md";
import { Link } from "react-router";
import logo from "~/assets/logo.svg";

type ThemeMode = "light" | "dark" | "auto";

function nextMode(mode: ThemeMode): ThemeMode {
  switch (mode) {
    case "light": return "dark";
    case "dark":  return "auto";
    case "auto":  return "light";
  }
}

function ThemeToggle() {
  const { mode, setMode } = useThemeMode();
  const Icon =
    mode === "light" ? MdBrightnessHigh :
    mode === "dark"  ? MdBrightnessLow  :
                       MdBrightnessAuto;

  return (
    <button
      type="button"
      title={`Switch theme (current: ${mode})`}
      onClick={() => setMode(nextMode(mode as ThemeMode))}
      className="p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
    >
      <Icon size={22} />
    </button>
  );
}

export function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <Navbar
      fluid
      className={`bg-white/80 dark:bg-gray-950/80 backdrop-blur-md sticky top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "border-b border-gray-200 dark:border-gray-800"
          : "border-b border-transparent"
      }`}
    >
      <Link to="/" className="flex items-center">
        <img src={logo} className="mr-3 h-6 sm:h-9" alt="Flight Tracker app logo" />
        <span className="self-center whitespace-nowrap text-xl font-bold text-indigo-500 dark:text-indigo-400">
          Flight Tracker
        </span>
      </Link>
      <div className="flex md:order-2 items-center gap-2">
        <ThemeToggle />
        <Button as={Link} to="/sign-in" color="indigo" className="font-bold">
          Sign In
        </Button>
      </div>
    </Navbar>
  );
}
