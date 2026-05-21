"use client";

import L from "leaflet";
import { MapContainer } from "react-leaflet";
import { FlightPath } from "~/components/flight/Map/Element/FlightPath";
import { GreatCirclePath } from "~/components/flight/Map/Element/GreatCirclePath";
import { MapAircraftMarker } from "~/components/flight/Map/Element/MapAircraftMarker";
import MapAirportLabel from "~/components/flight/Map/Element/MapAirportLabel";
import { MapEventsHandler } from "~/components/flight/Map/Element/MapEventsHandler";
import { MapTileLayer } from "~/components/flight/Map/Element/MapTileLayer";
import { TrackingRunwaysLayer } from "~/components/flight/Map/Element/TrackingRunwaysLayer";
import type { Position } from "~/models/common/geo";
import { useAdsbData } from "~/state/api/context/useAdsbData";
import { useApi } from "~/state/api/context/useApi";
import { useTrackedFlight } from "~/state/api/context/useTrackedFlight";

export function TrackingFlightMap() {
  const { flight } = useTrackedFlight();
  const { flightPath } = useAdsbData();
  const { runwayService } = useApi();
  const leafletMapOptions = {
    padding: [80, 80],
    duration: 1,
  } as L.FitBoundsOptions;

  if (!flight) {
    return null;
  }

  const lastPathPoint = flightPath.length > 0 ? flightPath[flightPath.length - 1] : undefined;
  const pathPoints: Position[] = flightPath.map((p) => [p.latitude, p.longitude]);

  const departurePosition: Position = [
    flight.departureAirport.location.latitude,
    flight.departureAirport.location.longitude,
  ];
  const destinationPosition: Position = [
    flight.destinationAirport.location.latitude,
    flight.destinationAirport.location.longitude,
  ];

  const mapBounds = L.latLngBounds([departurePosition, destinationPosition]);

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

      <TrackingRunwaysLayer
        runwayService={runwayService}
        departureAirportId={flight.departureAirport.id}
        destinationAirportId={flight.destinationAirport.id}
        departureRunwayId={flight.departureRunwayId}
        arrivalRunwayId={flight.arrivalRunwayId}
      />

      {flightPath.length > 0 && <MapAircraftMarker path={pathPoints} />}

      <MapEventsHandler
        bounds={mapBounds}
        options={leafletMapOptions}
        aircraftPosition={lastPathPoint}
        departurePosition={departurePosition}
        destinationPosition={destinationPosition}
      />
    </MapContainer>
  );
}
