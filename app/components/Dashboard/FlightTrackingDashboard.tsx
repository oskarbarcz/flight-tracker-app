import { usePageTitle } from "~/state/hooks/usePageTitle";
import React, { useEffect } from "react";
import FlightInfoBox from "~/components/Box/FlightTracking/FlightInfoBox";
import { MapBox } from "~/components/Box/FlightTracking/Map/MapBox";
import FlightLogBox from "~/components/Box/FlightTracking/FlightLogBox";
import AircraftBox from "~/components/Box/FlightTracking/AircraftBox";
import FlightProgressBox from "~/components/Box/FlightTracking/FlightProgressBox";
import TimeManagementBox from "~/components/Box/FlightTracking/TimeManagementBox";
import FlightScheduleBox from "~/components/Box/FlightTracking/FlightScheduleBox";
import FlightWasClosedBox from "~/components/Box/FlightTracking/FlightWasClosedBox";
import { FlightStatus } from "~/models";
import { useTrackedFlight } from "~/state/contexts/global/tracked-flight.context";

type FlightTrackingDashboardProps = {
  flightId: string;
};

export default function FlightTrackingDashboard({
  flightId,
}: FlightTrackingDashboardProps) {
  const { flight, setFlightId } = useTrackedFlight();
  usePageTitle(flight ? `Tracking flight ${flight.flightNumber}` : "Tracking");

  useEffect(() => {
    setFlightId(flightId);
  }, [flightId, setFlightId]);

  if (!flight) {
    return <div>Loading...</div>;
  }

  const isFlightClosed = flight.status === FlightStatus.Closed;
  const flightLogPosition = isFlightClosed
    ? "md:row-start-3"
    : "md:row-start-2";

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 grid-rows-[auto_1fr_1fr] gap-4">
        {isFlightClosed && (
          <FlightWasClosedBox className="text-white bg-indigo-500 border-indigo-500 md:col-span-3" />
        )}

        <FlightInfoBox className="col-span-1" />
        <MapBox className="md:col-span-2" />
        <FlightProgressBox />
        <FlightScheduleBox />
        <TimeManagementBox />
        <AircraftBox />
        <FlightLogBox
          className={`md:row-span-2 ${flightLogPosition} md:col-start-3`}
        />
      </div>
    </>
  );
}
