import { type FitBoundsOptions, latLngBounds } from "leaflet";
import { useCallback, useRef } from "react";
import { MapContainer } from "react-leaflet";
import { useMapSettings } from "~/app-state/useMapSettings";
import type { Flight, FlightPathElement } from "~/features/flight";
import { LazyFlightGlobeMap } from "~/features/flight/components/Map/Box/LazyFlightGlobeMap";
import { MapOptionsControl } from "~/features/flight/components/Map/Box/Overlay/MapOptionsControl";
import { AircraftIdentityLabel } from "~/features/flight/components/Map/Element/AircraftIdentityLabel";
import { FlightPath } from "~/features/flight/components/Map/Element/FlightPath";
import { GreatCirclePath } from "~/features/flight/components/Map/Element/GreatCirclePath";
import { MapAircraftMarker } from "~/features/flight/components/Map/Element/MapAircraftMarker";
import { MapAirportLabel } from "~/features/flight/components/Map/Element/MapAirportLabel";
import { MapEventsHandler } from "~/features/flight/components/Map/Element/MapEventsHandler";
import { MapTileLayer } from "~/features/flight/components/Map/Element/MapTileLayer";
import { MapViewMemory } from "~/features/flight/components/Map/Element/MapViewMemory";
import { MapWorldConstraint } from "~/features/flight/components/Map/Element/MapWorldConstraint";
import { TrackingAirportLayoutLayer } from "~/features/flight/components/Map/Element/TrackingAirportLayoutLayer";
import { TrackingRunwaysLayer } from "~/features/flight/components/Map/Element/TrackingRunwaysLayer";
import { FlightSummaryCard } from "~/features/flight/components/Map/FullScreen/FlightSummaryCard";
import { usePublicLayoutServices } from "~/features/flight/hooks/useAirportLayoutData";
import { useMapProjection } from "~/features/flight/hooks/useMapProjection";
import { flightMapPositions } from "~/features/flight/lib/flightMapBounds";
import { usePublicApi } from "~/shared/api/usePublicApi";
import { emphasisOf } from "~/shared/lib/flightData";
import type { GlobeInsets } from "~/shared/lib/globeCamera";
import type { MapCameraView } from "~/shared/lib/mapCameraView";

const NO_INSETS: GlobeInsets = { top: 0, bottom: 0 };

type Props = {
  flight: Flight;
  path: FlightPathElement[];
};

export function FullScreenMap({ flight, path }: Props) {
  const { publicRunwayService, publicTerminalService, publicParkingPositionService, publicGateService } =
    usePublicApi();
  const mapOptions = {
    padding: [100, 100],
    duration: 1,
  } as FitBoundsOptions;

  const lastPosition = path[path.length - 1];
  const { mapSettings } = useMapSettings();
  const [projection, setProjection] = useMapProjection("map-projection.public-flight");
  const layoutServices = usePublicLayoutServices();
  const view = useRef<MapCameraView | null>(null);
  const rememberView = useCallback((next: MapCameraView) => {
    view.current = next;
  }, []);

  const { departurePosition, destinationPosition, boundsPoints } = flightMapPositions(flight, null);
  const mapBounds = latLngBounds(boundsPoints);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {projection === "globe" ? (
        <div className="absolute inset-0 z-10">
          <LazyFlightGlobeMap
            flight={flight}
            flightPath={path}
            layoutServices={layoutServices}
            insets={NO_INSETS}
            initialView={view.current}
            onViewChange={rememberView}
            aircraftLabel={<AircraftIdentityLabel flight={flight} />}
            withAirspace={true}
          />
        </div>
      ) : (
        <MapContainer
          bounds={mapBounds}
          boundsOptions={{ padding: [100, 100] }}
          scrollWheelZoom={true}
          worldCopyJump={true}
          zoomSnap={0}
          className="bg-gray-800 size-full z-10"
          zoomControl={false}
          attributionControl={false}
        >
          <MapTileLayer withAirspace={true} />
          <MapWorldConstraint crossAntimeridian={true} />
          {mapSettings.greatCircleDisplay !== "hide" && (
            <GreatCirclePath
              start={flight.departureAirport}
              end={flight.destinationAirport}
              emphasis={emphasisOf(mapSettings.greatCircleDisplay)}
            />
          )}
          <FlightPath path={path} />

          {path.length > 0 && <MapAircraftMarker path={path} label={<AircraftIdentityLabel flight={flight} />} />}

          <MapAirportLabel airport={flight.departureAirport} />
          <MapAirportLabel airport={flight.destinationAirport} />

          <TrackingRunwaysLayer
            runwayService={publicRunwayService}
            departureAirportId={flight.departureAirport.id}
            destinationAirportId={flight.destinationAirport.id}
            departureRunwayId={flight.departureRunwayId}
            arrivalRunwayId={flight.arrivalRunwayId}
          />

          <TrackingAirportLayoutLayer
            terminalService={publicTerminalService}
            parkingPositionService={publicParkingPositionService}
            gateService={publicGateService}
            departureAirport={flight.departureAirport}
            destinationAirport={flight.destinationAirport}
            departureParkingPositionId={flight.departureParkingPositionId}
            arrivalParkingPositionId={flight.arrivalParkingPositionId}
          />

          <MapEventsHandler
            bounds={mapBounds}
            options={mapOptions}
            aircraftPosition={lastPosition}
            departurePosition={departurePosition}
            destinationPosition={destinationPosition}
            initialZoom={view.current?.zoom ?? null}
          />
          <MapViewMemory initialView={view.current} onViewChange={rememberView} />
        </MapContainer>
      )}
      <MapOptionsControl
        triggerClassName="top-16 left-4"
        placement="below"
        projection={projection}
        onProjectionChange={setProjection}
      />
      <FlightSummaryCard flight={flight} path={path} />
    </div>
  );
}
