import Arc from "arc";
import L, { type LatLngTuple } from "leaflet";
import React, { useEffect, useMemo } from "react";
import { MapContainer, Marker, Polyline, useMap } from "react-leaflet";
import { twMerge } from "tailwind-merge";
import { MapSettingsProvider } from "~/app-state/useMapSettings";
import type { Airport } from "~/features/airport";
import { MapTopBar } from "~/features/flight/components/Map/Box/Overlay/MapTopBar";
import { MapAirportLabel } from "~/features/flight/components/Map/Element/MapAirportLabel";
import { MapResizeHandler } from "~/features/flight/components/Map/Element/MapResizeHandler";
import { MapTileLayer } from "~/features/flight/components/Map/Element/MapTileLayer";
import { MapWorldConstraint } from "~/features/flight/components/Map/Element/MapWorldConstraint";
import type { Rotation } from "~/features/rotation";
import { useMapMaximize } from "~/shared/hooks/useMapMaximize";
import { TransparentContainer } from "~/shared/ui/Layout/TransparentContainer";

type Segment = { id: string; start: Airport; end: Airport };
type LegPath = { id: string; positions: LatLngTuple[]; midpoint: LatLngTuple };

const LEG_LINE_STYLE = { color: "#6366f1", weight: 2, dashArray: "6 6", opacity: 0.85 } as const;

type Props = {
  rotation: Rotation;
  airports: Airport[];
};

function pairKey(segment: Segment): string {
  return [segment.start.id, segment.end.id].sort().join("|");
}

function chordLength(a: Airport, b: Airport): number {
  return Math.hypot(a.location.latitude - b.location.latitude, a.location.longitude - b.location.longitude);
}

function geodesic(start: Airport, end: Airport): LatLngTuple[] {
  const greatCircle = new Arc.GreatCircle(
    { x: start.location.longitude, y: start.location.latitude },
    { x: end.location.longitude, y: end.location.latitude },
  );
  const coords = greatCircle.Arc(64, { offset: 10 }).geometries[0]?.coords ?? [];
  return coords.map(([lon, lat]) => [lat, lon] as LatLngTuple);
}

function buildLegPaths(segments: Segment[]): LegPath[] {
  const totals = new Map<string, number>();
  for (const segment of segments) {
    const key = pairKey(segment);
    totals.set(key, (totals.get(key) ?? 0) + 1);
  }

  const occurrences = new Map<string, number>();

  return segments.map((segment) => {
    const key = pairKey(segment);
    const total = totals.get(key) ?? 1;
    const occurrence = occurrences.get(key) ?? 0;
    occurrences.set(key, occurrence + 1);

    const points = geodesic(segment.start, segment.end);

    const spread = occurrence - (total - 1) / 2;
    if (total < 2 || spread === 0 || points.length < 2) {
      return { id: segment.id, positions: points, midpoint: points[Math.floor(points.length / 2)] };
    }

    const [low, high] =
      segment.start.id <= segment.end.id ? [segment.start, segment.end] : [segment.end, segment.start];
    const dLat = high.location.latitude - low.location.latitude;
    const dLon = high.location.longitude - low.location.longitude;
    const length = Math.hypot(dLat, dLon) || 1;
    const perpLat = -dLon / length;
    const perpLon = dLat / length;
    const magnitude = spread * Math.max(0.8, 0.022 * chordLength(segment.start, segment.end));

    const positions = points.map(([lat, lon], index) => {
      const offset = magnitude * Math.sin((Math.PI * index) / (points.length - 1));
      return [lat + perpLat * offset, lon + perpLon * offset] as LatLngTuple;
    });

    return { id: segment.id, positions, midpoint: positions[Math.floor(positions.length / 2)] };
  });
}

function legNumberIcon(order: number): L.DivIcon {
  return new L.DivIcon({
    html: `<span style="transform:translate(-50%,-50%);display:flex;align-items:center;justify-content:center;width:22px;height:22px;border-radius:9999px;background:#6366f1;color:#fff;border:2px solid #fff;font-size:11px;font-weight:700">${order}</span>`,
    className: "map-marker",
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
}

function FitBounds({ positions }: { positions: LatLngTuple[] }) {
  const map = useMap();
  useEffect(() => {
    if (positions.length > 0) {
      map.fitBounds(L.latLngBounds(positions), { padding: [40, 40] });
    }
  }, [positions, map]);
  return null;
}

export function RotationMap({ rotation, airports }: Props) {
  const { isMaximized, toggle, containerRef, containerClassName } = useMapMaximize();
  const byId = useMemo(() => new Map(airports.map((airport) => [airport.id, airport])), [airports]);

  const segments = useMemo<Segment[]>(() => {
    return rotation.legs
      .map((leg) => ({ id: leg.id, start: byId.get(leg.departure.id), end: byId.get(leg.arrival.id) }))
      .filter((segment): segment is Segment => Boolean(segment.start && segment.end));
  }, [rotation.legs, byId]);

  const legPaths = useMemo(() => buildLegPaths(segments), [segments]);

  const uniqueAirports = useMemo(() => {
    const collected = new Map<string, Airport>();
    for (const { start, end } of segments) {
      collected.set(start.id, start);
      collected.set(end.id, end);
    }
    return [...collected.values()];
  }, [segments]);

  const boundsPositions = useMemo<LatLngTuple[]>(() => legPaths.flatMap((leg) => leg.positions), [legPaths]);

  if (uniqueAirports.length === 0) {
    return (
      <TransparentContainer className="flex min-h-[36rem] items-center justify-center text-center text-sm text-gray-500">
        Add legs to preview the route on the map.
      </TransparentContainer>
    );
  }

  return (
    <TransparentContainer className="h-full">
      <div ref={containerRef} className={twMerge("relative h-full min-h-[36rem] w-full", containerClassName)}>
        <MapSettingsProvider>
          <MapContainer
            bounds={L.latLngBounds(boundsPositions)}
            boundsOptions={{ padding: [40, 40] }}
            scrollWheelZoom
            className="z-0 h-full w-full"
            zoomControl={false}
            attributionControl={false}
          >
            <MapTileLayer />
            <MapWorldConstraint />
            {legPaths.map((leg) => (
              <Polyline key={leg.id} pathOptions={LEG_LINE_STYLE} positions={leg.positions} />
            ))}
            {legPaths.map((leg, index) => (
              <Marker key={leg.id} position={leg.midpoint} icon={legNumberIcon(index + 1)} zIndexOffset={1200} />
            ))}
            {uniqueAirports.map((airport) => (
              <MapAirportLabel key={airport.id} airport={airport} />
            ))}
            <FitBounds positions={boundsPositions} />
            <MapResizeHandler />
          </MapContainer>
          <MapTopBar isMaximized={isMaximized} onToggleMaximize={toggle}>
            <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Route</span>
          </MapTopBar>
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
