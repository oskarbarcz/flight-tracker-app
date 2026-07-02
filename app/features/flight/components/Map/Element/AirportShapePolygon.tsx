import { useMemo } from "react";
import { Polygon } from "react-leaflet";
import type { Airport } from "~/models";

type Props = {
  airport: Airport;
};

const STROKE_COLOR = "#3b82f6";
const FILL_OPACITY = 0.06;

export function AirportShapePolygon({ airport }: Props) {
  const positions = useMemo(() => {
    if (!airport.shape || airport.shape.length < 3) return null;
    return airport.shape.map((p) => [p.latitude, p.longitude] as [number, number]);
  }, [airport.shape]);

  if (!positions) return null;

  return (
    <Polygon
      positions={positions}
      pathOptions={{ color: STROKE_COLOR, weight: 1, dashArray: "4 4", fillOpacity: FILL_OPACITY }}
    />
  );
}
