import L from "leaflet";
import { useEffect, useState } from "react";
import { FaClockRotateLeft } from "react-icons/fa6";
import { MapContainer } from "react-leaflet";
import { LiveTelemetryOverlay } from "~/components/flight/Map/Box/Overlay/LiveTelemetryOverlay";
import { DiversionRoute } from "~/components/flight/Map/Element/DiversionRoute";
import { FlightPath } from "~/components/flight/Map/Element/FlightPath";
import { GreatCirclePath } from "~/components/flight/Map/Element/GreatCirclePath";
import { MapAircraftMarker } from "~/components/flight/Map/Element/MapAircraftMarker";
import { MapAirportLabel } from "~/components/flight/Map/Element/MapAirportLabel";
import { MapEventsHandler } from "~/components/flight/Map/Element/MapEventsHandler";
import { MapTileLayer } from "~/components/flight/Map/Element/MapTileLayer";
import { flightMapPositions } from "~/functions/flightMapBounds";
import type { Diversion, Flight, FlightPathElement } from "~/models";
import { useApi } from "~/state/api/context/useApi";

type Props = {
  flight: Flight;
  diversion?: Diversion | null;
};

export function HistoryFlightMap({ flight, diversion = null }: Props) {
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

  const { departurePosition, destinationPosition, boundsPoints } = flightMapPositions(flight, diversion);
  const mapBounds = L.latLngBounds(boundsPoints);

  return (
    <div className="relative h-full w-full">
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
        <DiversionRoute origin={flight.departureAirport} diversion={diversion} />
        <FlightPath path={flightPath} />

        <MapAirportLabel airport={flight.departureAirport} />
        <MapAirportLabel airport={flight.destinationAirport} />

        {flightPath.length > 0 && <MapAircraftMarker path={flightPath} />}

        <MapEventsHandler
          bounds={mapBounds}
          options={leafletMapOptions}
          aircraftPosition={lastPathPoint}
          departurePosition={departurePosition}
          destinationPosition={destinationPosition}
        />
      </MapContainer>
      <div className="absolute top-3 left-3 bg-white w-fit flex items-center gap-2 rounded-lg px-3 py-1.5 z-10 dark:bg-gray-900">
        <FaClockRotateLeft className="text-gray-500" />
        <span className="uppercase font-bold text-xs">Historic data</span>
      </div>
      <LiveTelemetryOverlay point={lastPathPoint} />
    </div>
  );
}
