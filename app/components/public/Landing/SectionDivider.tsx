import React from "react";

interface SectionDividerProps {
  /**
   * Tailwind height classes for mobile and desktop.
   * Default: "h-40 md:h-[400px]"
   */
  height?: string;
  /**
   * Z-index for layering.
   * Default: "z-0"
   */
  zIndex?: string;
  /**
   * The destination background color in dark mode.
   * Default: "to-gray-950"
   */
  darkToColor?: string;
  /**
   * The destination background color in light mode.
   * Default: "to-white"
   */
  lightToColor?: string;
  className?: string;
}

/**
 * SectionDivider - A premium, cinematic transition component for the landing page.
 * Creates a "Seamless Gradient Mist" effect to bridge between different background sections.
 */
export function SectionDivider({
  height = "h-40 md:h-[400px]",
  zIndex = "z-0",
  darkToColor = "dark:to-gray-950",
  lightToColor = "to-white",
  className = "",
}: SectionDividerProps) {
  return (
    <div
      className={`absolute bottom-0 left-0 w-full ${height} bg-gradient-to-b from-transparent ${lightToColor} ${darkToColor} pointer-events-none ${zIndex} ${className}`}
      aria-hidden="true"
    />
  );
}
