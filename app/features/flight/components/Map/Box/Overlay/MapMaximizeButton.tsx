import { Button } from "flowbite-react";
import { MdFullscreen, MdFullscreenExit } from "react-icons/md";

type Props = {
  isMaximized: boolean;
  onToggle: () => void;
};

export function MapMaximizeButton({ isMaximized, onToggle }: Props) {
  const label = isMaximized ? "Restore map" : "Expand map";

  return (
    <Button size="xs" color="light" onClick={onToggle} title={label} aria-label={label}>
      {isMaximized ? <MdFullscreenExit className="size-4" /> : <MdFullscreen className="size-4" />}
    </Button>
  );
}
