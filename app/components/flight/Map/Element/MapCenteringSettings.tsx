import { Button, Tooltip } from "flowbite-react";
import { FaPlane } from "react-icons/fa";
import { FaChevronRight, FaCrosshairs, FaPlaneArrival, FaPlaneDeparture, FaRoute } from "react-icons/fa6";
import { type MapSettings, useMapSettings } from "~/state/app/context/useMapSettings";

type Props = {
  size?: "sm" | "md";
};

function sizeToButtonSize(size: "sm" | "md") {
  switch (size) {
    case "sm":
      return "xs";
    case "md":
      return "sm";
  }
}

export function MapCenteringSettings({ size = "md" }: Props) {
  const { mapSettings, updateMapSettings } = useMapSettings();

  const toggleAutoCenter = () => {
    updateMapSettings({
      ...mapSettings,
      autoCenter: !mapSettings.autoCenter,
    });
  };

  const setCenterOn = (centerOn: MapSettings["centerOn"]) => {
    updateMapSettings({ ...mapSettings, centerOn });
  };

  const isCenteringActive = mapSettings.autoCenter;
  const isRouteActive = mapSettings.centerOn === "route";
  const isAircraftActive = mapSettings.centerOn === "aircraft";
  const isDepartureActive = mapSettings.centerOn === "departure";
  const isDestinationActive = mapSettings.centerOn === "destination";

  const autoCenterButton = (
    <Button
      color={isCenteringActive ? "indigo" : "alternative"}
      size={sizeToButtonSize(size)}
      onClick={toggleAutoCenter}
    >
      <FaCrosshairs />
    </Button>
  );
  const routeButton = (
    <Button
      color={isRouteActive ? "indigo" : "alternative"}
      onClick={() => setCenterOn("route")}
      size={sizeToButtonSize(size)}
      className="space-x-2 font-bold"
    >
      <FaRoute />
      <span>Route</span>
    </Button>
  );

  const aircraftButton = (
    <Button
      color={isAircraftActive ? "indigo" : "alternative"}
      onClick={() => setCenterOn("aircraft")}
      size={sizeToButtonSize(size)}
      className="space-x-2 font-bold"
    >
      <FaPlane className="rotate-315" />
      <span>Aircraft</span>
    </Button>
  );

  const departureButton = (
    <Button
      color={isDepartureActive ? "indigo" : "alternative"}
      onClick={() => setCenterOn("departure")}
      size={sizeToButtonSize(size)}
      className="space-x-2 font-bold"
    >
      <FaPlaneDeparture />
      <span>Departure</span>
    </Button>
  );

  const destinationButton = (
    <Button
      color={isDestinationActive ? "indigo" : "alternative"}
      onClick={() => setCenterOn("destination")}
      size={sizeToButtonSize(size)}
      className="space-x-2 font-bold"
    >
      <FaPlaneArrival />
      <span>Destination</span>
    </Button>
  );

  return (
    <div className="flex gap-3 items-center pointer-events-auto">
      <div className="hidden md:block">
        <Tooltip content="Automatic map centering" style="auto" placement="top">
          {autoCenterButton}
        </Tooltip>
      </div>
      <div className="md:hidden">{autoCenterButton}</div>

      {mapSettings.autoCenter && (
        <div className="flex gap-3 items-center animate-in fade-in slide-in-from-left-4 duration-300">
          <FaChevronRight className="text-gray-500 w-2 h-4" />
          <div className="hidden md:block">
            <Tooltip content="Center automatically on route" style="auto" placement="top">
              {routeButton}
            </Tooltip>
          </div>
          <div className="md:hidden">{routeButton}</div>
          <div className="hidden md:block">
            <Tooltip content="Center automatically on aircraft" style="auto" placement="top">
              {aircraftButton}
            </Tooltip>
          </div>
          <div className="md:hidden">{aircraftButton}</div>
          <div className="hidden md:block">
            <Tooltip content="Center automatically on departure airport" style="auto" placement="top">
              {departureButton}
            </Tooltip>
          </div>
          <div className="md:hidden">{departureButton}</div>
          <div className="hidden md:block">
            <Tooltip content="Center automatically on destination airport" style="auto" placement="top">
              {destinationButton}
            </Tooltip>
          </div>
          <div className="md:hidden">{destinationButton}</div>
        </div>
      )}
    </div>
  );
}
