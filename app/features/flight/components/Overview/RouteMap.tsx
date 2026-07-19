import L from "leaflet";
import { useCallback, useEffect, useMemo } from "react";
import { MapContainer } from "react-leaflet";
import { twMerge } from "tailwind-merge";
import { MapSettingsProvider } from "~/app-state/useMapSettings";
import { AdsbProvider, useAdsbData } from "~/features/adsb/hooks/useAdsbData";
import { type Flight, isInFlightStatus } from "~/features/flight";
import { AdsbStatusIndicator } from "~/features/flight/components/Map/Box/Overlay/AdsbStatusIndicator";
import { LiveTelemetry } from "~/features/flight/components/Map/Box/Overlay/LiveTelemetry";
import { MapOptionsControl } from "~/features/flight/components/Map/Box/Overlay/MapOptionsControl";
import { MapTopBar } from "~/features/flight/components/Map/Box/Overlay/MapTopBar";
import { FlightPath } from "~/features/flight/components/Map/Element/FlightPath";
import { GreatCirclePath } from "~/features/flight/components/Map/Element/GreatCirclePath";
import { MapAircraftMarker } from "~/features/flight/components/Map/Element/MapAircraftMarker";
import { MapAirportLabel } from "~/features/flight/components/Map/Element/MapAirportLabel";
import { MapResizeHandler } from "~/features/flight/components/Map/Element/MapResizeHandler";
import { MapTileLayer } from "~/features/flight/components/Map/Element/MapTileLayer";
import { TrackingAirportLayoutLayer } from "~/features/flight/components/Map/Element/TrackingAirportLayoutLayer";
import { TrackingRunwaysLayer } from "~/features/flight/components/Map/Element/TrackingRunwaysLayer";
import { useApi } from "~/shared/api/useApi";
import { useMapMaximize } from "~/shared/hooks/useMapMaximize";
import { TransparentContainer } from "~/shared/ui/Layout/TransparentContainer";

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
  const { isMaximized, toggle, containerRef, containerClassName } = useMapMaximize();
  const { runwayService, terminalService, parkingPositionService, gateService } = useApi();
  const cachedParkingPositionService = useMemo(
    () => ({ fetchAll: (airportId: string) => parkingPositionService.fetchAllCached(airportId) }),
    [parkingPositionService],
  );

  const fetchPath = useCallback(async () => {
    setCallsign(flight.callsign);
    await loadFlightPath();
  }, [flight.callsign, setCallsign, loadFlightPath]);

  useEffect(() => {
    if (!isInFlightStatus(flight.status)) return;
    fetchPath().then();
  }, [fetchPath, flight.status]);

  useEffect(() => {
    if (!isInFlightStatus(flight.status)) return;
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
      <div ref={containerRef} className={twMerge("relative h-full min-h-72 w-full", containerClassName)}>
        <MapSettingsProvider>
          <MapContainer
            bounds={bounds}
            boundsOptions={{ padding: [40, 40] }}
            scrollWheelZoom={true}
            className="h-full w-full z-0"
            zoomControl={false}
            attributionControl={false}
          >
            <MapTileLayer />
            <GreatCirclePath start={flight.departureAirport} end={flight.destinationAirport} />
            <FlightPath path={flightPath} />
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
            <MapAirportLabel airport={flight.departureAirport} />
            <MapAirportLabel airport={flight.destinationAirport} />
            {flightPath.length > 0 && <MapAircraftMarker path={flightPath} />}
            <MapResizeHandler />
          </MapContainer>

          <MapTopBar
            isMaximized={isMaximized}
            onToggleMaximize={toggle}
            center={<LiveTelemetry point={lastPathPoint} />}
          >
            <AdsbStatusIndicator status={flight.status} isOnline={flightPath.length > 0} />
          </MapTopBar>

          <MapOptionsControl size="sm" />

          <div className="absolute bottom-1 right-1 z-10 rounded bg-white/80 px-1.5 py-0.5 text-[10px] text-gray-500 dark:bg-gray-900/80 dark:text-gray-400">
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
        </MapSettingsProvider>
      </div>
    </TransparentContainer>
  );
}
