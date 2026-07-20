import L from "leaflet";
import { useMemo } from "react";
import { MapContainer } from "react-leaflet";
import { useAdsbData } from "~/features/adsb/hooks/useAdsbData";
import { DiversionRoute } from "~/features/flight/components/Map/Element/DiversionRoute";
import { FlightPath } from "~/features/flight/components/Map/Element/FlightPath";
import { GreatCirclePath } from "~/features/flight/components/Map/Element/GreatCirclePath";
import { MapAircraftMarker } from "~/features/flight/components/Map/Element/MapAircraftMarker";
import { MapAirportLabel } from "~/features/flight/components/Map/Element/MapAirportLabel";
import { MapEventsHandler } from "~/features/flight/components/Map/Element/MapEventsHandler";
import { MapResizeHandler } from "~/features/flight/components/Map/Element/MapResizeHandler";
import { MapTileLayer } from "~/features/flight/components/Map/Element/MapTileLayer";
import { MapWorldConstraint } from "~/features/flight/components/Map/Element/MapWorldConstraint";
import { TrackingAirportLayoutLayer } from "~/features/flight/components/Map/Element/TrackingAirportLayoutLayer";
import { TrackingRunwaysLayer } from "~/features/flight/components/Map/Element/TrackingRunwaysLayer";
import { useTrackedFlight } from "~/features/flight/hooks/useTrackedFlight";
import { flightMapPositions } from "~/features/flight/lib/flightMapBounds";
import { useApi } from "~/shared/api/useApi";

export function TrackingFlightMap() {
  const { flight, diversion } = useTrackedFlight();
  const { flightPath } = useAdsbData();
  const { runwayService, terminalService, parkingPositionService, gateService } = useApi();
  const cachedParkingPositionService = useMemo(
    () => ({ fetchAll: (airportId: string) => parkingPositionService.fetchAllCached(airportId) }),
    [parkingPositionService],
  );
  const leafletMapOptions = {
    padding: [80, 80],
    duration: 1,
  } as L.FitBoundsOptions;

  if (!flight) {
    return null;
  }

  const lastPathPoint = flightPath.length > 0 ? flightPath[flightPath.length - 1] : undefined;

  const { departurePosition, destinationPosition, boundsPoints } = flightMapPositions(flight, diversion);
  const mapBounds = L.latLngBounds(boundsPoints);

  return (
    <MapContainer
      bounds={mapBounds}
      boundsOptions={{ padding: [80, 80] }}
      scrollWheelZoom={true}
      className="rounded-xl h-full w-full z-0"
      zoomControl={false}
      attributionControl={false}
    >
      <MapTileLayer />
      <MapWorldConstraint />

      <GreatCirclePath start={flight.departureAirport} end={flight.destinationAirport} />
      <DiversionRoute origin={flight.departureAirport} diversion={diversion} />
      <FlightPath path={flightPath} />

      <MapAirportLabel airport={flight.departureAirport} />
      <MapAirportLabel airport={flight.destinationAirport} />

      <TrackingRunwaysLayer
        runwayService={runwayService}
        departureAirportId={flight.departureAirport.id}
        destinationAirportId={flight.destinationAirport.id}
        departureRunwayId={flight.departureRunwayId}
        arrivalRunwayId={flight.arrivalRunwayId}
      />

      <TrackingAirportLayoutLayer
        terminalService={terminalService}
        parkingPositionService={cachedParkingPositionService}
        gateService={gateService}
        departureAirport={flight.departureAirport}
        destinationAirport={flight.destinationAirport}
        departureParkingPositionId={flight.departureParkingPositionId}
        arrivalParkingPositionId={flight.arrivalParkingPositionId}
      />

      {flightPath.length > 0 && <MapAircraftMarker path={flightPath} />}

      <MapEventsHandler
        bounds={mapBounds}
        options={leafletMapOptions}
        aircraftPosition={lastPathPoint}
        departurePosition={departurePosition}
        destinationPosition={destinationPosition}
      />

      <MapResizeHandler />
    </MapContainer>
  );
}
