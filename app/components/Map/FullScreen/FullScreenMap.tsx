import MapTileLayer from "~/components/Map/Element/MapTileLayer";
import GreatCirclePath from "~/components/Map/Element/GreatCirclePath";
import FlightPath from "~/components/Map/Element/FlightPath";
import MapAircraftMarker from "~/components/Map/Element/MapAircraftMarker";
import MapAirportLabel from "~/components/Map/Element/MapAirportLabel";
import MapEventsHandler from "~/components/Map/Element/MapEventsHandler";
import { MapContainer } from "react-leaflet";
import { useAdsbApi } from "~/state/contexts/adsb.context";
import { usePublicApi } from "~/state/contexts/public-api.context";
import { useEffect, useState } from "react";
import { Flight, FlightPathElement, Position } from "~/models";
import L, { LatLngTuple } from "leaflet";
import { MapBoxUnavailable } from "~/components/Box/FlightTracking/Map/MapBoxUnavailable";
import FlightDetailsSectionOverlay from "~/components/Map/FullScreen/Overlay/FlightDetailsSectionOverlay";

type FullScreenMapProps = {
  flightId: string;
};

export default function FullScreenMap({ flightId }: FullScreenMapProps) {
  const adsbApi = useAdsbApi();
  const { publicFlightService } = usePublicApi();
  const mapOptions = {
    padding: [100, 100],
    duration: 1,
  } as L.FitBoundsOptions;

  const [flight, setFlight] = useState<Flight | undefined>();
  const [path, setPath] = useState<FlightPathElement[]>([]);

  useEffect(() => {
    publicFlightService.getById(flightId).then(setFlight);
  }, [flightId, publicFlightService]);

  useEffect(() => {
    if (!flight) {
      return;
    }

    const fetchPath = () => {
      adsbApi.getRecordsByCallsign(flight.callsign).then(setPath);
    };
    fetchPath();

    const intervalId = setInterval(fetchPath, 10000);
    return () => {
      clearInterval(intervalId);
    };
  }, [adsbApi, flight]);

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
    <MapContainer
      bounds={bounds}
      boundsOptions={{ padding: [100, 100] }}
      scrollWheelZoom={true}
      className="h-screen w-screen z-20"
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

      <FlightDetailsSectionOverlay flight={flight} />

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
  );
}
