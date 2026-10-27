import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useViewTransitionState } from "react-router";
import { FlightDataTab } from "~/features/flight/lib/flightDataTabs";
import {
  automaticTrackingView,
  resolveTrackingLocation,
  type TrackingLocation,
  TrackingView,
  trackFlightPath,
} from "~/features/flight/lib/trackingView";
import { type Flight, FlightStatus } from "~/features/flight/model";

type AutomaticView = {
  flightId: string;
  view: TrackingView;
};

export type TrackingViewState = TrackingLocation & {
  pathTo: (view: TrackingView) => string;
};

function canonicalPath(flight: Flight, location: TrackingLocation): string {
  return flight.status === FlightStatus.Closed
    ? `/flight-history/${flight.id}`
    : trackFlightPath(flight.id, location.view, location.tab);
}

export function useTrackingView(
  flightId: string,
  flight: Flight | null,
  viewSlug: string | undefined,
  tabSlug: string | undefined,
): TrackingViewState | null {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [briefingTab, setBriefingTab] = useState(FlightDataTab.Overview);
  const lastAutomaticView = useRef<AutomaticView | null>(null);

  const loaded = flight?.id === flightId ? flight : null;
  const location = loaded && resolveTrackingLocation(loaded.status, viewSlug, tabSlug);
  const target = loaded && location && canonicalPath(loaded, location);
  const automaticView = loaded && automaticTrackingView(loaded.status);

  if (location?.view === TrackingView.Briefing && location.tab !== briefingTab) {
    setBriefingTab(location.tab);
  }

  useEffect(() => {
    if (target !== null && target !== pathname) {
      navigate(target, { replace: true });
    }
  }, [target, pathname, navigate]);

  useEffect(() => {
    if (automaticView === null) {
      return;
    }

    const previous = lastAutomaticView.current;
    lastAutomaticView.current = { flightId, view: automaticView };

    if (previous?.flightId === flightId && previous.view !== automaticView) {
      navigate(trackFlightPath(flightId, automaticView), { viewTransition: true });
    }
  }, [flightId, automaticView, navigate]);

  if (location === null) {
    return null;
  }

  return {
    ...location,
    pathTo: (view) => trackFlightPath(flightId, view, briefingTab),
  };
}

export function useIsSwitchingTrackingView(flightId: string): boolean {
  const involvesTracking = useViewTransitionState(trackFlightPath(flightId, TrackingView.Tracking));
  const involvesBriefing = useViewTransitionState(`${trackFlightPath(flightId, TrackingView.Briefing)}/*`);

  return involvesTracking && involvesBriefing;
}
