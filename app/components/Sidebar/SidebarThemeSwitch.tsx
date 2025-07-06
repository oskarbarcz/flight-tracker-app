"use client";

import React from "react";
import {
  MdBrightnessAuto,
  MdBrightnessHigh,
  MdBrightnessLow,
} from "react-icons/md";
import { useThemeMode } from "flowbite-react";
import { IconType } from "react-icons";

type SidebarColorModeSwitchProps = {
  isCollapsed: boolean;
};

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

export default function SidebarThemeSwitch({
  isCollapsed,
}: SidebarColorModeSwitchProps) {
  const { mode: currentMode, setMode } = useThemeMode();
  const Icon = getIconForMode(currentMode);

  function handleThemeSwitch(mode: ThemeMode) {
    setMode(mode);
  }

  return (
    <button
      onClick={() => handleThemeSwitch(nextMode(currentMode))}
      className="flex w-full items-center cursor-pointer rounded-3xl text-white bg-indigo-500 hover:bg-indigo-400 p-2 transition-colors duration-100"
    >
      <Icon size="24px" />
      {!isCollapsed && (
        <span className="mx-3 text-xs uppercase md:text-sm">
          {["auto", "light", "dark"].map((mode, index) => {
            const isCurrent = currentMode === mode;
            return (
              <span
                key={index}
                className={`ps-2 md:ps-3 ${isCurrent && " font-bold"}`}
              >
                {mode}
              </span>
            );
          })}
        </span>
      )}
    </button>
  );
}
