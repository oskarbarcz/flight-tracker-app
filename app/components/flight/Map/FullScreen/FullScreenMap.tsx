import { type FitBoundsOptions, latLngBounds } from "leaflet";
import { MapContainer } from "react-leaflet";
import { LiveTelemetryOverlay } from "~/components/flight/Map/Box/Overlay/LiveTelemetryOverlay";
import { FlightPath } from "~/components/flight/Map/Element/FlightPath";
import { GreatCirclePath } from "~/components/flight/Map/Element/GreatCirclePath";
import { MapAircraftMarker } from "~/components/flight/Map/Element/MapAircraftMarker";
import { MapAirportLabel } from "~/components/flight/Map/Element/MapAirportLabel";
import { MapBottomDrawer } from "~/components/flight/Map/Element/MapBottomDrawer";
import { MapEventsHandler } from "~/components/flight/Map/Element/MapEventsHandler";
import { MapTileLayer } from "~/components/flight/Map/Element/MapTileLayer";
import { TrackingAirportLayoutLayer } from "~/components/flight/Map/Element/TrackingAirportLayoutLayer";
import { TrackingRunwaysLayer } from "~/components/flight/Map/Element/TrackingRunwaysLayer";
import { FlightDetailsSectionOverlay } from "~/components/flight/Map/FullScreen/Overlay/FlightDetailsSectionOverlay";
import type { Flight, FlightPathElement, Position } from "~/models";
import { usePublicApi } from "~/shared/api/usePublicApi";

type Props = {
  flight: Flight;
  path: FlightPathElement[];
};

export function FullScreenMap({ flight, path }: Props) {
  const { publicRunwayService, publicTerminalService, publicParkingPositionService } = usePublicApi();
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

        <MapAirportLabel airport={flight.departureAirport} extended />
        <MapAirportLabel airport={flight.destinationAirport} extended />

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
      <LiveTelemetryOverlay point={lastPosition} />
      <FlightDetailsSectionOverlay flight={flight} />
      <MapBottomDrawer />
    </div>
  );
}
