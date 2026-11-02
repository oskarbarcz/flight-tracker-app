import { useMemo } from "react";
import { Polyline } from "react-leaflet";
import type { FlightPathElement } from "~/features/flight";
import { buildColoredSegments } from "~/features/flight/lib/flightPathSegments";
import { shiftPath, WORLD_COPIES } from "~/shared/lib/worldCopies";

type Props = {
  path: FlightPathElement[];
};

export function FlightPath({ path }: Props) {
  const segments = useMemo(() => buildColoredSegments(path), [path]);

  return (
    <>
      {WORLD_COPIES.map((offset) =>
        segments.map((segment) => (
          <Polyline
            key={`${offset}-${segment.id}`}
            positions={shiftPath(segment.positions, offset)}
            pathOptions={{ color: segment.color, weight: 4 }}
          />
        )),
      )}
    </>
  );
}
