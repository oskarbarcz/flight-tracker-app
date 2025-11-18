"use client";

import { Polyline } from "react-leaflet";
import { useMemo } from "react";
import { smoothPath } from "~/functions/smooth";
import { Position } from "~/models/common/geo";
import { FlightPathElement } from "~/models";

type FlightPathProps = {
  path: FlightPathElement[];
};

export default function FlightPath({ path }: FlightPathProps) {
  const pathPoints: Position[] = path.map((p) => [p.latitude, p.longitude]);
  const smoothedPath = useMemo(() => smoothPath(pathPoints), [pathPoints]);

  const pathOptions = { color: "#6875F5", weight: 4 };

  return <Polyline pathOptions={pathOptions} positions={smoothedPath} />;
}
