import { MapContainer } from "react-leaflet";
import FlightPath from "~/components/Map/Element/FlightPath";
import MapAircraftMarker from "~/components/Map/Element/MapAircraftMarker";
import MapEventsHandler from "~/components/Map/Element/MapEventsHandler";
import { Flight, FlightPathElement } from "~/models";
import { useEffect, useMemo, useState } from "react";
import L, { LatLngExpression, LatLngTuple } from "leaflet";
import MapTileLayer from "~/components/Map/Element/MapTileLayer";
import { useAdsbService } from "~/state/hooks/api/useAdsbService";
import { MapBoxNoSignal } from "~/components/Box/Map/MapBoxNoSignal";

type Position = LatLngTuple | LatLngExpression;

type FlightTrackingMapProps = {
  flight: Flight;
};

export default function FlightTrackingMap({ flight }: FlightTrackingMapProps) {
  const adsbService = useAdsbService();
  const [path, setPath] = useState<FlightPathElement[]>([]);

  useEffect(() => {
    adsbService.getByCallsign("FIN1175").then(setPath);
  }, [adsbService, flight.callsign]);

  const pathPoints: Position[] = useMemo(
    () => path.map((p) => [p.latitude, p.longitude]),
    [path],
  );

  const bounds = useMemo(
    () => L.latLngBounds(pathPoints as LatLngTuple[]),
    [pathPoints],
  );

  if (path.length === 0) {
    return <MapBoxNoSignal />;
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
