import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import { FlightSource, FlightStatus } from "~/features/flight";
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
import { useTrackingView } from "~/features/flight/hooks/useTrackingView";
import { FlightDataTab, flightDataTabFromSlug, flightDataTabSlug } from "~/features/flight/lib/flightDataTabs";
import { monitorMapIntent, TrackingView } from "~/features/flight/lib/trackingView";
import { RouteBriefingProvider } from "~/features/route/hooks/useRouteBriefing";
import { usePageTitle } from "~/shared/hooks/usePageTitle";

const NEEDS_ROUTE_TABS = [FlightDataTab.Overview, FlightDataTab.Route];

type Props = {
  flightId: string;
  tabSlug: string | undefined;
};

export function FlightTrackingDashboard({ flightId, tabSlug }: Props) {
  const { flight, activeEmergency, delayRequest, setFlightId } = useTrackedFlight();
  const navigate = useNavigate();
  const tab = flightDataTabFromSlug(tabSlug);
  const trackingView = useTrackingView(flight?.status ?? null, tabSlug);
  useTrackedFlightAdsb();

  const setTab = (next: FlightDataTab) => {
    navigate(next === FlightDataTab.Overview ? `/track/${flightId}` : `/track/${flightId}/${flightDataTabSlug(next)}`);
  };
  usePageTitle(flight ? `Tracking flight ${flight.flightNumber}` : "Tracking");

  useEffect(() => {
    setFlightId(flightId);
  }, [flightId, setFlightId]);

  useEffect(() => {
    if (flight?.status === FlightStatus.Closed) {
      navigate(`/flight-history/${flight.id}`, { replace: true });
    }
  }, [flight, navigate]);

  if (!flight) {
    return <div>Loading…</div>;
  }

  const isSimbriefAvailable = flight.source === FlightSource.SimBrief;
  const hasActiveEmergency = activeEmergency !== null;
  const hasUnsettledDelay = delayRequest !== null && !delayRequest.isSettled;
  const isMonitoring = trackingView.view === TrackingView.Monitor;
  const needsRoute = isMonitoring || NEEDS_ROUTE_TABS.includes(tab);

  return (
    <RouteBriefingProvider flight={needsRoute ? flight : null}>
      <DelayNotice
        isDelayReportShown={!isMonitoring && tab === FlightDataTab.Delays}
        onOpenDelayReport={() => trackingView.select(TrackingView.Briefing)}
      />
      <div className="mb-4 flex flex-col gap-3">
        <FlightTrackingHeader trackingView={trackingView} />
        <FlightPhaseCard />
      </div>

      {isMonitoring ? (
        <MapBox className="h-[clamp(24rem,70dvh,48rem)]" mapIntent={monitorMapIntent(flight.status)} />
      ) : (
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
