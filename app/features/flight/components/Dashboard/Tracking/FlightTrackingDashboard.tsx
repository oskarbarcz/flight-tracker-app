import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { twMerge } from "tailwind-merge";
import { FlightSource } from "~/features/flight";
import { FlightDataTabs } from "~/features/flight/components/Dashboard/Tabs/FlightDataTabs";
import { FlightCabinTab } from "~/features/flight/components/Dashboard/Tabs/Tab/FlightCabinTab";
import { FlightCargoTab } from "~/features/flight/components/Dashboard/Tabs/Tab/FlightCargoTab";
import { FlightDelaysTab } from "~/features/flight/components/Dashboard/Tabs/Tab/FlightDelaysTab";
import { FlightEmergenciesDiversionsTab } from "~/features/flight/components/Dashboard/Tabs/Tab/FlightEmergenciesDiversionsTab";
import { FlightFuelAndLoadTab } from "~/features/flight/components/Dashboard/Tabs/Tab/FlightFuelAndLoadTab";
import { FlightOfpTab } from "~/features/flight/components/Dashboard/Tabs/Tab/FlightOfpTab";
import { FlightOverviewTab } from "~/features/flight/components/Dashboard/Tabs/Tab/FlightOverviewTab";
import { FlightProgressTab } from "~/features/flight/components/Dashboard/Tabs/Tab/FlightProgressTab";
import { FlightRouteTab } from "~/features/flight/components/Dashboard/Tabs/Tab/FlightRouteTab";
import { FlightRunwayAnalysisTab } from "~/features/flight/components/Dashboard/Tabs/Tab/FlightRunwayAnalysisTab";
import { DelayNotice } from "~/features/flight/components/Dashboard/Tracking/DelayNotice";
import { FlightTrackingHeader } from "~/features/flight/components/Dashboard/Tracking/Header/FlightTrackingHeader";
import { MapBox } from "~/features/flight/components/Dashboard/Tracking/Map/MapBox";
import { FlightPhaseCard } from "~/features/flight/components/Dashboard/Tracking/Progress/FlightPhaseCard";
import { useTrackedFlight } from "~/features/flight/hooks/useTrackedFlight";
import { useTrackedFlightAdsb } from "~/features/flight/hooks/useTrackedFlightAdsb";
import { useIsSwitchingTrackingView, useTrackingView } from "~/features/flight/hooks/useTrackingView";
import { FlightDataTab } from "~/features/flight/lib/flightDataTabs";
import { TrackingView, trackFlightPath, trackingMapIntent } from "~/features/flight/lib/trackingView";
import { RouteBriefingProvider } from "~/features/route/hooks/useRouteBriefing";
import { useCoveredHeight } from "~/shared/hooks/useCoveredHeight";
import { usePageTitle } from "~/shared/hooks/usePageTitle";

const NEEDS_ROUTE_TABS = [FlightDataTab.Overview, FlightDataTab.Route];

const MAP_OVERLAY =
  "md:pointer-events-none md:absolute md:inset-0 md:z-10 md:overflow-y-auto md:[scrollbar-gutter:stable]";
const MAP_OVERLAY_COLUMN = "md:mx-auto md:max-w-7xl md:p-6 md:*:pointer-events-auto";
const MAP_LAYER =
  "h-[clamp(24rem,70dvh,48rem)] overflow-hidden rounded-2xl border border-gray-200 md:absolute md:inset-0 md:h-auto md:rounded-none md:border-0 dark:border-gray-800";
const PARKED_MAP_LAYER = "invisible absolute inset-0";

type Props = {
  flightId: string;
  viewSlug: string | undefined;
  tabSlug: string | undefined;
};

export function FlightTrackingDashboard({ flightId, viewSlug, tabSlug }: Props) {
  const { flight, activeEmergency, delayRequest, setFlightId } = useTrackedFlight();
  const navigate = useNavigate();
  const trackingView = useTrackingView(flightId, flight, viewSlug, tabSlug);
  const isTracking = trackingView?.view === TrackingView.Tracking;
  const mapCover = useCoveredHeight<HTMLDivElement, HTMLDivElement>(isTracking);
  const isSwitchingView = useIsSwitchingTrackingView(flightId);
  const [isMapMounted, setIsMapMounted] = useState(false);
  useTrackedFlightAdsb();

  usePageTitle(flight ? `Tracking flight ${flight.flightNumber}` : "Tracking");

  useEffect(() => {
    setFlightId(flightId);
  }, [flightId, setFlightId]);

  if (isTracking && !isMapMounted) {
    setIsMapMounted(true);
  }

  if (!flight || !trackingView) {
    return <div>Loading…</div>;
  }

  const { view, tab } = trackingView;
  const isSimbriefAvailable = flight.source === FlightSource.SimBrief;
  const hasActiveEmergency = activeEmergency !== null;
  const hasUnsettledDelay = delayRequest !== null && !delayRequest.isSettled;
  const needsRoute = isMapMounted || NEEDS_ROUTE_TABS.includes(tab);

  const setTab = (next: FlightDataTab) => {
    navigate(trackFlightPath(flight.id, TrackingView.Briefing, next));
  };

  return (
    <RouteBriefingProvider flight={needsRoute ? flight : null}>
      <div data-full-bleed={isTracking || undefined} className={isTracking ? MAP_OVERLAY : undefined}>
        <div className={isTracking ? MAP_OVERLAY_COLUMN : undefined}>
          <DelayNotice isDelayReportShown={!isTracking && tab === FlightDataTab.Delays} />
          <div
            ref={mapCover.coverRef}
            className={twMerge("mb-4 flex flex-col gap-3", isSwitchingView && "[view-transition-name:tracking-cards]")}
          >
            <FlightTrackingHeader trackingView={trackingView} />
            <FlightPhaseCard />
          </div>
        </div>
      </div>

      {isMapMounted && (
        <MapBox
          key={flight.id}
          ref={mapCover.targetRef}
          className={isTracking ? MAP_LAYER : PARKED_MAP_LAYER}
          mapIntent={trackingMapIntent(flight.status)}
          topInset={mapCover.coveredHeight}
        />
      )}

      {!isTracking && (
        <>
          <FlightDataTabs
            tab={tab}
            setTab={setTab}
            isSimbriefAvailable={isSimbriefAvailable}
            hasActiveEmergency={hasActiveEmergency}
            hasUnsettledDelay={hasUnsettledDelay}
          />

          {tab === FlightDataTab.Overview && <FlightOverviewTab />}
          {tab === FlightDataTab.FuelAndCrew && <FlightFuelAndLoadTab />}
          {tab === FlightDataTab.Passengers && <FlightCabinTab />}
          {tab === FlightDataTab.Cargo && <FlightCargoTab />}
          {tab === FlightDataTab.FlightProgress && <FlightProgressTab />}
          {tab === FlightDataTab.Route && <FlightRouteTab />}
          {tab === FlightDataTab.OperationalFlightPlan && <FlightOfpTab />}
          {tab === FlightDataTab.RunwayAnalysis && <FlightRunwayAnalysisTab />}
          {tab === FlightDataTab.EmergenciesDiversions && <FlightEmergenciesDiversionsTab />}
          {tab === FlightDataTab.Delays && <FlightDelaysTab />}
        </>
      )}
    </RouteBriefingProvider>
  );
}
