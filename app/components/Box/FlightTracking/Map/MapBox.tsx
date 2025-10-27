"use client";

import { FlightStatus } from "~/models";
import FlightHistoryMap from "~/components/Map/FlightHistoryMap";
import FlightTrackingMap from "~/components/Map/FlightTrackingMap";
import MapHistoryStatusOverlay from "~/components/Map/Element/Overlay/MapHistoryStatusOverlay";
import { AdsbProvider } from "~/state/contexts/adsb.context";
import Container, { ContainerClassProps } from "~/components/Layout/Container";
import { useTrackedFlight } from "~/state/contexts/tracked-flight.context";
import MapLinkOverlay from "~/components/Map/Element/Overlay/MapLinkOverlay";
import MapLiveStatusOverlay from "~/components/Map/Element/Overlay/MapLiveStatusOverlay";

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
        <div className="relative w-full h-full bg-gray-900 rounded-2xl overflow-hidden">
          <AdsbProvider>
            <FlightTrackingMap flight={flight} />
            <MapLiveStatusOverlay />
            <MapLinkOverlay />
          </AdsbProvider>
        </div>
      </Container>
    );
  }

  return (
    <Container className={className} padding="none">
      <div className="relative w-full h-full">
        <FlightHistoryMap flight={flight} />
        <MapHistoryStatusOverlay />
        <MapLinkOverlay />
      </div>
    </Container>
  );
}
