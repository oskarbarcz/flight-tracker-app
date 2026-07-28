import { useMemo } from "react";

const installedDisplayModes = ["standalone", "minimal-ui", "fullscreen", "window-controls-overlay"];

function isIosInstalledApp(): boolean {
  return (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
}

export function useInstalledApp(): boolean {
  return useMemo(
    () =>
      installedDisplayModes.some((mode) => window.matchMedia(`(display-mode: ${mode})`).matches) || isIosInstalledApp(),
    [],
  );
}
