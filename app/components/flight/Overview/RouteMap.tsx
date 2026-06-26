import L from "leaflet";
import React, { useCallback, useEffect } from "react";
import { MapContainer } from "react-leaflet";
import { LiveTelemetryOverlay } from "~/components/flight/Map/Box/Overlay/LiveTelemetryOverlay";
import { MapPreviewStatusOverlay } from "~/components/flight/Map/Box/Overlay/PreviewStatusOverlay";
import { FlightPath } from "~/components/flight/Map/Element/FlightPath";
import { GreatCirclePath } from "~/components/flight/Map/Element/GreatCirclePath";
import { MapAircraftMarker } from "~/components/flight/Map/Element/MapAircraftMarker";
import { MapAirportLabel } from "~/components/flight/Map/Element/MapAirportLabel";
import { MapTileLayer } from "~/components/flight/Map/Element/MapTileLayer";
import { TransparentContainer } from "~/components/shared/Layout/TransparentContainer";
import { type Flight, shouldPollForAdsbData } from "~/models";
import { AdsbProvider, useAdsbData } from "~/state/api/context/useAdsbData";

type Props = {
  flight: Flight;
};

export function RouteMap({ flight }: Props) {
  return (
    <AdsbProvider>
      <RouteMapContent flight={flight} />
    </AdsbProvider>
  );
}

function RouteMapContent({ flight }: Props) {
  const { setCallsign, loadFlightPath, flightPath } = useAdsbData();

  const fetchPath = useCallback(async () => {
    setCallsign(flight.callsign);
    await loadFlightPath();
  }, [flight.callsign, setCallsign, loadFlightPath]);

  useEffect(() => {
    if (!shouldPollForAdsbData(flight.status)) return;
    fetchPath().then();
  }, [fetchPath, flight.status]);

  useEffect(() => {
    if (!shouldPollForAdsbData(flight.status)) return;
    const intervalId = setInterval(() => {
      fetchPath().then();
    }, 5000);
    return () => clearInterval(intervalId);
  }, [flight.status, fetchPath]);

  const bounds = L.latLngBounds([
    [flight.departureAirport.location.latitude, flight.departureAirport.location.longitude],
    [flight.destinationAirport.location.latitude, flight.destinationAirport.location.longitude],
  ]);

  const lastPathPoint = flightPath.length > 0 ? flightPath[flightPath.length - 1] : undefined;

  return (
    <TransparentContainer className="h-full">
      <div className="relative h-full min-h-72 w-full">
        <MapContainer
          bounds={bounds}
          boundsOptions={{ padding: [40, 40] }}
          scrollWheelZoom={false}
          className="h-full w-full z-0"
          zoomControl={false}
          attributionControl={false}
        >
          <MapTileLayer />
          <GreatCirclePath start={flight.departureAirport} end={flight.destinationAirport} />
          <FlightPath path={flightPath} />
          <MapAirportLabel airport={flight.departureAirport} />
          <MapAirportLabel airport={flight.destinationAirport} />
          {flightPath.length > 0 && <MapAircraftMarker path={flightPath} />}
        </MapContainer>

        <MapPreviewStatusOverlay />
        <LiveTelemetryOverlay point={lastPathPoint} />

        <div className="absolute bottom-1 right-1 z-10 bg-white/80 dark:bg-gray-900/80 px-1.5 py-0.5 rounded text-[10px] text-gray-500 dark:text-gray-400">
          ©{" "}
          <a
            href="https://www.openstreetmap.org/copyright"
            target="_blank"
            rel="noreferrer"
            className="hover:underline"
          >
            OpenStreetMap
          </a>
        </div>
      </div>
    </TransparentContainer>
  );
}
