"use client";

import { useThemeMode } from "flowbite-react";
import React from "react";
import { IconType } from "react-icons";
import {
  MdBrightnessAuto,
  MdBrightnessHigh,
  MdBrightnessLow,
} from "react-icons/md";

type ThemeMode = "light" | "dark" | "auto";

function nextMode(mode: ThemeMode): ThemeMode {
  switch (mode) {
    case "light":
      return "dark";
    case "dark":
      return "auto";
    case "auto":
      return "light";
  }
}

function getIconForMode(mode: ThemeMode): IconType {
  switch (mode) {
    case "light":
      return MdBrightnessHigh;
    case "dark":
      return MdBrightnessLow;
    case "auto":
      return MdBrightnessAuto;
  }
}

export default function SidebarThemeSwitch() {
  const { mode: currentMode, setMode } = useThemeMode();
  const Icon = getIconForMode(currentMode);

  function handleThemeSwitch() {
    setMode(nextMode(currentMode));
  }

  return (
    <button
      onClick={handleThemeSwitch}
      className="text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 items-center cursor-pointer flex gap-3 py-2 px-3 rounded-xl ease-in-out transition-colors w-full text-left"
    >
      <Icon size={20} />
      <span className="capitalize">{currentMode} mode</span>
    </button>
  );
}
