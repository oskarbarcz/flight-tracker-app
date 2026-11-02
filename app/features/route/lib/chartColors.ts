import type { ThemeMode } from "flowbite-react";

export function etopsPointColor(mode: ThemeMode): string {
  return mode === "dark" ? "#9ca3af" : "#4b5563";
}

export function fixMarkerFill(mode: ThemeMode): string {
  return mode === "dark" ? "#111827" : "#ffffff";
}
