import { FitBoundsOptions, latLngBounds } from "leaflet";
import { MapContainer } from "react-leaflet";
import FlightPath from "~/components/flight/Map/Element/FlightPath";
import GreatCirclePath from "~/components/flight/Map/Element/GreatCirclePath";
import MapAircraftMarker from "~/components/flight/Map/Element/MapAircraftMarker";
import MapAirportLabel from "~/components/flight/Map/Element/MapAirportLabel";
import MapBottomDrawer from "~/components/flight/Map/Element/MapBottomDrawer";
import MapEventsHandler from "~/components/flight/Map/Element/MapEventsHandler";
import MapTileLayer from "~/components/flight/Map/Element/MapTileLayer";
import FlightDetailsSectionOverlay from "~/components/flight/Map/FullScreen/Overlay/FlightDetailsSectionOverlay";
import { Flight, FlightPathElement, Position } from "~/models";

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

        {pathPoints.length > 0 && <MapAircraftMarker path={pathPoints} />}

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
