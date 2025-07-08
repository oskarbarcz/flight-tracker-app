"use client";

import logo from "~/assets/logo.svg";
import logoWhite from "~/assets/logo.white.svg";

export default function Splash() {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-indigo-50 dark:bg-gray-900">
      <div className="text-center animate-pulse">
        <img
          src={logo}
          alt="FLightTracker app logo"
          className="mx-auto mb-4 size-14 md:mb-8 md:size-24 dark:hidden"
        />
        <img
          src={logoWhite}
          alt="FLightTracker app logo"
          className="hidden dark:block mx-auto mb-4 size-14 md:mb-8 md:size-24"
        />
        <h1 className="text-2xl font-bold text-indigo-500 dark:text-white md:text-4xl">
          FlightTracker
        </h1>
      </div>
    </div>
  );
}
