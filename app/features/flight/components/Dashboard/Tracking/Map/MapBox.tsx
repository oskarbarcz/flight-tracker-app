import { useCallback, useEffect } from "react";
import { twMerge } from "tailwind-merge";
import { MapSettingsProvider } from "~/app-state/useMapSettings";
import { useAdsbData } from "~/features/adsb/hooks/useAdsbData";
import { FlightEventType, shouldPollForAdsbData, Tracking } from "~/features/flight";
import { AdsbStatusIndicator } from "~/features/flight/components/Map/Box/Overlay/AdsbStatusIndicator";
import { LiveTelemetryOverlay } from "~/features/flight/components/Map/Box/Overlay/LiveTelemetryOverlay";
import { MapOptionsControl } from "~/features/flight/components/Map/Box/Overlay/MapOptionsControl";
import { MapTopBar } from "~/features/flight/components/Map/Box/Overlay/MapTopBar";
import { TrackingFlightMap } from "~/features/flight/components/Map/Box/TrackingFlightMap";
import { useTrackedFlight } from "~/features/flight/hooks/useTrackedFlight";
import { useMapMaximize } from "~/shared/hooks/useMapMaximize";
import type { ContainerClassProps } from "~/shared/ui/Layout/Container";
import { TransparentContainer } from "~/shared/ui/Layout/TransparentContainer";

type MapBoxProps = ContainerClassProps;

export function MapBox({ className }: MapBoxProps) {
  const { flight, events } = useTrackedFlight();
  const { setCallsign, loadFlightPath, flightPath } = useAdsbData();
  const { isMaximized, toggle, containerRef, containerClassName } = useMapMaximize();

  const hasLivePositionReceived = events.some((event) => event.type === FlightEventType.LivePositionReceived);

  const fetchFlight = useCallback(async () => {
    if (!flight) return;

    setCallsign(flight.callsign);
    await loadFlightPath();
  }, [flight, setCallsign, loadFlightPath]);

  useEffect(() => {
    if (!flight) return;
    if (!shouldPollForAdsbData(flight.status, hasLivePositionReceived)) return;

    fetchFlight().then();
  }, [fetchFlight, flight, hasLivePositionReceived]);

  useEffect(() => {
    if (!flight) return;
    if (!shouldPollForAdsbData(flight.status, hasLivePositionReceived)) return;

    const intervalId = setInterval(() => {
      fetchFlight().then();
    }, 5000);

    return () => clearInterval(intervalId);
  }, [flight, fetchFlight, hasLivePositionReceived]);

  if (!flight) {
    return null;
  }

  return (
    <TransparentContainer className={className}>
      <div ref={containerRef} className={twMerge("relative h-full w-full", containerClassName)}>
        <MapSettingsProvider>
          <TrackingFlightMap />
          <MapTopBar
            flightId={flight.id}
            canShare={flight.tracking !== Tracking.Disabled}
            isMaximized={isMaximized}
            onToggleMaximize={toggle}
          >
            <AdsbStatusIndicator status={flight.status} isOnline={flightPath.length > 0} />
          </MapTopBar>
          <LiveTelemetryOverlay point={flightPath[flightPath.length - 1]} className="top-14" />
          <MapOptionsControl size="sm" />
        </MapSettingsProvider>
      </div>
    </TransparentContainer>
  );
}
