"use client";

import { Flight, FlightStatus } from "~/models";
import FlightHistoryMap from "~/components/Map/FlightHistoryMap";
import FlightTrackingMap from "~/components/Map/FlightTrackingMap";
import MapTopOverlay from "~/components/Map/Element/MapTopOverlay";
import { AdsbProvider } from "~/state/contexts/adsb.context";
import Container, { ContainerClassProps } from "~/components/Layout/Container";

type MapBoxProps = ContainerClassProps & {
  flight: Flight;
};

export function MapBox({ flight, className }: MapBoxProps) {
  const isFlightTrackable = [
    FlightStatus.TaxiingOut,
    FlightStatus.InCruise,
    FlightStatus.TaxiingIn,
  ].includes(flight.status);

  if (isFlightTrackable) {
    return (
      <Container className={className} padding="none">
        <AdsbProvider>
          <FlightTrackingMap flight={flight} />
        </AdsbProvider>
      </Container>
    );
  }

  return (
    <Container className={className} padding="none">
      <div className="relative w-full h-full">
        <FlightHistoryMap flight={flight} />
        <MapTopOverlay isTrackable={isFlightTrackable} />
        {/*<MapBottomOverlay />*/}
      </div>
    </Container>
  );
}
