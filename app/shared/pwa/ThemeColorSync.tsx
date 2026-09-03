import { useThemeMode } from "flowbite-react";
import { useEffect } from "react";

const themeColors = {
  light: "#f3f4f6",
  dark: "#030712",
};

export function ThemeColorSync() {
  const { mode, computedMode } = useThemeMode();

  useEffect(() => {
    const resolved = computedMode === "dark" ? "dark" : "light";

    for (const meta of document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')) {
      const scheme = meta.media.includes("dark") ? "dark" : "light";
      meta.content = mode === "auto" ? themeColors[scheme] : themeColors[resolved];
    }
  }, [mode, computedMode]);

  return null;
}
