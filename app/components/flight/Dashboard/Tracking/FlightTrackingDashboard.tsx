import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { FlightDataTab, FlightDataTabs } from "~/components/flight/Dashboard/Tabs/FlightDataTabs";
import { FlightOfpTab } from "~/components/flight/Dashboard/Tabs/Tab/FlightOfpTab";
import { FlightOverviewTab } from "~/components/flight/Dashboard/Tabs/Tab/FlightOverviewTab";
import { FlightProgressTab } from "~/components/flight/Dashboard/Tabs/Tab/FlightProgressTab";
import { FlightRunwayAnalysisTab } from "~/components/flight/Dashboard/Tabs/Tab/FlightRunwayAnalysisTab";
import { FlightHeader } from "~/components/flight/Dashboard/Tracking/FlightHeader";
import { FlightSource, FlightStatus } from "~/models";
import { useTrackedFlight } from "~/state/api/context/useTrackedFlight";
import { usePageTitle } from "~/state/app/hooks/usePageTitle";

type Props = {
  flightId: string;
};

export function FlightTrackingDashboard({ flightId }: Props) {
  const { flight, setFlightId } = useTrackedFlight();
  const navigate = useNavigate();
  const [tab, setTab] = useState<FlightDataTab>(FlightDataTab.Overview);
  usePageTitle(flight ? `Tracking flight ${flight.flightNumber}` : "Tracking");

  useEffect(() => {
    setFlightId(flightId);
  }, [flightId, setFlightId]);

  // When the pilot closes the flight, the tracking view becomes meaningless —
  // hand off to the history view.
  useEffect(() => {
    if (flight?.status === FlightStatus.Closed) {
      navigate(`/flight-history/${flight.id}`, { replace: true });
    }
  }, [flight, navigate]);

  if (!flight) {
    return <div>Loading...</div>;
  }

  const isSimbriefAvailable = flight.source === FlightSource.SimBrief;

  return (
    <>
      <FlightHeader />
      <FlightDataTabs tab={tab} setTab={setTab} isSimbriefAvailable={isSimbriefAvailable} />

      {tab === FlightDataTab.Overview && <FlightOverviewTab />}
      {tab === FlightDataTab.FlightProgress && <FlightProgressTab />}
      {tab === FlightDataTab.OperationalFlightPlan && <FlightOfpTab />}
      {tab === FlightDataTab.RunwayAnalysis && <FlightRunwayAnalysisTab />}
    </>
  );
}
