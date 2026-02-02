import React, { useEffect } from "react";
import AircraftBox from "~/components/flight/Dashboard/Tracking/AircraftBox";
import FlightHeader from "~/components/flight/Dashboard/Tracking/FlightHeader";
import FlightLogBox from "~/components/flight/Dashboard/Tracking/FlightLogBox";
import FlightProgressBox from "~/components/flight/Dashboard/Tracking/FlightProgressBox";
import FlightScheduleBox from "~/components/flight/Dashboard/Tracking/FlightScheduleBox";
import FlightWasClosedBox from "~/components/flight/Dashboard/Tracking/FlightWasClosedBox";
import TimeManagementBox from "~/components/flight/Dashboard/Tracking/TimeManagementBox";
import { FlightStatus } from "~/models";
import { useTrackedFlight } from "~/state/contexts/global/tracked-flight.context";
import { usePageTitle } from "~/state/hooks/usePageTitle";

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

  return (
    <>
      {isFlightClosed && <FlightWasClosedBox />}
      <FlightHeader />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FlightProgressBox />
        <FlightScheduleBox />
        <TimeManagementBox />
        <AircraftBox />
        <FlightLogBox
          className={`md:row-span-2 md:row-start-1 md:col-start-3`}
        />
      </div>
    </>
  );
}
