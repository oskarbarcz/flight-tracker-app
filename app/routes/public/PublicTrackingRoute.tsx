import { useCallback, useEffect, useState } from "react";
import BottomBar from "~/components/flight/Map/FullScreen/BottomBar";
import FullScreenMap from "~/components/flight/Map/FullScreen/FullScreenMap";
import TopBar from "~/components/flight/Map/FullScreen/TopBar";
import MapSplash from "~/layout/MapSplash";
import { Flight } from "~/models";
import { useAdsbData } from "~/state/contexts/content/adsb.context";
import { usePublicApi } from "~/state/contexts/content/public-api.context";
import MapSettingsProvider from "~/state/contexts/settings/map-settings.context";
import { usePageTitle } from "~/state/hooks/usePageTitle";
import { Route } from "../../../.react-router/types/app/routes/public/+types/PublicTrackingRoute";

export default function PublicTrackingRoute({
  params,
}: Route.ClientLoaderArgs) {
  const { publicFlightService } = usePublicApi();
  const { setCallsign, flightPath, loadFlightPath } = useAdsbData();

  const [flight, setFlight] = useState<Flight | null>(null);
  const [showSplash, setShowSplash] = useState<boolean>(true);

  const fetchFlight = useCallback(async () => {
    try {
      const flightData = await publicFlightService.getById(params.id);
      setFlight(flightData);
      if (flightData) {
        setCallsign(flightData.callsign);
        await loadFlightPath();
      }
    } catch (error) {
      console.error("Error fetching flight:", error);
    }
  }, [params.id, publicFlightService, setCallsign, loadFlightPath]);

  // Initial fetch on mount
  useEffect(() => {
    fetchFlight().then();
  }, [fetchFlight]);

  // Refresh flight data every 5 seconds
  useEffect(() => {
    if (!flight) return;

    const intervalId = setInterval(() => {
      fetchFlight().then();
    }, 5000); // 5 seconds

    return () => clearInterval(intervalId);
  }, [flight, fetchFlight]);

  // Hide splash screen after 1 second
  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  usePageTitle(
    flight
      ? `Tracking flight ${flight.flightNumber}`
      : "Loading flight tracking...",
  );

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
