"use client";

import { Polyline } from "react-leaflet";
import { Airport } from "~/models";
import Arc from "arc";
import { LatLngTuple } from "leaflet";

type GreatCirclePathType = {
  start: Airport;
  end: Airport;
};

function generateGreatCirclePath(
  from: { x: number; y: number },
  to: { x: number; y: number },
) {
  const gc = new Arc.GreatCircle(from, to);
  const line = gc.Arc(100, { offset: 10 });
  return line.geometries[0].coords.map(
    ([lon, lat]) => [lat, lon] as LatLngTuple,
  );
}

export default function GreatCirclePath({ start, end }: GreatCirclePathType) {
  const startPos = { x: start.location.longitude, y: start.location.latitude };
  const endPos = { x: end.location.longitude, y: end.location.latitude };
  const path = generateGreatCirclePath(startPos, endPos);

  const pathOptions = {
    color: "#6875F5",
    weight: 4,
    dashArray: "10 10",
    opacity: 0.5,
  };

  return <Polyline pathOptions={pathOptions} positions={path} />;
}
