import { useFlight } from "~/state/hooks/useFlight";
import { usePageTitle } from "~/state/hooks/usePageTitle";
import React, { useEffect } from "react";
import FlightInfoBox from "~/components/Box/FlightInfoBox";
import { MapBox } from "~/components/Box/FlightTracking/Map/MapBox";
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
      <div className="grid grid-cols-1 md:grid-cols-3 grid-rows-[auto_1fr_1fr] gap-4">
        <FlightInfoBox flight={flight} className="col-span-1" />
        <MapBox
          flight={flight}
          className="md:col-span-2 min-h-[400px] md:min-h-0"
        />
        <FlightControlBox flight={flight} />
        <FlightScheduleBox flight={flight} />
        <TimeManagementBox />
        <AircraftBox />
        <FlightLogBox className="md:row-span-2 md:row-start-2 md:col-start-3" />
      </div>
    </>
  );
}
