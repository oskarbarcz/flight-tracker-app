"use client";

import { Polyline } from "react-leaflet";
import { useMemo } from "react";
import { smoothPath } from "~/functions/smooth";
import { Position } from "~/models/common/geo";

type FlightPathProps = {
  path: Position[];
};

export default function FlightPath({ path }: FlightPathProps) {
  const smoothedPath = useMemo(() => smoothPath(path), [path]);

  const pathOptions = { color: "#6875F5", weight: 4 };

  return <Polyline pathOptions={pathOptions} positions={smoothedPath} />;
}
