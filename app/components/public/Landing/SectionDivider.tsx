import React from "react";

interface SectionDividerProps {
  height?: string;
  zIndex?: string;
  darkToColor?: string;
  lightToColor?: string;
  className?: string;
}

export function SectionDivider({
  height = "h-40 md:h-[400px]",
  zIndex = "z-0",
  darkToColor = "dark:to-gray-950",
  lightToColor = "to-white",
  className = "",
}: SectionDividerProps) {
  return (
    <div
      className={`absolute bottom-0 left-0 w-full ${height} bg-linear-to-b from-transparent ${lightToColor} ${darkToColor} pointer-events-none ${zIndex} ${className}`}
      aria-hidden="true"
    />
  );
}
