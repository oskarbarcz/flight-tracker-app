import L from "leaflet";
import { useCallback, useEffect, useRef, useState } from "react";
import { LuHistory } from "react-icons/lu";
import { MapContainer } from "react-leaflet";
import type { Diversion } from "~/features/diversion";
import { type Flight, type FlightPathElement, Tracking } from "~/features/flight";
import { LazyFlightGlobeMap } from "~/features/flight/components/Map/Box/LazyFlightGlobeMap";
import { MapTopBar } from "~/features/flight/components/Map/Box/Overlay/MapTopBar";
import { DiversionRoute } from "~/features/flight/components/Map/Element/DiversionRoute";
import { FlightPath } from "~/features/flight/components/Map/Element/FlightPath";
import { GreatCirclePath } from "~/features/flight/components/Map/Element/GreatCirclePath";
import { MapAircraftMarker } from "~/features/flight/components/Map/Element/MapAircraftMarker";
import { MapAirportLabel } from "~/features/flight/components/Map/Element/MapAirportLabel";
import { MapEventsHandler } from "~/features/flight/components/Map/Element/MapEventsHandler";
import { MapProjectionSwitch } from "~/features/flight/components/Map/Element/MapProjectionSwitch";
import { MapTileLayer } from "~/features/flight/components/Map/Element/MapTileLayer";
import { MapViewMemory } from "~/features/flight/components/Map/Element/MapViewMemory";
import { MapWorldConstraint } from "~/features/flight/components/Map/Element/MapWorldConstraint";
import { useAuthorizedLayoutServices } from "~/features/flight/hooks/useAirportLayoutData";
import { useMapProjection } from "~/features/flight/hooks/useMapProjection";
import { flightMapPositions } from "~/features/flight/lib/flightMapBounds";
import { useApi } from "~/shared/api/useApi";
import type { GlobeInsets } from "~/shared/lib/globeCamera";
import type { MapCameraView } from "~/shared/lib/mapCameraView";
import { MapAttribution } from "~/shared/ui/Map/MapAttribution";

const TOP_BAR_HEIGHT = 41;
const TOP_BAR_INSETS: GlobeInsets = { top: TOP_BAR_HEIGHT, bottom: 0 };

type Props = {
  flight: Flight;
  diversion?: Diversion | null;
};

export function HistoryFlightMap({ flight, diversion = null }: Props) {
  const { flightService } = useApi();
  const leafletMapOptions = {
    padding: [80, 80],
    duration: 1,
  } as L.FitBoundsOptions;

  const [flightPath, setFlightPath] = useState<FlightPathElement[]>([]);
  const [projection, setProjection] = useMapProjection("map-projection.history");
  const layoutServices = useAuthorizedLayoutServices();
  const view = useRef<MapCameraView | null>(null);
  const rememberView = useCallback((next: MapCameraView) => {
    view.current = next;
  }, []);

  useEffect(() => {
    flightService.fetchFlightPath(flight.id).then(setFlightPath);
  }, [flight.id, flightService]);

  const lastPathPoint = flightPath.length > 0 ? flightPath[flightPath.length - 1] : undefined;

  const { departurePosition, destinationPosition, boundsPoints } = flightMapPositions(flight, diversion);
  const mapBounds = L.latLngBounds(boundsPoints);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-xl">
      {projection === "globe" ? (
        <LazyFlightGlobeMap
          flight={flight}
          diversion={diversion}
          flightPath={flightPath}
          layoutServices={layoutServices}
          insets={TOP_BAR_INSETS}
          initialView={view.current}
          onViewChange={rememberView}
        />
      ) : (
        <MapContainer
          bounds={mapBounds}
          boundsOptions={{ padding: [80, 80] }}
          scrollWheelZoom={true}
          worldCopyJump={true}
          zoomSnap={0}
          className="rounded-xl h-full w-full z-0"
          zoomControl={false}
          attributionControl={false}
        >
          <MapTileLayer />
          <MapWorldConstraint crossAntimeridian={true} />

          <GreatCirclePath start={flight.departureAirport} end={flight.destinationAirport} />
          <DiversionRoute origin={flight.departureAirport} diversion={diversion} />
          <FlightPath path={flightPath} />

          <MapAirportLabel airport={flight.departureAirport} />
          <MapAirportLabel airport={flight.destinationAirport} />

          {flightPath.length > 0 && <MapAircraftMarker path={flightPath} />}

          <MapEventsHandler
            bounds={mapBounds}
            options={leafletMapOptions}
            aircraftPosition={lastPathPoint}
            departurePosition={departurePosition}
            destinationPosition={destinationPosition}
            topInset={TOP_BAR_HEIGHT}
            initialZoom={view.current?.zoom ?? null}
          />
          <MapViewMemory initialView={view.current} onViewChange={rememberView} topInset={TOP_BAR_HEIGHT} />
        </MapContainer>
      )}
      <MapTopBar flightId={flight.id} canShare={flight.tracking !== Tracking.Disabled}>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-2 text-2xs font-bold uppercase tracking-[0.08em] text-gray-500 dark:text-gray-400">
            <LuHistory className="size-3" />
            Historic flight path
          </span>
          <MapProjectionSwitch value={projection} onChange={setProjection} />
        </div>
      </MapTopBar>
      <MapAttribution />
    </div>
  );
}
