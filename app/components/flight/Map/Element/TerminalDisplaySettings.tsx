import { FaLocationDot } from "react-icons/fa6";
import { HiOutlineOfficeBuilding } from "react-icons/hi";
import { DisplayModeToggle } from "~/components/flight/Map/Element/DisplayModeToggle";
import { useMapSettings } from "~/state/app/context/useMapSettings";

type Props = {
  size?: "sm" | "md";
  expanded: boolean;
  onToggleExpanded: () => void;
};

export function TerminalDisplaySettings({ size, expanded, onToggleExpanded }: Props) {
  const { mapSettings, updateMapSettings } = useMapSettings();

  return (
    <DisplayModeToggle
      size={size}
      value={mapSettings.terminalDisplay}
      onChange={(terminalDisplay) => updateMapSettings({ ...mapSettings, terminalDisplay })}
      expanded={expanded}
      onToggleExpanded={onToggleExpanded}
      masterIcon={<HiOutlineOfficeBuilding />}
      assignedIcon={<FaLocationDot />}
      labels={{ all: "All terminals", assigned: "Assigned only", none: "Hide" }}
      tooltips={{
        masterExpand: "Show terminal display options",
        masterCollapse: "Hide terminal display options",
        all: "Show every terminal at this airport",
        assigned: "Show only the terminal of the assigned gate",
        none: "Hide all terminals",
      }}
    />
  );
}
