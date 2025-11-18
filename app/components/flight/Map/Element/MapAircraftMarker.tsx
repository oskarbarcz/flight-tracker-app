"use client";

import { Marker } from "react-leaflet";
import { useMemo } from "react";
import L from "leaflet";
import { calculateLastBearing } from "~/functions/smooth";
import { Position } from "~/models/common/geo";

type MapAircraftMarkerProps = {
  path: Position[];
};

export default function MapAircraftMarker({ path }: MapAircraftMarkerProps) {
  const bearing = useMemo(() => calculateLastBearing(path), [path]);
  const planeIcon = useMemo(
    () =>
      new L.DivIcon({
        html: `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#362F78" width="36px" height="36px" style="transform: rotate(${bearing}deg);">
          <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
        </svg>
      `,
        className: "",
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      }),
    [bearing],
  );
  const lastPosition = path[path.length - 1];

  return <Marker position={lastPosition} icon={planeIcon} />;
}
