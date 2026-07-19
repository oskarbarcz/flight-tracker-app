import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { MapSettingsProvider } from "~/app-state/useMapSettings";
import { useAdsbData } from "~/features/adsb/hooks/useAdsbData";
import type { Flight } from "~/features/flight";
import { FullScreenMap } from "~/features/flight/components/Map/FullScreen/FullScreenMap";
import { MapHeader } from "~/features/flight/components/Map/FullScreen/MapHeader";
import MapSplash from "~/routes/public/MapSplash";
import { usePublicApi } from "~/shared/api/usePublicApi";
import { usePageTitle } from "~/shared/hooks/usePageTitle";
import type { Route } from "../../../.react-router/types/app/routes/public/+types/MapRoute";

export default function MapRoute({ params }: Route.ClientLoaderArgs) {
  const { publicFlightService } = usePublicApi();
  const { setCallsign, flightPath, loadFlightPath, lastRequestedAt } = useAdsbData();

  const [flight, setFlight] = useState<Flight | null>(null);
  const [notFound, setNotFound] = useState<boolean>(false);
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const hasLoadedFlight = useRef<boolean>(false);

  const fetchFlight = useCallback(async () => {
    try {
      const flightData = await publicFlightService.fetchById(params.id);
      hasLoadedFlight.current = true;
      setFlight(flightData);
      if (flightData) {
        setCallsign(flightData.callsign);
        await loadFlightPath();
      }
    } catch (error) {
      console.error("Error fetching flight:", error);
      if (!hasLoadedFlight.current) {
        setNotFound(true);
      }
    }
  }, [params.id, publicFlightService, setCallsign, loadFlightPath]);

  useEffect(() => {
    fetchFlight().then();
  }, [fetchFlight]);

  useEffect(() => {
    if (!flight) return;

    const intervalId = setInterval(() => {
      fetchFlight().then();
    }, 5000);

    return () => clearInterval(intervalId);
  }, [flight, fetchFlight]);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  usePageTitle(flight ? `Tracking flight ${flight.flightNumber}` : "Loading flight tracking...");

  if (notFound) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center gap-4 bg-gray-50 p-6 text-center dark:bg-gray-950">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white md:text-3xl">Flight not found</h1>
        <p className="max-w-md text-gray-500 dark:text-gray-400">
          This flight doesn't exist or is no longer available for tracking.
        </p>
        <Link
          to="/map"
          className="rounded-lg bg-indigo-500 px-4 py-2 font-bold text-white transition-colors hover:bg-indigo-600"
        >
          Back to live map
        </Link>
      </div>
    );
  }

  if (!flight || showSplash) {
    return <MapSplash />;
  }

  return (
    <div className="relative h-dvh-safe w-full overflow-hidden bg-gray-200 dark:bg-gray-950">
      <MapSettingsProvider>
        <FullScreenMap flight={flight} path={flightPath} />
      </MapSettingsProvider>
      <MapHeader lastUpdatedAt={lastRequestedAt} />
    </div>
  );
}
