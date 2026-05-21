"use client";

import L from "leaflet";
import { useMemo } from "react";
import { MapContainer } from "react-leaflet";
import { MapTileLayer } from "~/components/flight/Map/Element/MapTileLayer";
import { RunwayLines } from "~/components/flight/Map/Element/RunwayLines";
import { computeRunwayLines } from "~/functions/runwayPairs";
import type { Runway } from "~/models";

type Props = {
  runways: Runway[];
  fallbackCenter: { latitude: number; longitude: number };
};

export function AirportRunwaysMap({ runways, fallbackCenter }: Props) {
  const lines = useMemo(() => computeRunwayLines(runways), [runways]);

  const bounds = useMemo(() => {
    if (lines.length === 0) {
      return L.latLng(fallbackCenter.latitude, fallbackCenter.longitude).toBounds(4000);
    }
    const points = lines.flatMap((line) => line.positions);
    return L.latLngBounds(points);
  }, [lines, fallbackCenter.latitude, fallbackCenter.longitude]);

  return (
    <MapContainer
      bounds={bounds}
      boundsOptions={{ padding: [40, 40] }}
      scrollWheelZoom
      className="h-full w-full rounded-xl z-0"
      attributionControl={false}
    >
      <MapTileLayer />
      <RunwayLines runways={runways} />
    </MapContainer>
  );
}
