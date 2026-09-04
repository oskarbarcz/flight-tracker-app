import type { ThemeMode } from "flowbite-react";

export function etopsPointColor(mode: ThemeMode): string {
  return mode === "dark" ? "#e5e7eb" : "#111827";
}

export function fixMarkerFill(mode: ThemeMode): string {
  return mode === "dark" ? "#111827" : "#ffffff";
}
