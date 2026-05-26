"use client";

import L from "leaflet";
import { MapContainer } from "react-leaflet";
import { DiversionRoute } from "~/components/flight/Map/Element/DiversionRoute";
import { FlightPath } from "~/components/flight/Map/Element/FlightPath";
import { GreatCirclePath } from "~/components/flight/Map/Element/GreatCirclePath";
import { MapAircraftMarker } from "~/components/flight/Map/Element/MapAircraftMarker";
import MapAirportLabel from "~/components/flight/Map/Element/MapAirportLabel";
import { MapEventsHandler } from "~/components/flight/Map/Element/MapEventsHandler";
import { MapTileLayer } from "~/components/flight/Map/Element/MapTileLayer";
import { TrackingAirportLayoutLayer } from "~/components/flight/Map/Element/TrackingAirportLayoutLayer";
import { TrackingRunwaysLayer } from "~/components/flight/Map/Element/TrackingRunwaysLayer";
import { flightMapPositions } from "~/functions/flightMapBounds";
import { useAdsbData } from "~/state/api/context/useAdsbData";
import { useApi } from "~/state/api/context/useApi";
import { useTrackedFlight } from "~/state/api/context/useTrackedFlight";

export function TrackingFlightMap() {
  const { flight, diversion } = useTrackedFlight();
  const { flightPath } = useAdsbData();
  const { runwayService, terminalService, gateService } = useApi();
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
        gateService={gateService}
        departureAirport={flight.departureAirport}
        destinationAirport={flight.destinationAirport}
        departureGateId={flight.departureGateId}
        arrivalGateId={flight.arrivalGateId}
      />

      {flightPath.length > 0 && <MapAircraftMarker path={flightPath} />}

      <MapEventsHandler
        bounds={mapBounds}
        options={leafletMapOptions}
        aircraftPosition={lastPathPoint}
        departurePosition={departurePosition}
        destinationPosition={destinationPosition}
      />
    </MapContainer>
  );
}
