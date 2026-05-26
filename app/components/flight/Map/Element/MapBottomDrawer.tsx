import { useState } from "react";
import { GateDisplaySettings } from "~/components/flight/Map/Element/GateDisplaySettings";
import { MapCenteringSettings } from "~/components/flight/Map/Element/MapCenteringSettings";
import { RunwayDisplaySettings } from "~/components/flight/Map/Element/RunwayDisplaySettings";
import { TerminalDisplaySettings } from "~/components/flight/Map/Element/TerminalDisplaySettings";

type Props = {
  size?: "sm" | "md";
};

type PanelId = "centering" | "runway" | "terminal" | "gate";

export function MapBottomDrawer({ size = "md" }: Props) {
  const [openPanel, setOpenPanel] = useState<PanelId | null>(null);
  const toggle = (panel: PanelId) => () => setOpenPanel((p) => (p === panel ? null : panel));

  return (
    <div className="absolute pointer-events-none rounded-2xl w-full bottom-0 left-0 right-0 p-3 z-10 flex flex-wrap gap-3">
      <MapCenteringSettings size={size} expanded={openPanel === "centering"} onToggleExpanded={toggle("centering")} />
      <RunwayDisplaySettings size={size} expanded={openPanel === "runway"} onToggleExpanded={toggle("runway")} />
      <TerminalDisplaySettings size={size} expanded={openPanel === "terminal"} onToggleExpanded={toggle("terminal")} />
      <GateDisplaySettings size={size} expanded={openPanel === "gate"} onToggleExpanded={toggle("gate")} />
    </div>
  );
}
