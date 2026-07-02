import { FaRoad } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { useMapSettings } from "~/app-state/useMapSettings";
import { DisplayModeToggle } from "~/features/flight/components/Map/Element/DisplayModeToggle";

type Props = {
  size?: "sm" | "md";
  expanded: boolean;
  onToggleExpanded: () => void;
};

export function RunwayDisplaySettings({ size, expanded, onToggleExpanded }: Props) {
  const { mapSettings, updateMapSettings } = useMapSettings();

  return (
    <DisplayModeToggle
      size={size}
      value={mapSettings.runwayDisplay}
      onChange={(runwayDisplay) => updateMapSettings({ ...mapSettings, runwayDisplay })}
      expanded={expanded}
      onToggleExpanded={onToggleExpanded}
      masterIcon={<FaRoad />}
      assignedIcon={<FaLocationDot />}
      labels={{ all: "All runways", assigned: "Assigned only", none: "Hide" }}
      tooltips={{
        masterExpand: "Show runway display options",
        masterCollapse: "Hide runway display options",
        all: "Show every runway at this airport",
        assigned: "Show only the runway assigned to this flight",
        none: "Hide all runways",
      }}
    />
  );
}
