import { Button, Tooltip } from "flowbite-react";
import { useEffect } from "react";
import { FaMoon, FaSun } from "react-icons/fa6";
import { useThemeSwitch } from "~/shared/hooks/useThemeSwitch";
import { IconSwap } from "~/shared/ui/Display/IconSwap";

export function ThemeSwitchButton() {
  const { mode, computedMode, setMode } = useThemeSwitch();

  useEffect(() => {
    if (mode === "auto") {
      setMode(computedMode);
    }
  }, [computedMode, mode, setMode]);

  const isDark = mode === "dark";
  const label = isDark ? "Switch to light theme" : "Switch to dark theme";

  const button = (
    <Button color="alternative" size="sm" onClick={() => setMode(isDark ? "light" : "dark")} aria-label={label}>
      <IconSwap
        current={isDark ? "dark" : "light"}
        icons={{ dark: <FaSun size={18} />, light: <FaMoon size={18} /> }}
      />
    </Button>
  );

  return (
    <>
      <div className="hidden md:block">
        <Tooltip content={label} style="auto" placement="bottom">
          {button}
        </Tooltip>
      </div>

      <div className="md:hidden">{button}</div>
    </>
  );
}
