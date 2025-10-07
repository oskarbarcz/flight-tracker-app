import { Route } from "../../../.react-router/types/app/routes/public/+types/LiveTrackingRoute";
import { useLoaderData } from "react-router";
import MapTileLayer from "~/components/Map/Element/MapTileLayer";
import MapAirportLabel from "~/components/Map/Element/MapAirportLabel";
import MapEventsHandler from "~/components/Map/Element/MapEventsHandler";
import { MapContainer, TileLayer } from "react-leaflet";
import { useEffect, useState } from "react";
import {
  AirportOnFlight,
  AirportOnFlightType,
  Flight,
  FlightPathElement,
} from "~/models";
import { Position } from "~/models/common/geo";
import L, { LatLngTuple } from "leaflet";
import { UnauthorizedFlightService } from "~/state/api/flight.service";
import { MapBoxUnavailable } from "~/components/Box/FlightTracking/Map/MapBoxUnavailable";
import GreatCirclePath from "~/components/Map/Element/GreatCirclePath";
import FlightPath from "~/components/Map/Element/FlightPath";
import MapAircraftMarker from "~/components/Map/Element/MapAircraftMarker";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  return { id: params.id };
}

export default function LiveTrackingRoute() {
  const { id } = useLoaderData<typeof clientLoader>();

  const [flight, setFlight] = useState<Flight | undefined>();
  const [path, setPath] = useState<FlightPathElement[]>([]);

  useEffect(() => {
    const flightService = new UnauthorizedFlightService();
    flightService.getById(id).then(setFlight);
    flightService.getFlightPath(id).then(setPath);
  }, [id]);

  const pathPoints: Position[] = path.map((p) => [p.latitude, p.longitude]);
  const bounds = L.latLngBounds(pathPoints as LatLngTuple[]);

  if (path.length === 0) {
    return <MapBoxUnavailable />;
  }

  if (!flight) {
    return;
  }

  const startPosition = pathPoints[0];
  const lastPosition = pathPoints[pathPoints.length - 1];

  const departure = flight.airports.find(
    (a) => a.type === AirportOnFlightType.Departure,
  ) as AirportOnFlight;
  const destination = flight.airports.find(
    (a) => a.type === AirportOnFlightType.Destination,
  ) as AirportOnFlight;

  return (
    <div className="h-screen w-screen">
      <MapContainer
        bounds={bounds}
        boundsOptions={{ paddingTopLeft: [0, 70], paddingBottomRight: [0, 0] }}
        scrollWheelZoom={true}
        className="rounded-xl h-full w-full z-20"
        zoomControl={false}
        attributionControl={false}
      >
        <MapTileLayer />
        <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />

        <GreatCirclePath start={departure} end={destination} />
        <FlightPath path={pathPoints} />

        <MapAircraftMarker path={pathPoints} />

        <MapAirportLabel position={startPosition} label={departure.iataCode} />
        <MapAirportLabel position={lastPosition} label={destination.iataCode} />

        <MapEventsHandler bounds={bounds} />
      </MapContainer>
    </div>
  );
}
