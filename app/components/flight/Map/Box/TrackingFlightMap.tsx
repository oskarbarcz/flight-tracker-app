"use client";

import L from "leaflet";
import { MapContainer } from "react-leaflet";
import FlightPath from "~/components/flight/Map/Element/FlightPath";
import GreatCirclePath from "~/components/flight/Map/Element/GreatCirclePath";
import MapAircraftMarker from "~/components/flight/Map/Element/MapAircraftMarker";
import MapAirportLabel from "~/components/flight/Map/Element/MapAirportLabel";
import MapEventsHandler from "~/components/flight/Map/Element/MapEventsHandler";
import MapTileLayer from "~/components/flight/Map/Element/MapTileLayer";
import { Position } from "~/models/common/geo";
import { useAdsbData } from "~/state/contexts/content/adsb.context";
import { useTrackedFlight } from "~/state/contexts/global/tracked-flight.context";

export default function TrackingFlightMap() {
  const { flight } = useTrackedFlight();
  const { flightPath } = useAdsbData();
  const leafletMapOptions = {
    padding: [80, 80],
    duration: 1,
  } as L.FitBoundsOptions;

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
