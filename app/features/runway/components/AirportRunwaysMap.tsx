import L from "leaflet";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { MdFullscreen, MdFullscreenExit } from "react-icons/md";
import { MapContainer, ZoomControl } from "react-leaflet";
import type { Airport } from "~/features/airport";
import { AirportShapePolygon } from "~/features/flight/components/Map/Element/AirportShapePolygon";
import { GateMarkers } from "~/features/flight/components/Map/Element/GateMarkers";
import { MapTileLayer } from "~/features/flight/components/Map/Element/MapTileLayer";
import { ParkingPositionMarkers } from "~/features/flight/components/Map/Element/ParkingPositionMarkers";
import { RunwayLines } from "~/features/flight/components/Map/Element/RunwayLines";
import { TerminalPolygons } from "~/features/flight/components/Map/Element/TerminalPolygons";
import type { Gate } from "~/features/gate";
import type { ParkingPosition } from "~/features/parking-position";
import type { Runway } from "~/features/runway";
import { computeRunwayLines } from "~/features/runway/lib/runwayPairs";
import type { Terminal } from "~/features/terminal";
import { TransparentContainer } from "~/shared/ui/Layout/TransparentContainer";

type Props = {
  airport: Airport;
  runways: Runway[];
  terminals: Terminal[];
  parkingPositions: ParkingPosition[];
  gates: Gate[];
  fallbackCenter: { latitude: number; longitude: number };
};

export function AirportRunwaysMap({ airport, runways, terminals, parkingPositions, gates, fallbackCenter }: Props) {
  const mapRef = useRef<L.Map | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const lines = useMemo(() => computeRunwayLines(runways), [runways]);

  const bounds = useMemo(() => {
    const points: L.LatLngTuple[] = [];
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
      return L.latLng(fallbackCenter.latitude, fallbackCenter.longitude).toBounds(4000);
    }
    return L.latLngBounds(points);
  }, [lines, airport.shape, terminals, parkingPositions, gates, fallbackCenter.latitude, fallbackCenter.longitude]);

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
      if (event.key === "Escape") setIsFullscreen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isFullscreen]);

  return (
    <TransparentContainer className="h-full">
      <div
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
          <MapTileLayer />
          <AirportShapePolygon airport={airport} />
          <TerminalPolygons terminals={terminals} />
          <ParkingPositionMarkers parkingPositions={parkingPositions} />
          <GateMarkers gates={gates} />
          <RunwayLines runways={runways} />
        </MapContainer>

        <button
          type="button"
          onClick={() => setIsFullscreen((value) => !value)}
          aria-label={isFullscreen ? "Exit fullscreen" : "View map fullscreen"}
          className="absolute top-3 right-3 z-[1001] flex cursor-pointer items-center justify-center rounded-lg border border-gray-200 bg-white/95 p-2 text-gray-700 shadow-sm transition-colors hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900/95 dark:text-gray-200 dark:hover:bg-gray-800"
        >
          {isFullscreen ? <MdFullscreenExit size={20} /> : <MdFullscreen size={20} />}
        </button>
      </div>
    </TransparentContainer>
  );
}
