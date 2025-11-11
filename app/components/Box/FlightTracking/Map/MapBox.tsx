"use client";

import { FlightStatus } from "~/models";
import FlightHistoryMapBox from "~/components/Map/Box/FlightHistoryMapBox";
import FlightTrackingMapBox from "~/components/Map/Box/FlightTrackingMapBox";
import MapHistoryStatusOverlay from "~/components/Map/Box/Overlay/MapHistoryStatusOverlay";
import { AdsbProvider } from "~/state/contexts/content/adsb.context";
import Container, { ContainerClassProps } from "~/components/Layout/Container";
import { useTrackedFlight } from "~/state/contexts/global/tracked-flight.context";
import MapLinkOverlay from "~/components/Map/Box/Overlay/MapLinkOverlay";
import MapLiveStatusOverlay from "~/components/Map/Box/Overlay/MapLiveStatusOverlay";
import MapSettingsProvider from "~/state/contexts/settings/map-settings.context";

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
            <MapSettingsProvider>
              <FlightTrackingMapBox flight={flight} />
              <MapLiveStatusOverlay />
              <MapLinkOverlay />
              <MapLinkOverlay />
            </MapSettingsProvider>
          </AdsbProvider>
        </div>
      </Container>
    );
  }

  return (
    <Container className={className} padding="none">
      <div className="relative w-full h-full">
        <MapSettingsProvider>
          <FlightHistoryMapBox flight={flight} />
          <MapHistoryStatusOverlay />
          <MapLinkOverlay />
        </MapSettingsProvider>
      </div>
    </Container>
  );
}
