import L, { type LatLngTuple } from "leaflet";
import { useMemo } from "react";
import { MapContainer } from "react-leaflet";
import { useMapSettings } from "~/app-state/useMapSettings";
import { useAdsbData } from "~/features/adsb/hooks/useAdsbData";
import { DimmablePane } from "~/features/flight/components/Map/Element/DimmablePane";
import { DiversionRoute } from "~/features/flight/components/Map/Element/DiversionRoute";
import { FlightPath } from "~/features/flight/components/Map/Element/FlightPath";
import { GreatCirclePath } from "~/features/flight/components/Map/Element/GreatCirclePath";
import { MapAircraftMarker } from "~/features/flight/components/Map/Element/MapAircraftMarker";
import { MapAirportLabel } from "~/features/flight/components/Map/Element/MapAirportLabel";
import { MapEventsHandler } from "~/features/flight/components/Map/Element/MapEventsHandler";
import { MapResizeHandler } from "~/features/flight/components/Map/Element/MapResizeHandler";
import { MapTileLayer } from "~/features/flight/components/Map/Element/MapTileLayer";
import { MapViewMemory } from "~/features/flight/components/Map/Element/MapViewMemory";
import { MapWorldConstraint } from "~/features/flight/components/Map/Element/MapWorldConstraint";
import { TrackingAirportLayoutLayer } from "~/features/flight/components/Map/Element/TrackingAirportLayoutLayer";
import { TrackingRunwaysLayer } from "~/features/flight/components/Map/Element/TrackingRunwaysLayer";
import { useTrackedFlight } from "~/features/flight/hooks/useTrackedFlight";
import { flightMapPositions } from "~/features/flight/lib/flightMapBounds";
import { PlannedEtopsRingsLayer, PlannedRouteLayer } from "~/features/route/components/Chart/RouteOverlay";
import { usePlannedRoute } from "~/features/route/hooks/useRouteBriefing";
import { useApi } from "~/shared/api/useApi";
import { emphasisOf, hasEtopsRings, hasFiledWaypoints } from "~/shared/lib/flightData";
import { greatCirclePath } from "~/shared/lib/greatCircle";
import type { MapCameraView } from "~/shared/lib/mapCameraView";
import { alignLongitude } from "~/shared/lib/worldCopies";

type Props = {
  topInset: number;
  initialView: MapCameraView | null;
  onViewChange: (view: MapCameraView) => void;
};

export function TrackingFlightMap({ topInset, initialView, onViewChange }: Props) {
  const { flight, diversion } = useTrackedFlight();
  const { flightPath } = useAdsbData();
  const plannedRoute = usePlannedRoute();
  const { mapSettings } = useMapSettings();
  const filedRoute = plannedRoute?.briefing ?? null;
  const showsRoute = hasFiledWaypoints(filedRoute) && mapSettings.routeDisplay !== "hide";
  const showsGreatCircle = mapSettings.greatCircleDisplay !== "hide";
  const showsEtopsRings = hasEtopsRings(filedRoute) && mapSettings.etopsDisplay !== "hide";
  const { runwayService, terminalService, parkingPositionService, gateService } = useApi();
  const cachedParkingPositionService = useMemo(
    () => ({ fetchAll: (airportId: string) => parkingPositionService.fetchAllCached(airportId) }),
    [parkingPositionService],
  );
  const leafletMapOptions = {
    paddingTopLeft: [64, 40],
    paddingBottomRight: [64, 96],
    duration: 1,
  } as L.FitBoundsOptions;

  if (!flight) {
    return null;
  }

  const lastPathPoint = flightPath.length > 0 ? flightPath[flightPath.length - 1] : undefined;

  const { departurePosition, destinationPosition, boundsPoints } = flightMapPositions(flight, diversion);
  const routePoints = greatCirclePath(
    (showsRoute ? (filedRoute?.route.fixes ?? []) : []).map((fix): LatLngTuple => [fix.latitude, fix.longitude]),
  );
  const aircraftPoints = lastPathPoint
    ? [alignLongitude([lastPathPoint.latitude, lastPathPoint.longitude], departurePosition[1])]
    : [];
  const mapBounds = L.latLngBounds([...boundsPoints, ...routePoints, ...aircraftPoints]);

  return (
    <MapContainer
      bounds={mapBounds}
      boundsOptions={{ padding: [80, 80] }}
      scrollWheelZoom={true}
      worldCopyJump={true}
      zoomSnap={0}
      className="h-full w-full z-0"
      zoomControl={false}
      attributionControl={false}
    >
      <MapTileLayer withAirspace={true} />
      <MapWorldConstraint crossAntimeridian={true} />

      {showsGreatCircle && (
        <GreatCirclePath
          start={flight.departureAirport}
          end={flight.destinationAirport}
          emphasis={emphasisOf(mapSettings.greatCircleDisplay)}
        />
      )}
      {showsRoute && (
        <DimmablePane name="planned-route" emphasis={emphasisOf(mapSettings.routeDisplay)}>
          <PlannedRouteLayer state={plannedRoute} showRings={false} />
        </DimmablePane>
      )}
      {showsEtopsRings && (
        <DimmablePane name="etops-rings" emphasis={emphasisOf(mapSettings.etopsDisplay)}>
          <PlannedEtopsRingsLayer state={plannedRoute} />
        </DimmablePane>
      )}
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

      <MapViewMemory initialView={initialView} onViewChange={onViewChange} topInset={topInset} />

      <MapEventsHandler
        bounds={mapBounds}
        initialZoom={initialView?.zoom ?? null}
        options={leafletMapOptions}
        topInset={topInset}
        aircraftPosition={lastPathPoint}
        departurePosition={departurePosition}
        destinationPosition={destinationPosition}
      />

      <MapResizeHandler />
    </MapContainer>
  );
}
