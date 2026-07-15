import L from "leaflet";
import { useEffect, useState } from "react";
import { FaClockRotateLeft } from "react-icons/fa6";
import { MapContainer } from "react-leaflet";
import type { Diversion } from "~/features/diversion";
import { type Flight, type FlightPathElement, Tracking } from "~/features/flight";
import { MapTopBar } from "~/features/flight/components/Map/Box/Overlay/MapTopBar";
import { DiversionRoute } from "~/features/flight/components/Map/Element/DiversionRoute";
import { FlightPath } from "~/features/flight/components/Map/Element/FlightPath";
import { GreatCirclePath } from "~/features/flight/components/Map/Element/GreatCirclePath";
import { MapAircraftMarker } from "~/features/flight/components/Map/Element/MapAircraftMarker";
import { MapAirportLabel } from "~/features/flight/components/Map/Element/MapAirportLabel";
import { MapEventsHandler } from "~/features/flight/components/Map/Element/MapEventsHandler";
import { MapTileLayer } from "~/features/flight/components/Map/Element/MapTileLayer";
import { flightMapPositions } from "~/features/flight/lib/flightMapBounds";
import { useApi } from "~/shared/api/useApi";

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
      <MapTopBar flightId={flight.id} canShare={flight.tracking !== Tracking.Disabled}>
        <span className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.08em] text-gray-500 dark:text-gray-400">
          <FaClockRotateLeft className="size-3" />
          Historic flight path
        </span>
      </MapTopBar>
    </div>
  );
}
