import L from "leaflet";
import { useMemo, useState } from "react";
import { MapContainer, useMap, useMapEvents } from "react-leaflet";
import { twMerge } from "tailwind-merge";
import type { Airport } from "~/features/airport";
import { MapTopBar } from "~/features/flight/components/Map/Box/Overlay/MapTopBar";
import { AirportShapePolygon } from "~/features/flight/components/Map/Element/AirportShapePolygon";
import { GateMarkers } from "~/features/flight/components/Map/Element/GateMarkers";
import { MapResizeHandler } from "~/features/flight/components/Map/Element/MapResizeHandler";
import { MapTileLayer } from "~/features/flight/components/Map/Element/MapTileLayer";
import { ParkingPositionMarkers } from "~/features/flight/components/Map/Element/ParkingPositionMarkers";
import { RunwayLines } from "~/features/flight/components/Map/Element/RunwayLines";
import { TerminalPolygons } from "~/features/flight/components/Map/Element/TerminalPolygons";
import {
  AIRPORT_LABELS_ZOOM_THRESHOLD,
  AIRPORT_SHAPE_ZOOM_THRESHOLD,
  AIRPORT_STRUCTURE_ZOOM_THRESHOLD,
} from "~/features/flight/components/Map/Element/zoomThresholds";
import type { Gate } from "~/features/gate";
import type { ParkingPosition } from "~/features/parking-position";
import type { Runway } from "~/features/runway";
import { computeRunwayLines } from "~/features/runway/lib/runwayPairs";
import type { Terminal } from "~/features/terminal";
import { useMapMaximize } from "~/shared/hooks/useMapMaximize";
import { TransparentContainer } from "~/shared/ui/Layout/TransparentContainer";

type Props = {
  airport: Airport;
  runways: Runway[];
  terminals: Terminal[];
  parkingPositions: ParkingPosition[];
  gates: Gate[];
  fallbackCenter: { latitude: number; longitude: number };
};

type LayerProps = {
  airport: Airport;
  runways: Runway[];
  terminals: Terminal[];
  parkingPositions: ParkingPosition[];
  gates: Gate[];
};

function ZoomedAirportLayers({ airport, runways, terminals, parkingPositions, gates }: LayerProps) {
  const map = useMap();
  const [zoom, setZoom] = useState(map.getZoom());

  useMapEvents({
    zoomend: () => setZoom(map.getZoom()),
  });

  if (zoom < AIRPORT_SHAPE_ZOOM_THRESHOLD) return null;

  const showStructure = zoom >= AIRPORT_STRUCTURE_ZOOM_THRESHOLD;
  const showLabels = zoom >= AIRPORT_LABELS_ZOOM_THRESHOLD;

  return (
    <>
      <AirportShapePolygon airport={airport} />
      {showStructure && <TerminalPolygons terminals={terminals} />}
      {showStructure && <RunwayLines runways={runways} />}
      {showLabels && <ParkingPositionMarkers parkingPositions={parkingPositions} />}
      {showLabels && <GateMarkers gates={gates} />}
    </>
  );
}

export function AirportRunwaysMap({ airport, runways, terminals, parkingPositions, gates, fallbackCenter }: Props) {
  const { isMaximized, toggle, containerRef, containerClassName } = useMapMaximize();
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

  return (
    <TransparentContainer className="h-full">
      <div ref={containerRef} className={twMerge("relative h-full min-h-72 w-full", containerClassName)}>
        <MapContainer
          bounds={bounds}
          boundsOptions={{ padding: [40, 40] }}
          scrollWheelZoom={true}
          className="h-full w-full z-0"
          zoomControl={false}
          attributionControl={false}
        >
          <MapTileLayer />
          <ZoomedAirportLayers
            airport={airport}
            runways={runways}
            terminals={terminals}
            parkingPositions={parkingPositions}
            gates={gates}
          />
          <MapResizeHandler />
        </MapContainer>

        <MapTopBar isMaximized={isMaximized} onToggleMaximize={toggle}>
          <span className="font-mono text-sm font-bold text-gray-900 dark:text-gray-100">
            {airport.icaoCode} · {airport.iataCode}
          </span>
        </MapTopBar>
      </div>
    </TransparentContainer>
  );
}
