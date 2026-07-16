import { useMemo } from "react";
import { Polygon } from "react-leaflet";
import type { Airport } from "~/features/airport";
import { FLIGHT_COLOR } from "~/shared/lib/mapColors";
import { roundedLatLngPolygon } from "~/shared/lib/roundedPolygon";

type Props = {
  airport: Airport;
};

const CORNER_FRACTION = 0.03;

export function AirportShapePolygon({ airport }: Props) {
  const positions = useMemo(() => {
    if (!airport.shape || airport.shape.length < 3) return null;
    return roundedLatLngPolygon(airport.shape, CORNER_FRACTION);
  }, [airport.shape]);

  if (!positions) return null;

  return (
    <Polygon
      positions={positions}
      pathOptions={{ className: "airport-shape-polygon", color: FLIGHT_COLOR, weight: 1.5, fillColor: FLIGHT_COLOR }}
    />
  );
}
