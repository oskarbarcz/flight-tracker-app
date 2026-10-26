import { twMerge } from "tailwind-merge";
import { type MapIntent, MapSettingsProvider } from "~/app-state/useMapSettings";
import { useAdsbData } from "~/features/adsb/hooks/useAdsbData";
import { Tracking } from "~/features/flight";
import { LiveTelemetry } from "~/features/flight/components/Map/Box/Overlay/LiveTelemetry";
import { MapOptionsControl } from "~/features/flight/components/Map/Box/Overlay/MapOptionsControl";
import { MapTopBar } from "~/features/flight/components/Map/Box/Overlay/MapTopBar";
import { TrackingFlightMap } from "~/features/flight/components/Map/Box/TrackingFlightMap";
import { useTrackedFlight } from "~/features/flight/hooks/useTrackedFlight";
import { useMapMaximize } from "~/shared/hooks/useMapMaximize";
import type { ContainerClassProps } from "~/shared/ui/Layout/Container";
import { TransparentContainer } from "~/shared/ui/Layout/TransparentContainer";

type MapBoxProps = ContainerClassProps & {
  mapIntent: MapIntent;
};

export function MapBox({ className, mapIntent }: MapBoxProps) {
  const { flight } = useTrackedFlight();
  const { flightPath } = useAdsbData();
  const { isMaximized, toggle, containerRef, containerClassName } = useMapMaximize();

  if (!flight) {
    return null;
  }

  return (
    <TransparentContainer className={className}>
      <div ref={containerRef} className={twMerge("relative h-full w-full", containerClassName)}>
        <MapSettingsProvider intent={mapIntent}>
          <TrackingFlightMap />
          <MapTopBar
            flightId={flight.id}
            canShare={flight.tracking !== Tracking.Disabled}
            isMaximized={isMaximized}
            onToggleMaximize={toggle}
            center={<LiveTelemetry point={flightPath[flightPath.length - 1]} />}
          />
          <MapOptionsControl
            size="sm"
            triggerClassName={isMaximized ? "top-16 left-3" : "bottom-3 left-3"}
            placement={isMaximized ? "below" : "above"}
          />
        </MapSettingsProvider>
      </div>
    </TransparentContainer>
  );
}
