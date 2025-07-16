import { MapContainer } from "react-leaflet";
import FlightPath from "~/components/Map/Element/FlightPath";
import MapAircraftMarker from "~/components/Map/Element/MapAircraftMarker";
import MapEventsHandler from "~/components/Map/Element/MapEventsHandler";
import { Flight, FlightPathElement } from "~/models";
import { useFlightService } from "~/state/hooks/api/useFlightService";
import { useEffect, useMemo, useState } from "react";
import L, { LatLngExpression, LatLngTuple } from "leaflet";
import MapTileLayer from "~/components/Map/Element/MapTileLayer";
import { MapBoxUnavailable } from "~/components/Box/Map/MapBoxUnavailable";

type Position = LatLngTuple | LatLngExpression;

type FlightHistoryMapProps = {
  flight: Flight;
};

export default function FlightHistoryMap({ flight }: FlightHistoryMapProps) {
  const flightService = useFlightService();
  const [path, setPath] = useState<FlightPathElement[]>([]);

  useEffect(() => {
    flightService.getFlightPath(flight.id).then(setPath);
  }, [flight.id, flightService]);

  const pathPoints: Position[] = useMemo(
    () => path.map((p) => [p.latitude, p.longitude]),
    [path],
  );

  const bounds = useMemo(
    () => L.latLngBounds(pathPoints as LatLngTuple[]),
    [pathPoints],
  );

  if (path.length === 0) {
    return <MapBoxUnavailable />;
  }

  return (
    <MapContainer
      bounds={bounds}
      boundsOptions={{ padding: [50, 50] }}
      scrollWheelZoom={true}
      className="rounded-4xl h-full w-full"
      zoomControl={false}
      attributionControl={false}
    >
      <MapTileLayer />

      <FlightPath path={pathPoints} />
      <MapAircraftMarker path={pathPoints} />

      <MapEventsHandler bounds={bounds} />
    </MapContainer>
  );
}
