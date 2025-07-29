"use client";

import { Flight, FlightStatus } from "~/models";
import FlightHistoryMap from "~/components/Map/FlightHistoryMap";
import FlightTrackingMap from "~/components/Map/FlightTrackingMap";
import MapTopOverlay from "~/components/Map/Element/MapTopOverlay";
import { AdsbProvider } from "~/state/contexts/adsb.context";

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
        <AdsbProvider>
          <FlightTrackingMap flight={flight} />
        </AdsbProvider>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full rounded-2xl">
      <FlightHistoryMap flight={flight} />
      <MapTopOverlay isTrackable={isFlightTrackable} />
      {/*<MapBottomOverlay />*/}
    </div>
  );
}
