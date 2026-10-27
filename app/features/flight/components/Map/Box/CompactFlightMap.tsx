import Arc from "arc";
import L, { type LatLngTuple } from "leaflet";
import { useCallback, useEffect, useMemo } from "react";
import { LuMaximize2 } from "react-icons/lu";
import { MapContainer, useMap } from "react-leaflet";
import { Link } from "react-router";
import { twMerge } from "tailwind-merge";
import { AdsbProvider, useAdsbData } from "~/features/adsb/hooks/useAdsbData";
import type { Airport } from "~/features/airport";
import { type Flight, isInFlightStatus } from "~/features/flight";
import { FlightPath } from "~/features/flight/components/Map/Element/FlightPath";
import { GreatCirclePath } from "~/features/flight/components/Map/Element/GreatCirclePath";
import { MapAircraftMarker } from "~/features/flight/components/Map/Element/MapAircraftMarker";
import { MapAirportLabel } from "~/features/flight/components/Map/Element/MapAirportLabel";
import { MapResizeHandler } from "~/features/flight/components/Map/Element/MapResizeHandler";
import { MapTileLayer } from "~/features/flight/components/Map/Element/MapTileLayer";
import { TrackingView, trackFlightPath } from "~/features/flight/lib/trackingView";

const POLL_INTERVAL_MS = 5000;

const FIT_OPTIONS: L.FitBoundsOptions = { padding: [28, 28], maxZoom: 8 };

function routeBounds(departure: Airport, destination: Airport): L.LatLngBounds {
  const from = departure.location;
  const to = destination.location;
  const endpoints: LatLngTuple[] = [
    [from.latitude, from.longitude],
    [to.latitude, to.longitude],
  ];

  const sameAirport = from.latitude === to.latitude && from.longitude === to.longitude;
  if (sameAirport) {
    return L.latLngBounds(endpoints);
  }

  const { geometries } = new Arc.GreatCircle(
    { x: from.longitude, y: from.latitude },
    { x: to.longitude, y: to.latitude },
  ).Arc(32, { offset: 10 });
  const arcPoints =
    geometries.length === 1
      ? geometries[0].coords
          .filter(([lon, lat]) => Number.isFinite(lat) && Number.isFinite(lon))
          .map(([lon, lat]): LatLngTuple => [lat, lon])
      : [];

  return L.latLngBounds([...endpoints, ...arcPoints]);
}

function FitRoute({ bounds }: { bounds: L.LatLngBounds }) {
  const map = useMap();

  useEffect(() => {
    const fit = () => map.fitBounds(bounds, FIT_OPTIONS);
    fit();
    map.on("resize", fit);
    return () => {
      map.off("resize", fit);
    };
  }, [map, bounds]);

  return null;
}

type Props = {
  flight: Flight;
  className?: string;
};

export function CompactFlightMap(props: Props) {
  return (
    <AdsbProvider>
      <CompactFlightMapContent {...props} />
    </AdsbProvider>
  );
}

function CompactFlightMapContent({ flight, className }: Props) {
  const { setCallsign, loadFlightPath, flightPath } = useAdsbData();
  const inFlight = isInFlightStatus(flight.status);
  const { departureAirport, destinationAirport } = flight;

  const bounds = useMemo(
    () => routeBounds(departureAirport, destinationAirport),
    [departureAirport, destinationAirport],
  );

  const fetchPath = useCallback(async () => {
    setCallsign(flight.callsign);
    await loadFlightPath();
  }, [flight.callsign, setCallsign, loadFlightPath]);

  useEffect(() => {
    if (!inFlight) return;
    fetchPath().then();
    const intervalId = setInterval(() => fetchPath().then(), POLL_INTERVAL_MS);
    return () => clearInterval(intervalId);
  }, [inFlight, fetchPath]);

  const showsAircraft = inFlight && flightPath.length > 0;

  return (
    <div className={twMerge("group relative isolate overflow-hidden", className)}>
      <div inert className="absolute inset-0">
        <MapContainer
          bounds={bounds}
          boundsOptions={FIT_OPTIONS}
          dragging={false}
          touchZoom={false}
          doubleClickZoom={false}
          scrollWheelZoom={false}
          boxZoom={false}
          keyboard={false}
          zoomControl={false}
          attributionControl={false}
          className="z-0 h-full w-full"
        >
          <MapTileLayer />
          <GreatCirclePath start={departureAirport} end={destinationAirport} />
          {showsAircraft && <FlightPath path={flightPath} />}
          <MapAirportLabel airport={departureAirport} />
          <MapAirportLabel airport={destinationAirport} />
          {showsAircraft && <MapAircraftMarker path={flightPath} />}
          <FitRoute bounds={bounds} />
          <MapResizeHandler />
        </MapContainer>
      </div>

      <Link
        to={trackFlightPath(flight.id, TrackingView.Tracking)}
        viewTransition
        aria-label={`Open the tracking map for ${flight.flightNumber}`}
        className="absolute inset-0 z-10 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-500 dark:focus-visible:ring-indigo-400"
      >
        <span className="absolute right-2 top-2 flex size-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-700 transition-colors group-hover:border-indigo-200 group-hover:bg-indigo-50 group-hover:text-indigo-700 motion-reduce:transition-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:group-hover:border-indigo-800 dark:group-hover:bg-gray-800 dark:group-hover:text-indigo-300">
          <LuMaximize2 className="size-4" aria-hidden={true} />
        </span>
      </Link>

      <div className="absolute bottom-1 right-1 z-20 rounded bg-white/80 px-1.5 py-0.5 text-2xs text-gray-500 dark:bg-gray-900/80 dark:text-gray-400">
        ©{" "}
        <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer" className="hover:underline">
          OpenStreetMap
        </a>
      </div>
    </div>
  );
}
