import type { LatLngTuple } from "leaflet";
import { destinationPoint } from "~/shared/lib/greatCircle";

export type GlobeScreenLine = {
  id: string;
  path: LatLngTuple[];
  color: string;
  width: number;
  opacity: number;
  dash?: string;
};

export type ScreenPoint = { x: number; y: number };

export type Projector = (position: LatLngTuple) => ScreenPoint;

const FACING_PROBE_RADIANS = 0.0005;

function facesCamera(project: Projector, position: LatLngTuple, at: ScreenPoint): boolean {
  const east = project(destinationPoint(position, 90, FACING_PROBE_RADIANS));
  const north = project(destinationPoint(position, 0, FACING_PROBE_RADIANS));
  const winding = (east.x - at.x) * (north.y - at.y) - (east.y - at.y) * (north.x - at.x);

  return winding < 0;
}

export function screenPathData(path: LatLngTuple[], project: Projector): string {
  const commands: string[] = [];
  let drawing = false;

  for (const position of path) {
    const point = project(position);

    if (!facesCamera(project, position, point)) {
      drawing = false;
      continue;
    }

    commands.push(`${drawing ? "L" : "M"}${point.x.toFixed(1)} ${point.y.toFixed(1)}`);
    drawing = true;
  }

  return commands.join("");
}
