import Arc from "arc";
import type { LatLngTuple } from "leaflet";
import { Polyline } from "react-leaflet";
import type { Airport } from "~/models";

type GreatCirclePathType = {
  start: Airport;
  end: Airport;
  variant?: "primary" | "diversion";
};

function generateGreatCirclePath(from: { x: number; y: number }, to: { x: number; y: number }) {
  const gc = new Arc.GreatCircle(from, to);
  const line = gc.Arc(100, { offset: 10 });
  return line.geometries[0].coords.map(([lon, lat]) => [lat, lon] as LatLngTuple);
}

const VARIANT_STYLE = {
  primary: { color: "#6875F5", weight: 4, dashArray: "10 10", opacity: 0.5 },
  diversion: { color: "#dc2626", weight: 4, dashArray: "6 8", opacity: 0.85 },
} as const;

export function GreatCirclePath({ start, end, variant = "primary" }: GreatCirclePathType) {
  const startPos = { x: start.location.longitude, y: start.location.latitude };
  const endPos = { x: end.location.longitude, y: end.location.latitude };
  const path = generateGreatCirclePath(startPos, endPos);

  return <Polyline pathOptions={VARIANT_STYLE[variant]} positions={path} />;
}
