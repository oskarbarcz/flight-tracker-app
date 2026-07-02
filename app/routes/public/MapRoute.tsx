import { useCallback, useEffect, useState } from "react";
import { MapSettingsProvider } from "~/app-state/useMapSettings";
import { useAdsbData } from "~/features/adsb/hooks/useAdsbData";
import type { Flight } from "~/features/flight";
import { BottomBar } from "~/features/flight/components/Map/FullScreen/BottomBar";
import { FullScreenMap } from "~/features/flight/components/Map/FullScreen/FullScreenMap";
import { TopBar } from "~/features/flight/components/Map/FullScreen/TopBar";
import MapSplash from "~/routes/public/MapSplash";
import { usePublicApi } from "~/shared/api/usePublicApi";
import { usePageTitle } from "~/shared/hooks/usePageTitle";
import type { Route } from "../../../.react-router/types/app/routes/public/+types/MapRoute";

export default function MapRoute({ params }: Route.ClientLoaderArgs) {
  const { publicFlightService } = usePublicApi();
  const { setCallsign, flightPath, loadFlightPath } = useAdsbData();

  const [flight, setFlight] = useState<Flight | null>(null);
  const [showSplash, setShowSplash] = useState<boolean>(true);

  const fetchFlight = useCallback(async () => {
    try {
      const flightData = await publicFlightService.fetchById(params.id);
      setFlight(flightData);
      if (flightData) {
        setCallsign(flightData.callsign);
        await loadFlightPath();
      }
    } catch (error) {
      console.error("Error fetching flight:", error);
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

  if (!flight || showSplash) {
    return <MapSplash />;
  }

  return (
    <div className="h-dvh-safe flex flex-col items-stretch size-full p-2">
      <TopBar />
      <MapSettingsProvider>
        <FullScreenMap flight={flight} path={flightPath} />
      </MapSettingsProvider>
      <BottomBar />
    </div>
  );
}
