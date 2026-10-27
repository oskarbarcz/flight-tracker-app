import type { DisplayMode, MapIntent, MapView } from "~/app-state/useMapSettings";
import {
  FlightDataTab,
  findFlightDataTab,
  flightDataTabFromSlug,
  flightDataTabSlug,
} from "~/features/flight/lib/flightDataTabs";
import { isBeforeOffBlock } from "~/features/flight/lib/flightPhase";
import { FlightStatus } from "~/features/flight/model";

export enum TrackingView {
  Briefing = "briefing",
  Tracking = "tracking",
}

export type TrackingLocation = {
  view: TrackingView;
  tab: FlightDataTab;
};

type ActiveEnd = "departure" | "destination";

const WHOLE_ROUTE: MapView = {
  centerOn: "route",
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
  return isBeforeOffBlock(status) ? TrackingView.Briefing : TrackingView.Tracking;
}

export function resolveTrackingLocation(
  status: FlightStatus,
  viewSlug: string | undefined,
  tabSlug: string | undefined,
): TrackingLocation {
  const view = Object.values(TrackingView).find((candidate) => candidate === viewSlug);

  if (view !== undefined) {
    return { view, tab: flightDataTabFromSlug(tabSlug) };
  }

  const legacyTab = tabSlug === undefined ? findFlightDataTab(viewSlug) : null;

  if (legacyTab !== null) {
    return { view: TrackingView.Briefing, tab: legacyTab };
  }

  return { view: automaticTrackingView(status), tab: FlightDataTab.Overview };
}

export function trackFlightPath(flightId: string, view: TrackingView, tab = FlightDataTab.Overview): string {
  const path = `/track/${flightId}/${view}`;

  return view === TrackingView.Briefing && tab !== FlightDataTab.Overview ? `${path}/${flightDataTabSlug(tab)}` : path;
}

export function trackingMapIntent(status: FlightStatus): MapIntent {
  if (isBeforeOffBlock(status)) {
    return { label: "Departure stand", view: apron("departure", "assigned") };
  }

  switch (status) {
    case FlightStatus.TaxiingOut:
      return { label: "Taxi out", view: runways("departure") };
    case FlightStatus.InCruise:
      return { label: "Cruise", view: WHOLE_ROUTE, plotsRoute: true };
    case FlightStatus.TaxiingIn:
      return { label: "Taxi in", view: apron("destination", "none") };
    default:
      return { label: "Arrival stand", view: apron("destination", "assigned") };
  }
}
