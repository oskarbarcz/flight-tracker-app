"use client";

import L, { type LatLngTuple } from "leaflet";
import { useMemo } from "react";
import { MapContainer, Marker, Polyline } from "react-leaflet";
import { MapTileLayer } from "~/components/flight/Map/Element/MapTileLayer";
import { groupRunwaysByPair } from "~/functions/runwayPairs";
import type { Runway } from "~/models";

type Props = {
  runways: Runway[];
  fallbackCenter: { latitude: number; longitude: number };
};

type RunwayLine = {
  key: string;
  positions: LatLngTuple[];
  ends: Runway[];
};

function endLabelIcon(designator: string) {
  return new L.DivIcon({
    html: `<span class="rounded bg-indigo-700 text-white font-mono font-bold text-xs px-1.5 py-0.5 shadow">${designator}</span>`,
    className: "",
    iconSize: [0, 0],
    iconAnchor: [-4, 6],
  });
}

function destinationPoint(lat: number, lng: number, bearingDeg: number, distanceM: number): LatLngTuple {
  const earthRadiusM = 6371000;
  const lat1Rad = (lat * Math.PI) / 180;
  const lon1Rad = (lng * Math.PI) / 180;
  const bearingRad = (bearingDeg * Math.PI) / 180;
  const angularDistance = distanceM / earthRadiusM;

  const lat2Rad = Math.asin(
    Math.sin(lat1Rad) * Math.cos(angularDistance) +
      Math.cos(lat1Rad) * Math.sin(angularDistance) * Math.cos(bearingRad),
  );
  const lon2Rad =
    lon1Rad +
    Math.atan2(
      Math.sin(bearingRad) * Math.sin(angularDistance) * Math.cos(lat1Rad),
      Math.cos(angularDistance) - Math.sin(lat1Rad) * Math.sin(lat2Rad),
    );

  return [(lat2Rad * 180) / Math.PI, (lon2Rad * 180) / Math.PI];
}

export function AirportRunwaysMap({ runways, fallbackCenter }: Props) {
  const pairs = useMemo(() => groupRunwaysByPair(runways), [runways]);

  const lines = useMemo<RunwayLine[]>(() => {
    return pairs.flatMap((pair) => {
      if (pair.ends.length === 2) {
        const positions: LatLngTuple[] = pair.ends.map((end) => [end.coordinates.latitude, end.coordinates.longitude]);
        return [{ key: pair.key, positions, ends: pair.ends }];
      }
      const end = pair.ends[0];
      const otherEnd = destinationPoint(
        end.coordinates.latitude,
        end.coordinates.longitude,
        end.magneticHeading,
        end.length,
      );
      const positions: LatLngTuple[] = [[end.coordinates.latitude, end.coordinates.longitude], otherEnd];
      return [{ key: pair.key, positions, ends: pair.ends }];
    });
  }, [pairs]);

  const bounds = useMemo(() => {
    if (lines.length === 0) {
      return L.latLng(fallbackCenter.latitude, fallbackCenter.longitude).toBounds(4000);
    }
    const points: LatLngTuple[] = lines.flatMap((line) => line.positions);
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
      {lines.map((line) => (
        <Polyline
          key={line.key}
          positions={line.positions}
          pathOptions={{ color: "#4338ca", weight: 6, opacity: 0.85 }}
        />
      ))}
      {lines.flatMap((line) =>
        line.ends.map((end) => (
          <Marker
            key={end.id}
            position={[end.coordinates.latitude, end.coordinates.longitude]}
            icon={endLabelIcon(end.designator)}
          />
        )),
      )}
    </MapContainer>
  );
}
