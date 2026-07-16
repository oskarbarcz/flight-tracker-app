import { type FitBoundsOptions, latLngBounds } from "leaflet";
import { MapContainer } from "react-leaflet";
import type { Flight, FlightPathElement } from "~/features/flight";
import { LiveTelemetry } from "~/features/flight/components/Map/Box/Overlay/LiveTelemetry";
import { MapOptionsControl } from "~/features/flight/components/Map/Box/Overlay/MapOptionsControl";
import { FlightPath } from "~/features/flight/components/Map/Element/FlightPath";
import { GreatCirclePath } from "~/features/flight/components/Map/Element/GreatCirclePath";
import { MapAircraftMarker } from "~/features/flight/components/Map/Element/MapAircraftMarker";
import { MapAirportLabel } from "~/features/flight/components/Map/Element/MapAirportLabel";
import { MapEventsHandler } from "~/features/flight/components/Map/Element/MapEventsHandler";
import { MapTileLayer } from "~/features/flight/components/Map/Element/MapTileLayer";
import { TrackingAirportLayoutLayer } from "~/features/flight/components/Map/Element/TrackingAirportLayoutLayer";
import { TrackingRunwaysLayer } from "~/features/flight/components/Map/Element/TrackingRunwaysLayer";
import { FlightDetailsSectionOverlay } from "~/features/flight/components/Map/FullScreen/Overlay/FlightDetailsSectionOverlay";
import { usePublicApi } from "~/shared/api/usePublicApi";
import type { Position } from "~/shared/models/geo";

type Props = {
  flight: Flight;
  path: FlightPathElement[];
};

export function FullScreenMap({ flight, path }: Props) {
  const { publicRunwayService, publicTerminalService, publicParkingPositionService, publicGateService } =
    usePublicApi();
  const mapOptions = {
    padding: [100, 100],
    duration: 1,
  } as FitBoundsOptions;

  const lastPosition = path[path.length - 1];

  const departurePosition: Position = [
    flight.departureAirport.location.latitude,
    flight.departureAirport.location.longitude,
  ];
  const destinationPosition: Position = [
    flight.destinationAirport.location.latitude,
    flight.destinationAirport.location.longitude,
  ];

  const mapBounds = latLngBounds([departurePosition, destinationPosition]);

  return (
    <div className="grow relative rounded-2xl">
      <MapContainer
        bounds={mapBounds}
        boundsOptions={{ padding: [100, 100] }}
        scrollWheelZoom={true}
        className="rounded-2xl bg-gray-800 size-full z-10"
        zoomControl={false}
        attributionControl={false}
      >
        <MapTileLayer />
        <GreatCirclePath start={flight.departureAirport} end={flight.destinationAirport} />
        <FlightPath path={path} />

        {path.length > 0 && <MapAircraftMarker path={path} />}

        <MapAirportLabel airport={flight.departureAirport} />
        <MapAirportLabel airport={flight.destinationAirport} />

        <TrackingRunwaysLayer
          runwayService={publicRunwayService}
          departureAirportId={flight.departureAirport.id}
          destinationAirportId={flight.destinationAirport.id}
          departureRunwayId={flight.departureRunwayId}
          arrivalRunwayId={flight.arrivalRunwayId}
        />

        <TrackingAirportLayoutLayer
          terminalService={publicTerminalService}
          parkingPositionService={publicParkingPositionService}
          gateService={publicGateService}
          departureAirport={flight.departureAirport}
          destinationAirport={flight.destinationAirport}
          departureParkingPositionId={flight.departureParkingPositionId}
          arrivalParkingPositionId={flight.arrivalParkingPositionId}
        />

        <MapEventsHandler
          bounds={mapBounds}
          options={mapOptions}
          aircraftPosition={lastPosition}
          departurePosition={departurePosition}
          destinationPosition={destinationPosition}
        />
      </MapContainer>
      {lastPosition && (
        <div className="absolute left-1/2 top-3 z-20 -translate-x-1/2 rounded-lg border border-gray-200 bg-white/95 px-3 py-1.5 dark:border-gray-700 dark:bg-gray-900/95">
          <LiveTelemetry point={lastPosition} />
        </div>
      )}
      <FlightDetailsSectionOverlay flight={flight} />
      <MapOptionsControl />
    </div>
  );
}
