import { useCallback, useEffect } from "react";
import { MapSettingsProvider } from "~/app-state/useMapSettings";
import { useAdsbData } from "~/features/adsb/hooks/useAdsbData";
import { LiveTelemetryOverlay } from "~/features/flight/components/Map/Box/Overlay/LiveTelemetryOverlay";
import { MapLinkOverlay } from "~/features/flight/components/Map/Box/Overlay/MapLinkOverlay";
import { MapPreviewStatusOverlay } from "~/features/flight/components/Map/Box/Overlay/PreviewStatusOverlay";
import { TrackingFlightMap } from "~/features/flight/components/Map/Box/TrackingFlightMap";
import { MapBottomDrawer } from "~/features/flight/components/Map/Element/MapBottomDrawer";
import { useTrackedFlight } from "~/features/flight/hooks/useTrackedFlight";
import { shouldPollForAdsbData, Tracking } from "~/models";
import type { ContainerClassProps } from "~/shared/ui/Layout/Container";
import { TransparentContainer } from "~/shared/ui/Layout/TransparentContainer";

type MapBoxProps = ContainerClassProps;

export function MapBox({ className }: MapBoxProps) {
  const { flight } = useTrackedFlight();
  const { setCallsign, loadFlightPath, flightPath } = useAdsbData();

  const fetchFlight = useCallback(async () => {
    if (!flight) return;

    setCallsign(flight.callsign);
    await loadFlightPath();
  }, [flight, setCallsign, loadFlightPath]);

  useEffect(() => {
    if (!flight) return;
    if (!shouldPollForAdsbData(flight.status)) return;

    fetchFlight().then();
  }, [fetchFlight, flight]);

  useEffect(() => {
    if (!flight) return;
    if (!shouldPollForAdsbData(flight.status)) return;

    const intervalId = setInterval(() => {
      fetchFlight().then();
    }, 5000);

    return () => clearInterval(intervalId);
  }, [flight, fetchFlight]);

  if (!flight) {
    return null;
  }

  const isVisibleForOthers = flight.tracking !== Tracking.Disabled;

  return (
    <TransparentContainer className={className}>
      <div className="relative w-full h-full">
        <MapSettingsProvider>
          <TrackingFlightMap />
          <LiveTelemetryOverlay point={flightPath[flightPath.length - 1]} />
          <MapPreviewStatusOverlay />
          {isVisibleForOthers && <MapLinkOverlay />}
          <MapBottomDrawer size="sm" />
        </MapSettingsProvider>
      </div>
    </TransparentContainer>
  );
}
