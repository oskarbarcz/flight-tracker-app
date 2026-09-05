import type { DisplayMode, MapIntent, MapView } from "~/app-state/useMapSettings";
import { FlightDataTab } from "~/features/flight/lib/flightDataTabs";
import { isAfterTakeoff } from "~/features/flight/lib/flightPhase";
import type { FlightStatus } from "~/features/flight/model";

type ActiveEnd = "departure" | "destination";

const WHOLE_FLIGHT: MapView = {
  centerOn: "route",
  autoCenter: true,
  runwayDisplay: "all",
  terminalDisplay: "assigned",
  gateDisplay: "none",
  parkingPositionDisplay: "assigned",
};

const ENROUTE: MapView = {
  centerOn: "route",
  autoCenter: true,
  runwayDisplay: "assigned",
  terminalDisplay: "none",
  gateDisplay: "none",
  parkingPositionDisplay: "none",
};

const AIRCRAFT: MapView = {
  centerOn: "aircraft",
  autoCenter: true,
  runwayDisplay: "assigned",
  terminalDisplay: "none",
  gateDisplay: "none",
  parkingPositionDisplay: "none",
};

function apron(end: ActiveEnd, gateDisplay: DisplayMode): MapView {
  return {
    centerOn: end,
    autoCenter: true,
    runwayDisplay: "all",
    terminalDisplay: "assigned",
    gateDisplay,
    parkingPositionDisplay: "assigned",
  };
}

function runways(end: ActiveEnd): MapView {
  return {
    centerOn: end,
    autoCenter: true,
    runwayDisplay: "all",
    terminalDisplay: "none",
    gateDisplay: "none",
    parkingPositionDisplay: "none",
  };
}

export function mapIntentForTab(tab: FlightDataTab, status: FlightStatus): MapIntent {
  const end: ActiveEnd = isAfterTakeoff(status) ? "destination" : "departure";

  const intents: Record<FlightDataTab, MapIntent> = {
    [FlightDataTab.Overview]: { label: "Overview", view: WHOLE_FLIGHT },
    [FlightDataTab.FuelAndCrew]: { label: "Fuel & crew", view: WHOLE_FLIGHT },
    [FlightDataTab.Passengers]: { label: "Passengers", view: apron(end, "assigned") },
    [FlightDataTab.Cargo]: { label: "Cargo", view: apron(end, "none") },
    [FlightDataTab.FlightProgress]: { label: "Flight progress", view: AIRCRAFT },
    [FlightDataTab.Route]: { label: "Route", view: ENROUTE, plotsRoute: true },
    [FlightDataTab.OperationalFlightPlan]: { label: "OFP", view: ENROUTE },
    [FlightDataTab.RunwayAnalysis]: { label: "Runway analysis", view: runways(end) },
    [FlightDataTab.EmergenciesDiversions]: { label: "Emergencies", view: ENROUTE },
    [FlightDataTab.Delays]: { label: "Delay report", view: WHOLE_FLIGHT },
  };

  return intents[tab];
}
