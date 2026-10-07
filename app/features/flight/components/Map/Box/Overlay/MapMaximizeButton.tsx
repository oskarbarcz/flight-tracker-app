import { Button } from "flowbite-react";
import { LuMaximize2, LuMinimize2 } from "react-icons/lu";
import { IconSwap } from "~/shared/ui/Display/IconSwap";

type Props = {
  isMaximized: boolean;
  onToggle: () => void;
};

export function MapMaximizeButton({ isMaximized, onToggle }: Props) {
  const label = isMaximized ? "Restore map" : "Expand map";

  return (
    <Button size="xs" color="light" onClick={onToggle} title={label} aria-label={label}>
      <IconSwap
        current={isMaximized ? "maximized" : "restored"}
        icons={{ maximized: <LuMinimize2 className="size-4" />, restored: <LuMaximize2 className="size-4" /> }}
      />
    </Button>
  );
}
