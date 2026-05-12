"use client";

import L from "leaflet";
import { useEffect, useState } from "react";
import { MapContainer } from "react-leaflet";
import { FlightPath } from "~/components/flight/Map/Element/FlightPath";
import { GreatCirclePath } from "~/components/flight/Map/Element/GreatCirclePath";
import { MapAircraftMarker } from "~/components/flight/Map/Element/MapAircraftMarker";
import MapAirportLabel from "~/components/flight/Map/Element/MapAirportLabel";
import { MapEventsHandler } from "~/components/flight/Map/Element/MapEventsHandler";
import { MapTileLayer } from "~/components/flight/Map/Element/MapTileLayer";
import type { Flight, FlightPathElement } from "~/models";
import type { Position } from "~/models/common/geo";
import { useApi } from "~/state/api/context/useApi";

type Props = {
  flight: Flight;
};

export function HistoryFlightMap({ flight }: Props) {
  const { flightService } = useApi();
  const leafletMapOptions = {
    padding: [80, 80],
    duration: 1,
  } as L.FitBoundsOptions;

  const [flightPath, setFlightPath] = useState<FlightPathElement[]>([]);

  useEffect(() => {
    flightService.fetchFlightPath(flight.id).then(setFlightPath);
  }, [flight.id, flightService]);

  const lastPathPoint = flightPath.length > 0 ? flightPath[flightPath.length - 1] : undefined;
  const pathPoints: Position[] = flightPath.map((p) => [p.latitude, p.longitude]);

  const mapBounds = L.latLngBounds([
    [flight.departureAirport.location.latitude, flight.departureAirport.location.longitude],
    [flight.destinationAirport.location.latitude, flight.destinationAirport.location.longitude],
  ]);

  return (
    <MapContainer
      bounds={mapBounds}
      boundsOptions={{ padding: [80, 80] }}
      scrollWheelZoom={true}
      className="rounded-xl h-full w-full z-0"
      zoomControl={false}
      attributionControl={false}
    >
      <MapTileLayer />

      <GreatCirclePath start={flight.departureAirport} end={flight.destinationAirport} />
      <FlightPath path={flightPath} />

      <MapAirportLabel airport={flight.departureAirport} />
      <MapAirportLabel airport={flight.destinationAirport} />

      {flightPath.length > 0 && <MapAircraftMarker path={pathPoints} />}

      <MapEventsHandler bounds={mapBounds} options={leafletMapOptions} aircraftPosition={lastPathPoint} />
    </MapContainer>
  );
}
