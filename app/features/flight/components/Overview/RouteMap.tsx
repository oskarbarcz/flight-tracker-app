import L from "leaflet";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { MapContainer } from "react-leaflet";
import { twMerge } from "tailwind-merge";
import { MapSettingsProvider } from "~/app-state/useMapSettings";
import { AdsbProvider, useAdsbData } from "~/features/adsb/hooks/useAdsbData";
import { type Flight, isInFlightStatus } from "~/features/flight";
import { LazyFlightGlobeMap } from "~/features/flight/components/Map/Box/LazyFlightGlobeMap";
import { AdsbStatusIndicator } from "~/features/flight/components/Map/Box/Overlay/AdsbStatusIndicator";
import { LiveTelemetry } from "~/features/flight/components/Map/Box/Overlay/LiveTelemetry";
import { MapOptionsControl } from "~/features/flight/components/Map/Box/Overlay/MapOptionsControl";
import { MapTopBar } from "~/features/flight/components/Map/Box/Overlay/MapTopBar";
import { FlightGreatCircle } from "~/features/flight/components/Map/Element/FlightGreatCircle";
import { FlightPath } from "~/features/flight/components/Map/Element/FlightPath";
import { MapAircraftMarker } from "~/features/flight/components/Map/Element/MapAircraftMarker";
import { MapAirportLabel } from "~/features/flight/components/Map/Element/MapAirportLabel";
import { MapResizeHandler } from "~/features/flight/components/Map/Element/MapResizeHandler";
import { MapTileLayer } from "~/features/flight/components/Map/Element/MapTileLayer";
import { MapViewMemory } from "~/features/flight/components/Map/Element/MapViewMemory";
import { MapWheelZoom } from "~/features/flight/components/Map/Element/MapWheelZoom";
import { MapWorldConstraint } from "~/features/flight/components/Map/Element/MapWorldConstraint";
import { TrackingAirportLayoutLayer } from "~/features/flight/components/Map/Element/TrackingAirportLayoutLayer";
import { TrackingRunwaysLayer } from "~/features/flight/components/Map/Element/TrackingRunwaysLayer";
import { useAuthorizedLayoutServices } from "~/features/flight/hooks/useAirportLayoutData";
import { useMapProjection } from "~/features/flight/hooks/useMapProjection";
import { flightMapPositions } from "~/features/flight/lib/flightMapBounds";
import { useApi } from "~/shared/api/useApi";
import { useMapMaximize } from "~/shared/hooks/useMapMaximize";
import type { GlobeInsets } from "~/shared/lib/globeCamera";
import type { MapCameraView } from "~/shared/lib/mapCameraView";
import { TransparentContainer } from "~/shared/ui/Layout/TransparentContainer";
import { MapAttribution } from "~/shared/ui/Map/MapAttribution";

type Props = {
  flight: Flight;
};

const TOP_BAR_HEIGHT = 41;
const TOP_BAR_INSETS: GlobeInsets = { top: TOP_BAR_HEIGHT, bottom: 0 };

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
  const [projection, setProjection] = useMapProjection("map-projection.operations-route");
  const layoutServices = useAuthorizedLayoutServices();
  const view = useRef<MapCameraView | null>(null);
  const rememberView = useCallback((next: MapCameraView) => {
    view.current = next;
  }, []);
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

  const bounds = L.latLngBounds(flightMapPositions(flight, null).boundsPoints);

  const lastPathPoint = flightPath.length > 0 ? flightPath[flightPath.length - 1] : undefined;

  return (
    <TransparentContainer className="h-full">
      <div ref={containerRef} className={twMerge("relative h-full min-h-72 w-full", containerClassName)}>
        <MapSettingsProvider>
          {projection === "globe" ? (
            <LazyFlightGlobeMap
              flight={flight}
              flightPath={flightPath}
              layoutServices={layoutServices}
              insets={TOP_BAR_INSETS}
              initialView={view.current}
              onViewChange={rememberView}
              withAirspace={true}
            />
          ) : (
            <MapContainer
              bounds={bounds}
              boundsOptions={{ padding: [40, 40] }}
              scrollWheelZoom={true}
              worldCopyJump={true}
              zoomSnap={0}
              className="h-full w-full z-0"
              zoomControl={false}
              attributionControl={false}
            >
              <MapTileLayer withAirspace={true} />
              <MapWorldConstraint crossAntimeridian={true} />
              <FlightGreatCircle start={flight.departureAirport} end={flight.destinationAirport} />
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
              <MapWheelZoom />
              <MapViewMemory initialView={view.current} onViewChange={rememberView} topInset={TOP_BAR_HEIGHT} />
            </MapContainer>
          )}

          <MapTopBar
            isMaximized={isMaximized}
            onToggleMaximize={toggle}
            center={<LiveTelemetry point={lastPathPoint} />}
          >
            <AdsbStatusIndicator status={flight.status} isOnline={flightPath.length > 0} />
          </MapTopBar>

          <MapOptionsControl size="sm" projection={projection} onProjectionChange={setProjection} />

          <MapAttribution withAirspace={true} />
        </MapSettingsProvider>
      </div>
    </TransparentContainer>
  );
}
