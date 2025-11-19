import { Button, Tooltip, useThemeMode } from "flowbite-react";
import { useEffect } from "react";
import { FaMoon, FaSun } from "react-icons/fa6";

export default function ThemeSwitchButton() {
  const { mode, computedMode, setMode } = useThemeMode();

  useEffect(() => {
    if (mode === "auto") {
      setMode(computedMode);
    }
  }, [computedMode, mode, setMode]);

  const darkButton = (
    <Button color="alternative" size="sm" onClick={() => setMode("light")}>
      <FaSun size={18} />
    </Button>
  );

  const lightButton = (
    <Button color="alternative" size="sm" onClick={() => setMode("dark")}>
      <FaMoon size={18} />
    </Button>
  );

  return (
    <>
      <div className="hidden md:block">
        <Tooltip
          content={`Change theme to ${mode === "dark" ? "light" : "dark"}`}
          style="auto"
          placement="bottom"
        >
          {mode === "dark" && darkButton}
          {mode === "light" && lightButton}
        </Tooltip>
      </div>

      <div className="md:hidden">
        {mode === "dark" && darkButton}
        {mode === "light" && lightButton}
      </div>
    </>
  );
}
