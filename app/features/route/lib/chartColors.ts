import type { ThemeMode } from "flowbite-react";

export function etopsColor(mode: ThemeMode): string {
  return mode === "dark" ? "#7cabcc" : "#0ea5e9";
}

export function fixMarkerFill(mode: ThemeMode): string {
  return mode === "dark" ? "#111827" : "#ffffff";
}
