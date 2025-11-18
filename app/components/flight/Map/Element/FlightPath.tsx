"use client";

import { useMemo } from "react";
import { Polyline } from "react-leaflet";
import { smoothPath } from "~/functions/smooth";
import { FlightPathElement } from "~/models";
import { Position } from "~/models/common/geo";

type FlightPathProps = {
  path: FlightPathElement[];
};

export default function FlightPath({ path }: FlightPathProps) {
  const pathPoints: Position[] = path.map((p) => [p.latitude, p.longitude]);
  const smoothedPath = useMemo(() => smoothPath(pathPoints), [pathPoints]);

  const pathOptions = { color: "#6875F5", weight: 4 };

  return <Polyline pathOptions={pathOptions} positions={smoothedPath} />;
}
