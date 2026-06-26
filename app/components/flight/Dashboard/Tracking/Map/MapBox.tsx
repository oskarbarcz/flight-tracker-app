import { useCallback, useEffect } from "react";
import { LiveTelemetryOverlay } from "~/components/flight/Map/Box/Overlay/LiveTelemetryOverlay";
import { MapLinkOverlay } from "~/components/flight/Map/Box/Overlay/MapLinkOverlay";
import { MapPreviewStatusOverlay } from "~/components/flight/Map/Box/Overlay/PreviewStatusOverlay";
import { TrackingFlightMap } from "~/components/flight/Map/Box/TrackingFlightMap";
import { MapBottomDrawer } from "~/components/flight/Map/Element/MapBottomDrawer";
import type { ContainerClassProps } from "~/components/shared/Layout/Container";
import { TransparentContainer } from "~/components/shared/Layout/TransparentContainer";
import { shouldPollForAdsbData, Tracking } from "~/models";
import { useAdsbData } from "~/state/api/context/useAdsbData";
import { useTrackedFlight } from "~/state/api/context/useTrackedFlight";
import { MapSettingsProvider } from "~/state/app/context/useMapSettings";

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
