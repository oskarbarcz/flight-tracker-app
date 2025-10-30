import { Route } from "../../../.react-router/types/app/routes/public/+types/PublicTrackingRoute";
import FullScreenMap from "~/components/Map/FullScreen/FullScreenMap";
import TopBar from "~/components/Map/FullScreen/TopBar";
import BottomBar from "~/components/Map/FullScreen/BottomBar";
import { usePageTitle } from "~/state/hooks/usePageTitle";
import { useAdsbData } from "~/state/contexts/adsb.context";
import { usePublicApi } from "~/state/contexts/public-api.context";
import { useEffect, useState } from "react";
import { Flight } from "~/models";
import MapSplash from "~/layout/MapSplash";

export default function PublicTrackingRoute({
  params,
}: Route.ClientLoaderArgs) {
  const { publicFlightService } = usePublicApi();
  const { setCallsign, lastRequestedAt, flightPath, loadFlightPath } =
    useAdsbData();

  const [flight, setFlight] = useState<Flight | null>(null);
  const [showSplash, setShowSplash] = useState<boolean>(true);

  // fetch flight on mount
  useEffect(() => {
    const fetchFlight = async () => {
      try {
        const flightData = await publicFlightService.getById(params.id);
        setFlight(flightData);
        if (flightData) {
          setCallsign(flightData.callsign);
        }
      } catch (error) {
        console.error("Error fetching flight:", error);
      }
    };

    fetchFlight();
  }, [params.id, publicFlightService, setCallsign]);

  // refresh
  useEffect(() => {
    if (!flight) return;

    const intervalId = setInterval(() => {
      loadFlightPath();
    }, 10000); // 10 seconds

    return () => clearInterval(intervalId);
  }, [flight, loadFlightPath]);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  usePageTitle(
    flight
      ? `Tracking flight ${flight.flightNumber}`
      : "Loading flight tracking...",
  );

  if (!flight || !lastRequestedAt || showSplash) {
    return <MapSplash />;
  }

  return (
    <div className="h-vh-safe flex flex-col items-stretch size-full p-2">
      <TopBar />
      <FullScreenMap flight={flight} path={flightPath} />
      <BottomBar lastRefreshedAt={lastRequestedAt} />
    </div>
  );
}
