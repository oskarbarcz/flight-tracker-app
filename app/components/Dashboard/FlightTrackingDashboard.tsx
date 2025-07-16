import { useFlight } from "~/state/hooks/useFlight";
import { usePageTitle } from "~/state/hooks/usePageTitle";
import React, { useEffect } from "react";
import FlightInfoBox from "~/components/Box/FlightInfoBox";
import { FlightTimerBox } from "~/components/Box/FlightTimerBox";
import { FlightPhaseBox } from "~/components/Box/FlightPhaseBox";
import Container from "~/components/Container";
import { MapBox } from "~/components/Box/MapBox";

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
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <Container>
          <FlightInfoBox flight={flight} />
        </Container>
        <Container className="col-span-1 md:col-span-2" noPadding={true}>
          <MapBox flightId={flightId} />
        </Container>
      </div>
      <Container className="mt-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FlightTimerBox flight={flight} />
          <FlightPhaseBox flight={flight} />
        </div>
      </Container>
    </>
  );
}
