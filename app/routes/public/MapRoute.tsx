import { useCallback, useEffect, useState } from "react";
import { BottomBar } from "~/components/flight/Map/FullScreen/BottomBar";
import { FullScreenMap } from "~/components/flight/Map/FullScreen/FullScreenMap";
import { TopBar } from "~/components/flight/Map/FullScreen/TopBar";
import type { Flight } from "~/models";
import MapSplash from "~/routes/public/MapSplash";
import { usePageTitle } from "~/shared/hooks/usePageTitle";
import { useAdsbData } from "~/state/api/context/useAdsbData";
import { usePublicApi } from "~/state/api/context/usePublicApi";
import { MapSettingsProvider } from "~/state/app/context/useMapSettings";
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
