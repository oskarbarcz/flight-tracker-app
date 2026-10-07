import { useThemeMode } from "flowbite-react";
import { useCallback } from "react";
import { withoutTransitions } from "~/shared/lib/withoutTransitions";

export type ThemeMode = "light" | "dark" | "auto";

export function useThemeSwitch() {
  const { mode, computedMode, setMode: applyMode } = useThemeMode();

  const setMode = useCallback((next: ThemeMode) => withoutTransitions(() => applyMode(next)), [applyMode]);

  return { mode, computedMode, setMode };
}
