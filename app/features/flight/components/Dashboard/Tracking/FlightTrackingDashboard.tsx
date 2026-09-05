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
import { FlightHeader } from "~/features/flight/components/Dashboard/Tracking/FlightHeader";
import { useTrackedFlight } from "~/features/flight/hooks/useTrackedFlight";
import { FlightDataTab, flightDataTabFromSlug, flightDataTabSlug } from "~/features/flight/lib/flightDataTabs";
import { mapIntentForTab } from "~/features/flight/lib/tabMapIntent";
import { usePageTitle } from "~/shared/hooks/usePageTitle";

type Props = {
  flightId: string;
  tabSlug: string | undefined;
};

export function FlightTrackingDashboard({ flightId, tabSlug }: Props) {
  const { flight, activeEmergency, delayRequest, setFlightId } = useTrackedFlight();
  const navigate = useNavigate();
  const tab = flightDataTabFromSlug(tabSlug);

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
    return <div>Loading...</div>;
  }

  const isSimbriefAvailable = flight.source === FlightSource.SimBrief;
  const hasActiveEmergency = activeEmergency !== null;
  const hasUnsettledDelay = delayRequest !== null && !delayRequest.isSettled;

  return (
    <>
      <FlightHeader mapIntent={mapIntentForTab(tab, flight.status)} />
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
  );
}
