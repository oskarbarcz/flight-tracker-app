"use client";

import logo from "~/assets/logo.white.svg";

export default function Splash() {
  return (
    <div className="flex h-screen w-screen animate-pulse items-center justify-center bg-indigo-500">
      <div className="text-center">
        <img
          src={logo}
          alt="Logo"
          className="mx-auto mb-4 size-14 md:mb-8 md:size-24"
        />
        <h1 className="text-2xl font-bold text-gray-100 md:text-4xl">
          Flight Tracker
        </h1>
      </div>
    </div>
  );
}
