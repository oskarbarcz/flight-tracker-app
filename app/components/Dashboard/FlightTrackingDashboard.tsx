import { useFlight } from "~/state/hooks/useFlight";
import { usePageTitle } from "~/state/hooks/usePageTitle";
import React, { useEffect } from "react";
import FlightInfoBox from "~/components/Box/FlightInfoBox";
import { FlightTimerBox } from "~/components/Box/FlightTimerBox";
import { FlightPhaseBox } from "~/components/Box/FlightPhaseBox";
import Container from "~/components/Layout/Container";
import { MapBox } from "~/components/Box/Map/MapBox";
import FlightLogBox from "~/components/Box/FlightLogBox";
import AircraftBox from "~/components/Box/AircraftBox";
import FlightControlBox from "~/components/Box/FlightControlBox";
import TimeManagementBox from "~/components/Box/TimeManagementBox";
import FlightScheduleBox from "~/components/Box/FlightScheduleBox";

type FlightTrackingDashboardProps = {
  flightId: string;
};

export default function FlightTrackingDashboard({
  flightId,
}: FlightTrackingDashboardProps) {
  const { flight, loadFlight } = useFlight();
  usePageTitle(flight ? `Tracking flight ${flight.flightNumber}` : "Tracking");

  useEffect(() => {
    loadFlight(flightId).then();
  }, [flightId, loadFlight]);

  if (!flight) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="grid grid-cols-3 grid-rows-[auto_1fr_1fr] gap-4">
        <FlightInfoBox flight={flight} className="col-span-1" />
        <MapBox
          flight={flight}
          className="col-span-2 min-h-[400px] lg:min-h-0"
        />
        <FlightControlBox />
        <FlightScheduleBox />
        <TimeManagementBox />
        <AircraftBox />
        <FlightLogBox className="row-span-2 row-start-2 col-start-3" />
      </div>
      <Container className="mt-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FlightTimerBox flight={flight} />
          <FlightPhaseBox flight={flight} />
        </div>
      </Container>
    </>
  );
}
