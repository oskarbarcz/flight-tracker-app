import { useEffect, useState } from "react";
import type { Flight } from "~/features/flight";
import { MapHeader } from "~/features/flight/components/Map/FullScreen/MapHeader";
import { BackgroundMap } from "~/features/flight/components/Map/Landing/BackgroundMap";
import { FlightTrackerLauncher } from "~/features/flight/components/Map/Landing/FlightTrackerLauncher";
import { usePublicApi } from "~/shared/api/usePublicApi";
import { usePageTitle } from "~/shared/hooks/usePageTitle";

export default function MapIndexRoute() {
  const { publicFlightService } = usePublicApi();
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  usePageTitle("Live flight map");

  useEffect(() => {
    let active = true;

    publicFlightService
      .fetchOngoingFlights()
      .then((data) => {
        if (active) setFlights(data);
      })
      .catch((error) => {
        console.error("Error fetching ongoing flights:", error);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [publicFlightService]);

  return (
    <div className="relative h-dvh-safe w-full overflow-hidden bg-gray-200 dark:bg-gray-950">
      <BackgroundMap />
      <div className="absolute inset-0 z-20 bg-gray-100/40 dark:bg-gray-950/60" />
      <MapHeader />
      <div className="absolute inset-0 z-30 flex items-center justify-center overflow-y-auto p-4 pt-20">
        <FlightTrackerLauncher flights={flights} loading={loading} />
      </div>
    </div>
  );
}
