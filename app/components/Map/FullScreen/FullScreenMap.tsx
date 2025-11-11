import MapTileLayer from "~/components/Map/Element/MapTileLayer";
import GreatCirclePath from "~/components/Map/Element/GreatCirclePath";
import FlightPath from "~/components/Map/Element/FlightPath";
import MapAircraftMarker from "~/components/Map/Element/MapAircraftMarker";
import MapAirportLabel from "~/components/Map/Element/MapAirportLabel";
import MapEventsHandler from "~/components/Map/Element/MapEventsHandler";
import { MapContainer } from "react-leaflet";
import { Flight, FlightPathElement, Position } from "~/models";
import FlightDetailsSectionOverlay from "~/components/Map/FullScreen/Overlay/FlightDetailsSectionOverlay";
import MapBottomDrawer from "~/components/Map/Element/MapBottomDrawer";
import { FitBoundsOptions, latLngBounds } from "leaflet";

type Props = {
  flight: Flight;
  path: FlightPathElement[];
};

export default function FullScreenMap({ flight, path }: Props) {
  const mapOptions = {
    padding: [100, 100],
    duration: 1,
  } as FitBoundsOptions;

  const pathPoints: Position[] = path.map((p) => [p.latitude, p.longitude]);
  const lastPosition = path[path.length - 1];
  const mapBounds = latLngBounds([
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
        <GreatCirclePath
          start={flight.departureAirport}
          end={flight.destinationAirport}
        />
        <FlightPath path={path} />

        {pathPoints.length && <MapAircraftMarker path={pathPoints} />}

        <MapAirportLabel airport={flight.departureAirport} extended />
        <MapAirportLabel airport={flight.destinationAirport} extended />

        <MapEventsHandler
          bounds={mapBounds}
          options={mapOptions}
          aircraftPosition={lastPosition}
        />
      </MapContainer>
      <FlightDetailsSectionOverlay flight={flight} />
      <MapBottomDrawer />
    </div>
  );
}
