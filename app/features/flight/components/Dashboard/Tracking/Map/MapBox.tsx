import type { Ref } from "react";
import { twMerge } from "tailwind-merge";
import { type MapIntent, MapSettingsProvider } from "~/app-state/useMapSettings";
import { useAdsbData } from "~/features/adsb/hooks/useAdsbData";
import { Tracking } from "~/features/flight";
import { LiveTelemetry } from "~/features/flight/components/Map/Box/Overlay/LiveTelemetry";
import { MapOptionsControl } from "~/features/flight/components/Map/Box/Overlay/MapOptionsControl";
import { MapShareLinks } from "~/features/flight/components/Map/Box/Overlay/MapShareLinks";
import { TrackingFlightMap } from "~/features/flight/components/Map/Box/TrackingFlightMap";
import { useTrackedFlight } from "~/features/flight/hooks/useTrackedFlight";
import type { ContainerClassProps } from "~/shared/ui/Layout/Container";

type MapBoxProps = ContainerClassProps & {
  ref?: Ref<HTMLDivElement>;
  mapIntent: MapIntent;
  topInset: number;
};

export function MapBox({ ref, className, mapIntent, topInset }: MapBoxProps) {
  const { flight } = useTrackedFlight();
  const { flightPath } = useAdsbData();

  if (!flight) {
    return null;
  }

  const lastPoint = flightPath[flightPath.length - 1];
  const canShare = flight.tracking !== Tracking.Disabled;

  return (
    <div ref={ref} className={twMerge("relative", className)}>
      <MapSettingsProvider intent={mapIntent}>
        <TrackingFlightMap topInset={topInset} />
        <div className="pointer-events-none absolute inset-x-0 bottom-3 z-20 md:bottom-6">
          <div className="mx-auto flex max-w-7xl flex-wrap items-end justify-between gap-2 px-3 md:px-6">
            <MapOptionsControl size="sm" triggerClassName="pointer-events-auto relative" />
            {(lastPoint || canShare) && (
              <div className="pointer-events-auto flex flex-wrap items-center justify-end gap-x-3 gap-y-2 rounded-xl border border-gray-200 bg-white px-3 py-2 dark:border-gray-700 dark:bg-gray-900">
                <LiveTelemetry point={lastPoint} />
                {canShare && <MapShareLinks flightId={flight.id} />}
              </div>
            )}
          </div>
        </div>
      </MapSettingsProvider>
    </div>
  );
}
