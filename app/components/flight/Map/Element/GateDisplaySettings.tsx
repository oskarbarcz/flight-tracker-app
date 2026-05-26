import { FaLocationDot } from "react-icons/fa6";
import { HiLocationMarker } from "react-icons/hi";
import { DisplayModeToggle } from "~/components/flight/Map/Element/DisplayModeToggle";
import { useMapSettings } from "~/state/app/context/useMapSettings";

type Props = {
  size?: "sm" | "md";
  expanded: boolean;
  onToggleExpanded: () => void;
};

export function GateDisplaySettings({ size, expanded, onToggleExpanded }: Props) {
  const { mapSettings, updateMapSettings } = useMapSettings();

  return (
    <DisplayModeToggle
      size={size}
      value={mapSettings.gateDisplay}
      onChange={(gateDisplay) => updateMapSettings({ ...mapSettings, gateDisplay })}
      expanded={expanded}
      onToggleExpanded={onToggleExpanded}
      masterIcon={<HiLocationMarker />}
      assignedIcon={<FaLocationDot />}
      labels={{ all: "All gates", assigned: "Assigned only", none: "Hide" }}
      tooltips={{
        masterExpand: "Show gate display options",
        masterCollapse: "Hide gate display options",
        all: "Show every gate at this airport",
        assigned: "Show only the gate assigned to this flight",
        none: "Hide all gates",
      }}
    />
  );
}
