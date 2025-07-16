import { Polyline } from "react-leaflet";
import { LatLngExpression, LatLngTuple } from "leaflet";
import { useMemo } from "react";
import { smoothPath } from "~/functions/smooth";

type Position = LatLngTuple | LatLngExpression;

type FlightPathProps = {
  path: Position[];
};

export default function FlightPath({ path }: FlightPathProps) {
  const smoothedPath = useMemo(() => smoothPath(path), [path]);

  const pathOptions = { color: "#6875F5", weight: 4 };

  return <Polyline pathOptions={pathOptions} positions={smoothedPath} />;
}
