"use client";

import { MapContainer } from "react-leaflet";
import FlightPath from "~/components/Map/Element/FlightPath";
import MapAircraftMarker from "~/components/Map/Element/MapAircraftMarker";
import MapEventsHandler from "~/components/Map/Element/MapEventsHandler";
import {
  AirportOnFlight,
  AirportOnFlightType,
  Flight,
  FlightPathElement,
} from "~/models";
import { useFlightService } from "~/state/hooks/api/useFlightService";
import { useEffect, useState } from "react";
import L, { LatLngExpression, LatLngTuple } from "leaflet";
import MapTileLayer from "~/components/Map/Element/MapTileLayer";
import { MapBoxUnavailable } from "~/components/Box/Map/MapBoxUnavailable";
import MapAirportLabel from "~/components/Map/Element/MapAirportLabel";

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

  const pathPoints: Position[] = path.map((p) => [p.latitude, p.longitude]);
  const bounds = L.latLngBounds(pathPoints as LatLngTuple[]);

  if (path.length === 0) {
    return <MapBoxUnavailable />;
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
    <MapContainer
      bounds={bounds}
      boundsOptions={{ paddingTopLeft: [0, 70], paddingBottomRight: [0, 0] }}
      scrollWheelZoom={true}
      className="rounded-4xl h-full w-full z-0"
      zoomControl={false}
      attributionControl={false}
    >
      <MapTileLayer />

      <FlightPath path={pathPoints} />
      <MapAircraftMarker path={pathPoints} />

      <MapAirportLabel position={startPosition} label={departure.iataCode} />
      <MapAirportLabel position={lastPosition} label={destination.iataCode} />

      <MapEventsHandler bounds={bounds} />
    </MapContainer>
  );
}
