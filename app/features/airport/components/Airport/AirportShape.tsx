import { twMerge } from "tailwind-merge";
import { type Point2D, roundedPolygonPath } from "~/shared/lib/roundedPolygon";
import type { Coordinates } from "~/shared/models/coordinates";

type Props = {
  shape: Coordinates[] | null;
  className?: string;
};

const VIEWBOX_SIZE = 100;
const PADDING = 12;
const CORNER_RADIUS = 2.5;

function toScaledPoints(shape: Coordinates[]): Point2D[] | null {
  if (shape.length < 3) {
    return null;
  }

  const meanLatitude = shape.reduce((sum, point) => sum + point.latitude, 0) / shape.length;
  const longitudeScale = Math.cos((meanLatitude * Math.PI) / 180);
  const projected = shape.map((point) => ({ x: point.longitude * longitudeScale, y: point.latitude }));

  const bounds = projected.reduce(
    (acc, point) => ({
      minX: Math.min(acc.minX, point.x),
      maxX: Math.max(acc.maxX, point.x),
      minY: Math.min(acc.minY, point.y),
      maxY: Math.max(acc.maxY, point.y),
    }),
    { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity },
  );

  const spanX = bounds.maxX - bounds.minX || 1;
  const spanY = bounds.maxY - bounds.minY || 1;
  const drawable = VIEWBOX_SIZE - PADDING * 2;
  const scale = drawable / Math.max(spanX, spanY);
  const offsetX = PADDING + (drawable - spanX * scale) / 2;
  const offsetY = PADDING + (drawable - spanY * scale) / 2;

  return projected.map((point) => ({
    x: offsetX + (point.x - bounds.minX) * scale,
    y: offsetY + (bounds.maxY - point.y) * scale,
  }));
}

export function AirportShape({ shape, className }: Props) {
  const points = shape ? toScaledPoints(shape) : null;

  if (!points) {
    return null;
  }

  return (
    <svg viewBox={`0 0 ${VIEWBOX_SIZE} ${VIEWBOX_SIZE}`} className={twMerge("h-full w-full", className)} aria-hidden>
      <title>Airport shape</title>
      <path
        d={roundedPolygonPath(points, CORNER_RADIUS)}
        className="fill-indigo-500 stroke-indigo-500"
        fillOpacity={0.12}
        strokeWidth={1.5}
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
