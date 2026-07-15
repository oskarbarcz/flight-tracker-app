import Arc from "arc";
import type { LatLngTuple } from "leaflet";
import { Polyline } from "react-leaflet";
import type { Airport } from "~/features/airport";

type GreatCirclePathType = {
  start: Airport;
  end: Airport;
  variant?: "primary" | "diversion";
};

type MapPoint = { x: number; y: number };

function isValidPoint({ x, y }: MapPoint): boolean {
  return Number.isFinite(x) && Number.isFinite(y);
}

function generateGreatCirclePath(from: MapPoint, to: MapPoint): LatLngTuple[] {
  const gc = new Arc.GreatCircle(from, to);
  const line = gc.Arc(100, { offset: 10 });
  const geometry = line.geometries[0];
  if (!geometry) return [];
  return geometry.coords.map(([lon, lat]) => [lat, lon] as LatLngTuple);
}

const VARIANT_STYLE = {
  primary: { color: "#6875F5", weight: 4, dashArray: "10 10", opacity: 0.5 },
  diversion: { color: "#dc2626", weight: 4, dashArray: "6 8", opacity: 0.85 },
} as const;

export function GreatCirclePath({ start, end, variant = "primary" }: GreatCirclePathType) {
  const startPos = { x: start.location.longitude, y: start.location.latitude };
  const endPos = { x: end.location.longitude, y: end.location.latitude };

  if (!isValidPoint(startPos) || !isValidPoint(endPos)) return null;
  if (startPos.x === endPos.x && startPos.y === endPos.y) return null;

  const path = generateGreatCirclePath(startPos, endPos).filter(
    ([lat, lon]) => Number.isFinite(lat) && Number.isFinite(lon),
  );
  if (path.length < 2) return null;

  return <Polyline pathOptions={VARIANT_STYLE[variant]} positions={path} />;
}
