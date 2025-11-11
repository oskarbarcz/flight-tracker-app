"use client";

import TrackingFlightMap from "~/components/Map/Box/TrackingFlightMap";
import MapPreviewStatusOverlay from "~/components/Map/Box/Overlay/PreviewStatusOverlay";
import Container, { ContainerClassProps } from "~/components/Layout/Container";
import { useTrackedFlight } from "~/state/contexts/global/tracked-flight.context";
import MapLinkOverlay from "~/components/Map/Box/Overlay/MapLinkOverlay";
import MapSettingsProvider from "~/state/contexts/settings/map-settings.context";
import MapBottomDrawer from "~/components/Map/Element/MapBottomDrawer";
import { useAdsbData } from "~/state/contexts/content/adsb.context";
import { useCallback, useEffect } from "react";
import { shouldPollForAdsbData } from "~/models";
import HistoryFlightMap from "~/components/Map/Box/HistoryFlightMap";

type MapBoxProps = ContainerClassProps;

export function MapBox({ className }: MapBoxProps) {
  const { flight } = useTrackedFlight();
  const { setCallsign, loadFlightPath } = useAdsbData();

  const fetchFlight = useCallback(async () => {
    if (!flight) return;

    setCallsign(flight.callsign);
    await loadFlightPath();
  }, [flight, setCallsign, loadFlightPath]);

  // Initial fetch on mount
  useEffect(() => {
    if (!flight) return;
    if (!shouldPollForAdsbData(flight.status)) return;

    fetchFlight().then();
  }, [fetchFlight, flight]);

  // Refresh flight data every 5 seconds
  useEffect(() => {
    if (!flight) return;
    if (!shouldPollForAdsbData(flight.status)) return;

    const intervalId = setInterval(() => {
      fetchFlight().then();
    }, 5000); // 5 seconds

    return () => clearInterval(intervalId);
  }, [flight, fetchFlight]);

  if (!flight) {
    return null;
  }

  const poll = shouldPollForAdsbData(flight.status);

  return (
    <Container className={className} padding="none">
      <div className="relative w-full h-full">
        <MapSettingsProvider>
          {poll && <TrackingFlightMap />}
          {!poll && <HistoryFlightMap />}
          <MapPreviewStatusOverlay />
          <MapLinkOverlay />
          <MapBottomDrawer size="sm" />
        </MapSettingsProvider>
      </div>
    </Container>
  );
}
