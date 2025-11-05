import { Button, Tooltip, useThemeMode } from "flowbite-react";
import { FaMoon, FaSun } from "react-icons/fa6";
import { useEffect } from "react";

export default function ThemeSwitchButton() {
  const { mode, computedMode, setMode } = useThemeMode();

  useEffect(() => {
    if (mode === "auto") {
      setMode(computedMode);
    }
  }, [computedMode, mode, setMode]);

  return (
    <Tooltip
      content={`Change theme to ${mode === "dark" ? "light" : "dark"}`}
      style="auto"
      placement="bottom"
    >
      {mode === "dark" && (
        <Button color="alternative" size="sm" onClick={() => setMode("light")}>
          <FaSun size={18} />
        </Button>
      )}

      {mode === "light" && (
        <Button color="alternative" size="sm" onClick={() => setMode("dark")}>
          <FaMoon size={18} />
        </Button>
      )}
    </Tooltip>
  );
}
