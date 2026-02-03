import React, { useEffect, useState } from "react";
import FlightDataTabs, {
  FlightDataTab,
} from "~/components/flight/Dashboard/Tabs/FlightDataTabs";
import FlightOfpTab from "~/components/flight/Dashboard/Tabs/Tab/FlightOfpTab";
import FlightOverviewTab from "~/components/flight/Dashboard/Tabs/Tab/FlightOverviewTab";
import FlightRunwayAnalysisTab from "~/components/flight/Dashboard/Tabs/Tab/FlightRunwayAnalysisTab";
import FlightWasClosedBox from "~/components/flight/Dashboard/Tracking/Box/FlightWasClosedBox";
import FlightHeader from "~/components/flight/Dashboard/Tracking/FlightHeader";
import { FlightSource, FlightStatus } from "~/models";
import { useTrackedFlight } from "~/state/contexts/global/tracked-flight.context";
import { usePageTitle } from "~/state/hooks/usePageTitle";

type Props = {
  flightId: string;
};

export default function FlightTrackingDashboard({ flightId }: Props) {
  const { flight, setFlightId } = useTrackedFlight();
  const [tab, setTab] = useState<FlightDataTab>(FlightDataTab.Overview);
  usePageTitle(flight ? `Tracking flight ${flight.flightNumber}` : "Tracking");

  useEffect(() => {
    setFlightId(flightId);
  }, [flightId, setFlightId]);

  if (!flight) {
    return <div>Loading...</div>;
  }

  const isFlightClosed = flight.status === FlightStatus.Closed;
  const isSimbriefAvailable = flight.source === FlightSource.SimBrief;

  return (
    <>
      {isFlightClosed && <FlightWasClosedBox />}
      <FlightHeader />
      <FlightDataTabs
        tab={tab}
        setTab={setTab}
        isSimbriefAvailable={isSimbriefAvailable}
      />

      {tab === FlightDataTab.Overview && <FlightOverviewTab />}
      {tab === FlightDataTab.OperationalFlightPlan && <FlightOfpTab />}
      {tab === FlightDataTab.RunwayAnalysis && <FlightRunwayAnalysisTab />}
    </>
  );
}
