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
import { useEffect, useState } from "react";
import L, { LatLngExpression, LatLngTuple } from "leaflet";
import MapTileLayer from "~/components/Map/Element/MapTileLayer";
import { MapBoxNoSignal } from "~/components/Box/Map/MapBoxNoSignal";
import MapAirportLabel from "~/components/Map/Element/MapAirportLabel";
import { useAdsbApi } from "~/state/contexts/adsb.context";

type Position = LatLngTuple | LatLngExpression;

type FlightTrackingMapProps = {
  flight: Flight;
};

export default function FlightTrackingMap({ flight }: FlightTrackingMapProps) {
  const { getRecordsByCallsign } = useAdsbApi();
  const [path, setPath] = useState<FlightPathElement[]>([]);

  useEffect(() => {
    const fetchData = () => {
      getRecordsByCallsign(flight.callsign).then(setPath);
    };
    fetchData();

    const intervalId = setInterval(fetchData, 10000);
    return () => {
      clearInterval(intervalId);
    };
  }, [flight.callsign, getRecordsByCallsign]);

  const pathPoints: Position[] = path.map((p) => [p.latitude, p.longitude]);
  const bounds = L.latLngBounds(pathPoints as LatLngTuple[]);

  if (path.length === 0) {
    return <MapBoxNoSignal />;
  }

  const startPosition = pathPoints[0];
  const departure = flight.airports.find(
    (a) => a.type === AirportOnFlightType.Departure,
  ) as AirportOnFlight;

  return (
    <MapContainer
      bounds={bounds}
      boundsOptions={{ padding: [60, 60] }}
      scrollWheelZoom={true}
      className="rounded-4xl h-full w-full"
      zoomControl={false}
      attributionControl={false}
    >
      <MapTileLayer />

      <FlightPath path={pathPoints} />
      <MapAircraftMarker path={pathPoints} />

      <MapAirportLabel position={startPosition} label={departure.iataCode} />

      <MapEventsHandler bounds={bounds} />
    </MapContainer>
  );
}
