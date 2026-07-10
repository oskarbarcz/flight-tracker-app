import L from "leaflet";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { MdFullscreen, MdFullscreenExit } from "react-icons/md";
import { MapContainer, useMap, ZoomControl } from "react-leaflet";
import type { Airport } from "~/features/airport";
import { AirportShapePolygon } from "~/features/flight/components/Map/Element/AirportShapePolygon";
import { GateMarkers } from "~/features/flight/components/Map/Element/GateMarkers";
import { MapAirportLabel } from "~/features/flight/components/Map/Element/MapAirportLabel";
import { MapTileLayer } from "~/features/flight/components/Map/Element/MapTileLayer";
import { ParkingPositionMarkers } from "~/features/flight/components/Map/Element/ParkingPositionMarkers";
import { RunwayLines } from "~/features/flight/components/Map/Element/RunwayLines";
import { TerminalPolygons } from "~/features/flight/components/Map/Element/TerminalPolygons";
import type { Gate } from "~/features/gate";
import type { ParkingPosition } from "~/features/parking-position";
import type { Runway } from "~/features/runway";
import { computeRunwayLines } from "~/features/runway/lib/runwayPairs";
import type { Terminal } from "~/features/terminal";
import { formatCoordinates } from "~/shared/lib/formatGeo";
import { TransparentContainer } from "~/shared/ui/Layout/TransparentContainer";

export type AirportMapLayer = "shape" | "terminals" | "parkingPositions" | "gates" | "runways";

const ALL_LAYERS: AirportMapLayer[] = ["shape", "terminals", "parkingPositions", "gates", "runways"];

type Props = {
  airport: Airport;
  runways: Runway[];
  terminals: Terminal[];
  parkingPositions: ParkingPosition[];
  gates: Gate[];
  visibleLayers?: AirportMapLayer[];
};

export function AirportLocationMap({
  airport,
  runways,
  terminals,
  parkingPositions,
  gates,
  visibleLayers = ALL_LAYERS,
}: Props) {
  const shows = (layer: AirportMapLayer) => visibleLayers.includes(layer);
  const coordinates = formatCoordinates(airport.location.latitude, airport.location.longitude);
  const mapRef = useRef<L.Map | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMorphing, setIsMorphing] = useState(false);

  const setFullscreen = useCallback((next: boolean) => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const doc = document as Document & { startViewTransition?: (callback: () => void) => { finished: Promise<void> } };

    if (!doc.startViewTransition || reduceMotion) {
      setIsFullscreen(next);
      return;
    }

    flushSync(() => setIsMorphing(true));
    const transition = doc.startViewTransition(() => {
      flushSync(() => setIsFullscreen(next));
    });
    transition.finished.finally(() => setIsMorphing(false));
  }, []);

  const bounds = useMemo(() => {
    const points: L.LatLngTuple[] = [];

    const lines = computeRunwayLines(runways);
    for (const line of lines) {
      points.push(...line.positions);
    }
    if (airport.shape) {
      for (const p of airport.shape) {
        points.push([p.latitude, p.longitude]);
      }
    }
    for (const t of terminals) {
      if (!t.shape) continue;
      for (const p of t.shape) {
        points.push([p.latitude, p.longitude]);
      }
    }
    for (const p of parkingPositions) {
      if (!p.coordinates) continue;
      points.push([p.coordinates.latitude, p.coordinates.longitude]);
    }
    for (const g of gates) {
      if (!g.coordinates) continue;
      points.push([g.coordinates.latitude, g.coordinates.longitude]);
    }

    if (points.length === 0) {
      return L.latLng(airport.location.latitude, airport.location.longitude).toBounds(4000);
    }
    return L.latLngBounds(points);
  }, [
    runways,
    airport.shape,
    airport.location.latitude,
    airport.location.longitude,
    terminals,
    parkingPositions,
    gates,
  ]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (isFullscreen) {
      map.scrollWheelZoom.enable();
    } else {
      map.scrollWheelZoom.disable();
    }
    const id = window.setTimeout(() => map.invalidateSize(), 120);
    return () => window.clearTimeout(id);
  }, [isFullscreen]);

  useEffect(() => {
    if (!isFullscreen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setFullscreen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isFullscreen, setFullscreen]);

  return (
    <TransparentContainer className="h-full shadow-none">
      <div
        style={isMorphing ? { viewTransitionName: "airport-map" } : undefined}
        className={
          isFullscreen
            ? "fixed inset-0 z-[1000] h-screen w-screen bg-gray-100 dark:bg-gray-950"
            : "relative h-full min-h-72 w-full"
        }
      >
        <MapContainer
          ref={mapRef}
          bounds={bounds}
          boundsOptions={{ padding: [40, 40] }}
          scrollWheelZoom={false}
          className="h-full w-full z-0"
          zoomControl={false}
          attributionControl={false}
        >
          <ZoomControl position="bottomright" />
          <FlyToBounds bounds={bounds} />
          <MapTileLayer />
          {shows("shape") && <AirportShapePolygon airport={airport} />}
          {shows("terminals") && <TerminalPolygons terminals={terminals} />}
          {shows("parkingPositions") && <ParkingPositionMarkers parkingPositions={parkingPositions} />}
          {shows("gates") && <GateMarkers gates={gates} />}
          {shows("runways") && <RunwayLines runways={runways} />}
          <MapAirportLabel airport={airport} />
        </MapContainer>

        <button
          type="button"
          onClick={() => setFullscreen(!isFullscreen)}
          aria-label={isFullscreen ? "Exit fullscreen" : "View map fullscreen"}
          className="absolute top-3 right-3 z-[1001] flex cursor-pointer items-center justify-center rounded-lg border border-gray-200 bg-white/95 p-2 text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900/95 dark:text-gray-200 dark:hover:bg-gray-800"
        >
          {isFullscreen ? <MdFullscreenExit size={20} /> : <MdFullscreen size={20} />}
        </button>

        <div className="absolute top-3 left-3 z-10 bg-white/95 dark:bg-gray-900/95 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-800 text-sm font-mono font-bold text-gray-900 dark:text-gray-100 pointer-events-none">
          {airport.icaoCode} · {airport.iataCode}
        </div>

        <div className="absolute bottom-3 left-3 z-10 bg-white/95 dark:bg-gray-900/95 px-2.5 py-1 rounded-md border border-gray-200 dark:border-gray-800 text-xs font-mono text-gray-700 dark:text-gray-300 pointer-events-none">
          {coordinates}
        </div>
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
