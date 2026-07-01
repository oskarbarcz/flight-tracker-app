import React from "react";
import { twMerge } from "tailwind-merge";
import type { Coordinates } from "~/models/runway.model";

type Props = {
  shape: Coordinates[] | null;
  className?: string;
};

const VIEWBOX_SIZE = 100;
const PADDING = 12;

function toPolygonPoints(shape: Coordinates[]): string | null {
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

  return projected
    .map((point) => {
      const x = offsetX + (point.x - bounds.minX) * scale;
      const y = offsetY + (bounds.maxY - point.y) * scale;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

export function AirportShape({ shape, className }: Props) {
  const points = shape ? toPolygonPoints(shape) : null;

  if (!points) {
    return null;
  }

  return (
    <svg viewBox={`0 0 ${VIEWBOX_SIZE} ${VIEWBOX_SIZE}`} className={twMerge("h-full w-full", className)} aria-hidden>
      <title>Airport shape</title>
      <polygon
        points={points}
        className="fill-blue-500 stroke-blue-500"
        fillOpacity={0.12}
        strokeWidth={1.5}
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
