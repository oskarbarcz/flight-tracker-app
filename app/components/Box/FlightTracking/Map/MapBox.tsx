"use client";

import { FlightStatus } from "~/models";
import FlightHistoryMap from "~/components/Map/FlightHistoryMap";
import FlightTrackingMap from "~/components/Map/FlightTrackingMap";
import MapTopOverlay from "~/components/Map/Element/MapTopOverlay";
import { AdsbProvider } from "~/state/contexts/adsb.context";
import Container, { ContainerClassProps } from "~/components/Layout/Container";
import { useTrackedFlight } from "~/state/contexts/tracked-flight.context";

type MapBoxProps = ContainerClassProps;

export function MapBox({ className }: MapBoxProps) {
  const { flight } = useTrackedFlight();

  if (!flight) {
    return null;
  }
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
