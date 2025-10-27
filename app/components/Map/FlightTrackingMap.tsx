"use client";

import { MapContainer } from "react-leaflet";
import FlightPath from "~/components/Map/Element/FlightPath";
import MapAircraftMarker from "~/components/Map/Element/MapAircraftMarker";
import MapEventsHandler from "~/components/Map/Element/MapEventsHandler";
import { Flight, FlightPathElement } from "~/models";
import { useEffect, useState } from "react";
import L from "leaflet";
import MapTileLayer from "~/components/Map/Element/MapTileLayer";
import { MapBoxNoSignal } from "~/components/Box/FlightTracking/Map/MapBoxNoSignal";
import MapAirportLabel from "~/components/Map/Element/MapAirportLabel";
import { useAdsbApi } from "~/state/contexts/adsb.context";
import GreatCirclePath from "~/components/Map/Element/GreatCirclePath";
import { Position } from "~/models/common/geo";

type FlightTrackingMapProps = {
  flight: Flight;
};

export default function FlightTrackingMap({ flight }: FlightTrackingMapProps) {
  const adsbApi = useAdsbApi();
  const [path, setPath] = useState<FlightPathElement[]>([]);

  useEffect(() => {
    const fetchData = () => {
      adsbApi.getRecordsByCallsign(flight.callsign).then(setPath);
    };
    fetchData();

    const intervalId = setInterval(fetchData, 10000);
    return () => {
      clearInterval(intervalId);
    };
  }, [flight.callsign, adsbApi]);

  const pathPoints: Position[] = path.map((p) => [p.latitude, p.longitude]);
  // const bounds = L.latLngBounds(pathPoints as LatLngTuple[]);

  if (path.length === 0) {
    return <MapBoxNoSignal />;
  }

  const departure = flight.departureAirport;
  const destination = flight.destinationAirport;
  const planBounds = L.latLngBounds([
    [departure.location.latitude, departure.location.longitude],
    [destination.location.latitude, destination.location.longitude],
  ]);

  return (
    <MapContainer
      bounds={planBounds}
      boundsOptions={{ padding: [60, 60] }}
      scrollWheelZoom={true}
      className="bg-gray-800 h-full w-full z-0"
      zoomControl={false}
      attributionControl={false}
    >
      <MapTileLayer />

      <FlightPath path={pathPoints} />
      <GreatCirclePath start={departure} end={destination} />

      <MapAircraftMarker path={pathPoints} />

      <MapAirportLabel
        position={[departure.location.latitude, departure.location.longitude]}
        label={departure.iataCode}
      />
      <MapAirportLabel
        position={[
          destination.location.latitude,
          destination.location.longitude,
        ]}
        label={destination.iataCode}
      />

      <MapEventsHandler bounds={planBounds} />
    </MapContainer>
  );
}
