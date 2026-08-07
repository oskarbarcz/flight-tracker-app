import L from "leaflet";
import { useEffect, useMemo, useRef } from "react";
import { MapContainer, useMap } from "react-leaflet";
import { twMerge } from "tailwind-merge";
import type { Airport } from "~/features/airport";
import { MapTopBar } from "~/features/flight/components/Map/Box/Overlay/MapTopBar";
import { AirportShapePolygon } from "~/features/flight/components/Map/Element/AirportShapePolygon";
import { GateMarkers } from "~/features/flight/components/Map/Element/GateMarkers";
import { MapAirportLabel } from "~/features/flight/components/Map/Element/MapAirportLabel";
import { MapResizeHandler } from "~/features/flight/components/Map/Element/MapResizeHandler";
import { MapTileLayer } from "~/features/flight/components/Map/Element/MapTileLayer";
import { MapWorldConstraint } from "~/features/flight/components/Map/Element/MapWorldConstraint";
import { ParkingPositionMarkers } from "~/features/flight/components/Map/Element/ParkingPositionMarkers";
import { RunwayLines } from "~/features/flight/components/Map/Element/RunwayLines";
import { TerminalPolygons } from "~/features/flight/components/Map/Element/TerminalPolygons";
import type { Gate } from "~/features/gate";
import type { ParkingPosition } from "~/features/parking-position";
import type { Runway } from "~/features/runway";
import { computeRunwayLines } from "~/features/runway/lib/runwayPairs";
import type { Terminal } from "~/features/terminal";
import { useMapMaximize } from "~/shared/hooks/useMapMaximize";
import { TransparentContainer } from "~/shared/ui/Layout/TransparentContainer";

export type AirportMapLayer = "shape" | "terminals" | "parkingPositions" | "gates" | "runways";

const ALL_LAYERS: AirportMapLayer[] = ["shape", "terminals", "parkingPositions", "gates", "runways"];

const NO_LOCATION_EXTENT_METERS = 4000;
const MIN_FIT_EXTENT_METERS = 700;

function withMinimumExtent(points: L.LatLngTuple[]): L.LatLngBounds {
  const fitted = L.latLngBounds(points);
  if (fitted.getNorthEast().distanceTo(fitted.getSouthWest()) >= MIN_FIT_EXTENT_METERS) {
    return fitted;
  }
  return fitted.getCenter().toBounds(MIN_FIT_EXTENT_METERS);
}

type Props = {
  airport: Airport;
  runways: Runway[];
  terminals: Terminal[];
  parkingPositions: ParkingPosition[];
  gates: Gate[];
  visibleLayers?: AirportMapLayer[];
  title?: string;
};

export function AirportLocationMap({
  airport,
  runways,
  terminals,
  parkingPositions,
  gates,
  visibleLayers = ALL_LAYERS,
  title,
}: Props) {
  const shows = (layer: AirportMapLayer) => visibleLayers.includes(layer);
  const { isMaximized, toggle, containerRef, containerClassName } = useMapMaximize();

  const bounds = useMemo(() => {
    const points: L.LatLngTuple[] = [];

    if (visibleLayers.includes("runways")) {
      for (const line of computeRunwayLines(runways)) {
        points.push(...line.positions);
      }
    }
    if (visibleLayers.includes("terminals")) {
      for (const t of terminals) {
        if (!t.shape) continue;
        for (const p of t.shape) {
          points.push([p.latitude, p.longitude]);
        }
      }
    }
    if (visibleLayers.includes("parkingPositions")) {
      for (const p of parkingPositions) {
        if (!p.coordinates) continue;
        points.push([p.coordinates.latitude, p.coordinates.longitude]);
      }
    }
    if (visibleLayers.includes("gates")) {
      for (const g of gates) {
        if (!g.coordinates) continue;
        points.push([g.coordinates.latitude, g.coordinates.longitude]);
      }
    }

    if (points.length === 0 && visibleLayers.includes("shape") && airport.shape) {
      for (const p of airport.shape) {
        points.push([p.latitude, p.longitude]);
      }
    }
    if (points.length === 0) {
      return L.latLng(airport.location.latitude, airport.location.longitude).toBounds(NO_LOCATION_EXTENT_METERS);
    }
    return withMinimumExtent(points);
  }, [
    visibleLayers,
    runways,
    airport.shape,
    airport.location.latitude,
    airport.location.longitude,
    terminals,
    parkingPositions,
    gates,
  ]);

  return (
    <TransparentContainer className="h-full shadow-none">
      <div ref={containerRef} className={twMerge("relative h-full min-h-72 w-full", containerClassName)}>
        <MapContainer
          bounds={bounds}
          boundsOptions={{ padding: [40, 40] }}
          scrollWheelZoom={true}
          className="h-full w-full z-0"
          zoomControl={false}
          attributionControl={false}
        >
          <FlyToBounds bounds={bounds} />
          <MapTileLayer />
          <MapWorldConstraint />
          {shows("shape") && <AirportShapePolygon airport={airport} />}
          {shows("terminals") && <TerminalPolygons terminals={terminals} />}
          {shows("parkingPositions") && <ParkingPositionMarkers parkingPositions={parkingPositions} />}
          {shows("gates") && <GateMarkers gates={gates} />}
          {shows("runways") && <RunwayLines runways={runways} />}
          <MapAirportLabel airport={airport} />
          <MapResizeHandler />
        </MapContainer>

        <MapTopBar isMaximized={isMaximized} onToggleMaximize={toggle}>
          {title ? (
            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{title}</span>
          ) : (
            <span className="font-mono text-sm font-bold text-gray-900 dark:text-gray-100">
              {airport.icaoCode} · {airport.iataCode}
            </span>
          )}
        </MapTopBar>
      </div>
    </TransparentContainer>
  );
}

function FlyToBounds({ bounds }: { bounds: L.LatLngBounds }) {
  const map = useMap();
  const isFirstFit = useRef(true);

  useEffect(() => {
    if (isFirstFit.current) {
      isFirstFit.current = false;
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      map.fitBounds(bounds, { padding: [40, 40] });
    } else {
      map.flyToBounds(bounds, { padding: [40, 40], duration: 1.1 });
    }
  }, [bounds, map]);

  return null;
}
