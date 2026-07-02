import { FaLocationDot } from "react-icons/fa6";
import { HiLocationMarker } from "react-icons/hi";
import { useMapSettings } from "~/app-state/useMapSettings";
import { DisplayModeToggle } from "~/components/flight/Map/Element/DisplayModeToggle";

type Props = {
  size?: "sm" | "md";
  expanded: boolean;
  onToggleExpanded: () => void;
};

export function ParkingPositionDisplaySettings({ size, expanded, onToggleExpanded }: Props) {
  const { mapSettings, updateMapSettings } = useMapSettings();

  return (
    <DisplayModeToggle
      size={size}
      value={mapSettings.parkingPositionDisplay}
      onChange={(parkingPositionDisplay) => updateMapSettings({ ...mapSettings, parkingPositionDisplay })}
      expanded={expanded}
      onToggleExpanded={onToggleExpanded}
      masterIcon={<HiLocationMarker />}
      assignedIcon={<FaLocationDot />}
      labels={{ all: "All parking positions", assigned: "Assigned only", none: "Hide" }}
      tooltips={{
        masterExpand: "Show parking position display options",
        masterCollapse: "Hide parking position display options",
        all: "Show every parking position at this airport",
        assigned: "Show only the parking position assigned to this flight",
        none: "Hide all parking positions",
      }}
    />
  );
}
