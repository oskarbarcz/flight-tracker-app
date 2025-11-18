"use client";

import { MapContainer } from "react-leaflet";
import { FlightPathElement } from "~/models";
import L from "leaflet";
import MapTileLayer from "~/components/flight/Map/Element/MapTileLayer";
import MapAirportLabel from "~/components/flight/Map/Element/MapAirportLabel";
import GreatCirclePath from "~/components/flight/Map/Element/GreatCirclePath";
import FlightPath from "~/components/flight/Map/Element/FlightPath";
import { Position } from "~/models/common/geo";
import MapEventsHandler from "~/components/flight/Map/Element/MapEventsHandler";
import MapAircraftMarker from "~/components/flight/Map/Element/MapAircraftMarker";
import { useTrackedFlight } from "~/state/contexts/global/tracked-flight.context";
import { useApi } from "~/state/contexts/content/api.context";
import { useEffect, useState } from "react";

export default function HistoryFlightMap() {
  const { flight } = useTrackedFlight();
  const { flightService } = useApi();
  const leafletMapOptions = {
    padding: [80, 80],
    duration: 1,
  } as L.FitBoundsOptions;

  const [flightPath, setFlightPath] = useState<FlightPathElement[]>([]);

  useEffect(() => {
    if (!flight) return;

    flightService.getFlightPath(flight.id).then(setFlightPath);
  }, [flight, flightService]);

  if (!flight) {
    return null;
  }

  const lastPathPoint =
    flightPath.length > 0 ? flightPath[flightPath.length - 1] : undefined;
  const pathPoints: Position[] = flightPath.map((p) => [
    p.latitude,
    p.longitude,
  ]);

  const mapBounds = L.latLngBounds([
    [
      flight.departureAirport.location.latitude,
      flight.departureAirport.location.longitude,
    ],
    [
      flight.destinationAirport.location.latitude,
      flight.destinationAirport.location.longitude,
    ],
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

      <GreatCirclePath
        start={flight.departureAirport}
        end={flight.destinationAirport}
      />
      <FlightPath path={flightPath} />

      <MapAirportLabel airport={flight.departureAirport} />
      <MapAirportLabel airport={flight.destinationAirport} />

      {flightPath.length > 0 && <MapAircraftMarker path={pathPoints} />}

      <MapEventsHandler
        bounds={mapBounds}
        options={leafletMapOptions}
        aircraftPosition={lastPathPoint}
      />
    </MapContainer>
  );
}
