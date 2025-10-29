import MapTileLayer from "~/components/Map/Element/MapTileLayer";
import GreatCirclePath from "~/components/Map/Element/GreatCirclePath";
import FlightPath from "~/components/Map/Element/FlightPath";
import MapAircraftMarker from "~/components/Map/Element/MapAircraftMarker";
import MapAirportLabel from "~/components/Map/Element/MapAirportLabel";
import MapEventsHandler from "~/components/Map/Element/MapEventsHandler";
import { MapContainer } from "react-leaflet";
import { Flight, FlightPathElement, Position } from "~/models";
import L, { LatLngTuple } from "leaflet";
import { MapBoxUnavailable } from "~/components/Box/FlightTracking/Map/MapBoxUnavailable";
import FlightDetailsSectionOverlay from "~/components/Map/FullScreen/Overlay/FlightDetailsSectionOverlay";

type Props = {
  flight: Flight;
  path: FlightPathElement[];
};

export default function FullScreenMap({ flight, path }: Props) {
  const mapOptions = {
    padding: [100, 100],
    duration: 1,
  } as L.FitBoundsOptions;

  const pathPoints: Position[] = path.map((p) => [p.latitude, p.longitude]);
  const bounds = L.latLngBounds(pathPoints as LatLngTuple[]);

  if (path.length === 0) {
    return <MapBoxUnavailable />;
  }

  if (!flight) {
    return;
  }

  const startPosition = pathPoints[0];
  const lastPosition = pathPoints[pathPoints.length - 1];

  return (
    <div className="grow relative rounded-2xl">
      <MapContainer
        bounds={bounds}
        boundsOptions={{ padding: [100, 100] }}
        scrollWheelZoom={true}
        className="rounded-2xl bg-gray-800 size-full z-20"
        zoomControl={false}
        attributionControl={false}
      >
        <MapTileLayer />

        <GreatCirclePath
          start={flight.departureAirport}
          end={flight.destinationAirport}
        />
        <FlightPath path={pathPoints} />

        <MapAircraftMarker path={pathPoints} />

        <MapAirportLabel
          position={startPosition}
          label={flight.departureAirport.iataCode}
        />
        <MapAirportLabel
          position={lastPosition}
          label={flight.destinationAirport.iataCode}
        />

        <MapEventsHandler bounds={bounds} options={mapOptions} />
      </MapContainer>
      <FlightDetailsSectionOverlay flight={flight} />
    </div>
  );
}
