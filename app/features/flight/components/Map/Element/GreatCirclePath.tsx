import { useMemo } from "react";
import { Polyline } from "react-leaflet";
import type { Airport } from "~/features/airport";
import { airportRoute } from "~/features/flight/lib/flightMapBounds";
import { ROUTE_LINE_SMOOTH_FACTOR } from "~/shared/lib/greatCircle";
import { shiftPath, WORLD_COPIES } from "~/shared/lib/worldCopies";

type GreatCirclePathType = {
  start: Airport;
  end: Airport;
  variant?: "primary" | "diversion";
};

const VARIANT_STYLE = {
  primary: { color: "#6366f1", weight: 2, dashArray: "6 6", opacity: 0.8 },
  diversion: { color: "#dc2626", weight: 2, dashArray: "6 6", opacity: 0.9 },
} as const;

export function GreatCirclePath({ start, end, variant = "primary" }: GreatCirclePathType) {
  const path = useMemo(() => airportRoute(start, end), [start, end]);

  if (path.length < 2) return null;

  return (
    <>
      {WORLD_COPIES.map((offset) => (
        <Polyline
          key={offset}
          pathOptions={VARIANT_STYLE[variant]}
          positions={shiftPath(path, offset)}
          smoothFactor={ROUTE_LINE_SMOOTH_FACTOR}
        />
      ))}
    </>
  );
}
