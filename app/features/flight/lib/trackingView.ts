import type { DisplayMode, MapIntent, MapView } from "~/app-state/useMapSettings";
import { isBeforeOffBlock } from "~/features/flight/lib/flightPhase";
import { FlightStatus, isInFlightStatus } from "~/features/flight/model";

export enum TrackingView {
  Briefing = "briefing",
  Monitor = "monitor",
}

type ActiveEnd = "departure" | "destination";

const FOLLOW_AIRCRAFT: MapView = {
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

export function automaticTrackingView(status: FlightStatus): TrackingView {
  return isInFlightStatus(status) ? TrackingView.Monitor : TrackingView.Briefing;
}

export function monitorMapIntent(status: FlightStatus): MapIntent {
  if (isBeforeOffBlock(status)) {
    return { label: "Departure stand", view: apron("departure", "assigned") };
  }

  switch (status) {
    case FlightStatus.TaxiingOut:
      return { label: "Taxi out", view: runways("departure") };
    case FlightStatus.InCruise:
      return { label: "Cruise", view: FOLLOW_AIRCRAFT, plotsRoute: true };
    case FlightStatus.TaxiingIn:
      return { label: "Taxi in", view: apron("destination", "none") };
    default:
      return { label: "Arrival stand", view: apron("destination", "assigned") };
  }
}
