import { Button } from "flowbite-react";
import { useState } from "react";
import { FaPlane, FaRegClock } from "react-icons/fa";
import { FaFileInvoice, FaMapLocationDot, FaUserGroup } from "react-icons/fa6";
import { BasicFlightInfoOverlay } from "~/components/flight/Map/FullScreen/Overlay/BasicFlightInfoOverlay";
import { DocumentsOverlay } from "~/components/flight/Map/FullScreen/Overlay/DocumentsOverlay";
import { FlightPlanOverlay } from "~/components/flight/Map/FullScreen/Overlay/FlightPlanOverlay";
import { TimelineOverlay } from "~/components/flight/Map/FullScreen/Overlay/TimelineOverlay";
import type { Flight } from "~/models";

type Props = {
  flight: Flight;
};

type Panel = "info" | "documents" | "timeline" | "flightPlan";

function colorFor(isActive: boolean): string {
  return isActive ? "indigo" : "alternative";
}

export function FlightDetailsSectionOverlay({ flight }: Props) {
  const [openPanel, setOpenPanel] = useState<Panel | null>("info");

  const toggle = (panel: Panel) => setOpenPanel((current) => (current === panel ? null : panel));
  const close = () => setOpenPanel(null);

  return (
    <div className="absolute pointer-events-none w-full flex flex-col md:flex-row gap-3 top-0 left-0 p-3 z-30">
      <div className="flex pointer-events-auto md:flex-col gap-3">
        <Button
          color={colorFor(openPanel === "info")}
          size="sm"
          onClick={() => toggle("info")}
          aria-label="Flight info"
        >
          <FaPlane className="rotate-315" size={18} />
        </Button>
        <Button
          color={colorFor(openPanel === "documents")}
          size="sm"
          onClick={() => toggle("documents")}
          aria-label="Documents"
        >
          <FaFileInvoice size={18} />
        </Button>
        <Button
          color={colorFor(openPanel === "timeline")}
          size="sm"
          onClick={() => toggle("timeline")}
          aria-label="Timeline"
        >
          <FaRegClock size={18} />
        </Button>
        <Button
          color={colorFor(openPanel === "flightPlan")}
          size="sm"
          onClick={() => toggle("flightPlan")}
          aria-label="Flight plan"
        >
          <FaMapLocationDot size={18} />
        </Button>
        <Button disabled color="alternative" size="sm" className="bg-gray-100" aria-label="Passengers">
          <FaUserGroup size={18} />
        </Button>
      </div>
      <div>
        {openPanel === "info" && <BasicFlightInfoOverlay flight={flight} onClose={close} />}
        {openPanel === "documents" && <DocumentsOverlay flight={flight} onClose={close} />}
        {openPanel === "timeline" && <TimelineOverlay flight={flight} onClose={close} />}
        {openPanel === "flightPlan" && <FlightPlanOverlay flight={flight} onClose={close} />}
      </div>
    </div>
  );
}
