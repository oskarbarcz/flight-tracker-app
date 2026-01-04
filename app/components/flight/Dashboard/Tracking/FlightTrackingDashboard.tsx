import React, { useEffect } from "react";
import AircraftBox from "~/components/flight/Dashboard/Tracking/AircraftBox";
import FlightInfoBox from "~/components/flight/Dashboard/Tracking/FlightInfoBox";
import FlightLogBox from "~/components/flight/Dashboard/Tracking/FlightLogBox";
import FlightProgressBox from "~/components/flight/Dashboard/Tracking/FlightProgressBox";
import FlightScheduleBox from "~/components/flight/Dashboard/Tracking/FlightScheduleBox";
import FlightWasClosedBox from "~/components/flight/Dashboard/Tracking/FlightWasClosedBox";
import { MapBox } from "~/components/flight/Dashboard/Tracking/Map/MapBox";
import TimeManagementBox from "~/components/flight/Dashboard/Tracking/TimeManagementBox";
import { FlightStatus } from "~/models";
import { AdsbProvider } from "~/state/contexts/content/adsb.context";
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
        <AdsbProvider>
          <MapBox className="md:col-span-2" />
        </AdsbProvider>
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
