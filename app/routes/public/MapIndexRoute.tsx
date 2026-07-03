import { useEffect, useState } from "react";
import type { Flight } from "~/features/flight";
import { TopBar } from "~/features/flight/components/Map/FullScreen/TopBar";
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
    <div className="h-dvh-safe flex flex-col items-stretch size-full p-2">
      <TopBar />
      <div className="grow relative rounded-2xl overflow-hidden">
        <BackgroundMap />
        <div className="absolute inset-0 z-20 bg-gray-950/60 backdrop-blur-[2px]" />
        <div className="absolute inset-0 z-30 flex items-center justify-center p-4">
          <FlightTrackerLauncher flights={flights} loading={loading} />
        </div>
      </div>
    </div>
  );
}
