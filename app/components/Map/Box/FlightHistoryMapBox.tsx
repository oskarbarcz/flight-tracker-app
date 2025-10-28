"use client";

import { MapContainer } from "react-leaflet";
import MapAircraftMarker from "~/components/Map/Element/MapAircraftMarker";
import MapEventsHandler from "~/components/Map/Element/MapEventsHandler";
import { Flight, FlightPathElement } from "~/models";
import { useEffect, useState } from "react";
import L, { LatLngTuple } from "leaflet";
import MapTileLayer from "~/components/Map/Element/MapTileLayer";
import { MapBoxUnavailable } from "~/components/Box/FlightTracking/Map/MapBoxUnavailable";
import MapAirportLabel from "~/components/Map/Element/MapAirportLabel";
import { useApi } from "~/state/contexts/api.context";
import GreatCirclePath from "~/components/Map/Element/GreatCirclePath";
import FlightPath from "~/components/Map/Element/FlightPath";
import { Position } from "~/models/common/geo";

type FlightHistoryMapProps = {
  flight: Flight;
};

export default function FlightHistoryMapBox({ flight }: FlightHistoryMapProps) {
  const { flightService } = useApi();
  const [path, setPath] = useState<FlightPathElement[]>([]);
  const mapOptions = {
    paddingTopLeft: [0, 70],
    paddingBottomRight: [0, 0],
    duration: 1,
  } as L.FitBoundsOptions;

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

  return (
    <MapContainer
      bounds={bounds}
      boundsOptions={{ paddingTopLeft: [0, 70], paddingBottomRight: [0, 0] }}
      scrollWheelZoom={true}
      className="rounded-xl h-full w-full z-0"
      zoomControl={false}
      attributionControl={false}
    >
      <MapTileLayer />

      <GreatCirclePath
        start={flight.departureAirport}
        end={flight.destinationAirport}
      />
      <FlightPath path={pathPoints} />

      <MapAircraftMarker path={pathPoints} />

      <MapAirportLabel
        position={startPosition}
        label={flight.departureAirport.iataCode}
      />
      <MapAirportLabel
        position={lastPosition}
        label={flight.destinationAirport.iataCode}
      />

      <MapEventsHandler bounds={bounds} options={mapOptions} />
    </MapContainer>
  );
}
