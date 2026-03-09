"use client";

import { useMemo } from "react";
import { Polyline } from "react-leaflet";
import { smoothPath } from "~/functions/smooth";
import type { FlightPathElement } from "~/models";
import type { Position } from "~/models/common/geo";

type Props = {
  path: FlightPathElement[];
};

export function FlightPath({ path }: Props) {
  const pathPoints: Position[] = path.map((p) => [p.latitude, p.longitude]);
  const smoothedPath = useMemo(() => smoothPath(pathPoints), [pathPoints]);

  const pathOptions = { color: "#6875F5", weight: 4 };

  return <Polyline pathOptions={pathOptions} positions={smoothedPath} />;
}
