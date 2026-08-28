import L from "leaflet";
import { type ReactNode, useMemo, useState } from "react";
import { Marker, Tooltip, useMap, useMapEvents } from "react-leaflet";
import type { FlightPathElement } from "~/features/flight";
import { RUNWAY_ZOOM_THRESHOLD } from "~/features/flight/components/Map/Element/zoomThresholds";
import { calculateLastBearing } from "~/features/flight/lib/smooth";
import type { Position } from "~/shared/models/geo";

type MapAircraftMarkerProps = {
  path: FlightPathElement[];
  label?: ReactNode;
};

export function MapAircraftMarker({ path, label }: MapAircraftMarkerProps) {
  const map = useMap();
  const [zoom, setZoom] = useState(map.getZoom());
  const lastPoint = path[path.length - 1];

  useMapEvents({
    zoomend: () => setZoom(map.getZoom()),
  });

  const bearing = useMemo(() => {
    if (lastPoint?.track !== undefined) {
      return lastPoint.track;
    }
    const positions: Position[] = path.map((p) => [p.latitude, p.longitude]);
    return calculateLastBearing(positions);
  }, [lastPoint, path]);

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

  if (!lastPoint) {
    return null;
  }

  return (
    <Marker position={[lastPoint.latitude, lastPoint.longitude]} icon={planeIcon} zIndexOffset={10000}>
      {label && zoom < RUNWAY_ZOOM_THRESHOLD && (
        <Tooltip permanent direction="right" offset={[28, 0]} opacity={1} className="map-aircraft-label">
          {label}
        </Tooltip>
      )}
    </Marker>
  );
}
