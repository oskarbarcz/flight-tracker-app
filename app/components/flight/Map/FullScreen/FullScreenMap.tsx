import { type FitBoundsOptions, latLngBounds } from "leaflet";
import { MapContainer } from "react-leaflet";
import { FlightPath } from "~/components/flight/Map/Element/FlightPath";
import { GreatCirclePath } from "~/components/flight/Map/Element/GreatCirclePath";
import { MapAircraftMarker } from "~/components/flight/Map/Element/MapAircraftMarker";
import MapAirportLabel from "~/components/flight/Map/Element/MapAirportLabel";
import { MapBottomDrawer } from "~/components/flight/Map/Element/MapBottomDrawer";
import { MapEventsHandler } from "~/components/flight/Map/Element/MapEventsHandler";
import { MapTileLayer } from "~/components/flight/Map/Element/MapTileLayer";
import { TrackingRunwaysLayer } from "~/components/flight/Map/Element/TrackingRunwaysLayer";
import { FlightDetailsSectionOverlay } from "~/components/flight/Map/FullScreen/Overlay/FlightDetailsSectionOverlay";
import type { Flight, FlightPathElement, Position } from "~/models";
import { usePublicApi } from "~/state/api/context/usePublicApi";

type Props = {
  flight: Flight;
  path: FlightPathElement[];
};

export default function FullScreenMap({ flight, path }: Props) {
  const { publicRunwayService } = usePublicApi();
  const mapOptions = {
    padding: [100, 100],
    duration: 1,
  } as FitBoundsOptions;

  const pathPoints: Position[] = path.map((p) => [p.latitude, p.longitude]);
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

        {pathPoints.length > 0 && <MapAircraftMarker path={pathPoints} />}

        <MapAirportLabel airport={flight.departureAirport} extended />
        <MapAirportLabel airport={flight.destinationAirport} extended />

        <TrackingRunwaysLayer
          runwayService={publicRunwayService}
          departureAirportId={flight.departureAirport.id}
          destinationAirportId={flight.destinationAirport.id}
          departureRunwayId={flight.departureRunwayId}
          arrivalRunwayId={flight.arrivalRunwayId}
        />

        <MapEventsHandler
          bounds={mapBounds}
          options={mapOptions}
          aircraftPosition={lastPosition}
          departurePosition={departurePosition}
          destinationPosition={destinationPosition}
        />
      </MapContainer>
      <FlightDetailsSectionOverlay flight={flight} />
      <MapBottomDrawer />
    </div>
  );
}
