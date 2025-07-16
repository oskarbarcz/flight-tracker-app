"use client";

import { Flight, FlightStatus } from "~/models";
import FlightHistoryMap from "~/components/Map/FlightHistoryMap";
import FlightTrackingMap from "~/components/Map/FlightTrackingMap";

type MapBoxProps = {
  flight: Flight;
};

export function MapBox({ flight }: MapBoxProps) {
  const isFlightTrackable = [
    FlightStatus.TaxiingOut,
    FlightStatus.InCruise,
    FlightStatus.TaxiingIn,
  ].includes(flight.status);

  if (isFlightTrackable) {
    return (
      <div className="w-full h-full rounded-2xl">
        <FlightTrackingMap flight={flight} />
      </div>
    );
  }

  return (
    <div className="w-full h-full rounded-2xl">
      <FlightHistoryMap flight={flight} />
    </div>
  );
}
