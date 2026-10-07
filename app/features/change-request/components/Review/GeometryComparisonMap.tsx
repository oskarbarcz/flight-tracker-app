import L from "leaflet";
import React, { useMemo } from "react";
import { CircleMarker, MapContainer, Polygon, Polyline } from "react-leaflet";
import { twMerge } from "tailwind-merge";
import { MapTopBar } from "~/features/flight/components/Map/Box/Overlay/MapTopBar";
import { MapResizeHandler } from "~/features/flight/components/Map/Element/MapResizeHandler";
import { MapTileLayer } from "~/features/flight/components/Map/Element/MapTileLayer";
import { useMapMaximize } from "~/shared/hooks/useMapMaximize";
import { FLIGHT_COLOR } from "~/shared/lib/mapColors";
import type { Coordinates } from "~/shared/models/coordinates";

const CURRENT_COLOR = "#6b7280";
const MIN_EXTENT_METERS = 400;
const FIT_PADDING_TOP_LEFT: L.PointTuple = [32, 64];
const FIT_PADDING_BOTTOM_RIGHT: L.PointTuple = [32, 32];

export type Geometry = { kind: "point"; point: Coordinates } | { kind: "polygon"; points: Coordinates[] };

type Props = {
  title: string;
  current: Geometry | null;
  proposed: Geometry | null;
};

function toLatLng(point: Coordinates): L.LatLngTuple {
  return [point.latitude, point.longitude];
}

function pointsOf(geometry: Geometry | null): L.LatLngTuple[] {
  if (geometry === null) return [];
  return geometry.kind === "point" ? [toLatLng(geometry.point)] : geometry.points.map(toLatLng);
}

function boundsFor(current: Geometry | null, proposed: Geometry | null): L.LatLngBounds {
  const fitted = L.latLngBounds([...pointsOf(current), ...pointsOf(proposed)]);
  if (fitted.getNorthEast().distanceTo(fitted.getSouthWest()) >= MIN_EXTENT_METERS) {
    return fitted;
  }
  return fitted.getCenter().toBounds(MIN_EXTENT_METERS);
}

function LegendSwatch({ variant }: { variant: "current" | "proposed" }) {
  return (
    <span
      aria-hidden={true}
      className={twMerge(
        "h-0 w-4 border-t-2",
        variant === "current"
          ? "border-dashed border-gray-500 dark:border-gray-400"
          : "border-indigo-500 dark:border-indigo-400",
      )}
    />
  );
}

function Legend({ title, hasCurrent, hasProposed }: { title: string; hasCurrent: boolean; hasProposed: boolean }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
      <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{title}</span>
      {hasCurrent && (
        <span className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300">
          <LegendSwatch variant="current" />
          Now
        </span>
      )}
      {hasProposed && (
        <span className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300">
          <LegendSwatch variant="proposed" />
          Proposed
        </span>
      )}
    </div>
  );
}

function GeometryLayer({ geometry, variant }: { geometry: Geometry; variant: "current" | "proposed" }) {
  const color = variant === "current" ? CURRENT_COLOR : FLIGHT_COLOR;

  if (geometry.kind === "polygon") {
    return (
      <Polygon
        positions={geometry.points.map(toLatLng)}
        pathOptions={{
          color,
          weight: variant === "current" ? 2 : 2.5,
          dashArray: variant === "current" ? "6 5" : undefined,
          fillColor: color,
          fillOpacity: variant === "current" ? 0.04 : 0.12,
        }}
      />
    );
  }

  return (
    <CircleMarker
      center={toLatLng(geometry.point)}
      radius={variant === "current" ? 7 : 6}
      pathOptions={{
        color,
        weight: 2,
        fillColor: variant === "current" ? "#ffffff" : color,
        fillOpacity: variant === "current" ? 0.6 : 0.9,
      }}
    />
  );
}

export function GeometryComparisonMap({ title, current, proposed }: Props) {
  const { isMaximized, toggle, containerRef, containerClassName } = useMapMaximize();
  const bounds = useMemo(() => boundsFor(current, proposed), [current, proposed]);
  const displacement =
    current?.kind === "point" && proposed?.kind === "point"
      ? [toLatLng(current.point), toLatLng(proposed.point)]
      : null;

  return (
    <div
      ref={containerRef}
      className={twMerge(
        "relative w-full overflow-hidden",
        isMaximized ? containerClassName : "h-64 rounded-xl border border-gray-200 dark:border-gray-700",
      )}
    >
      <MapContainer
        bounds={bounds}
        boundsOptions={{
          paddingTopLeft: FIT_PADDING_TOP_LEFT,
          paddingBottomRight: FIT_PADDING_BOTTOM_RIGHT,
          maxZoom: 18,
        }}
        scrollWheelZoom={false}
        zoomControl={false}
        attributionControl={false}
        className="z-0 h-full w-full"
      >
        <MapTileLayer />
        {displacement && (
          <Polyline positions={displacement} pathOptions={{ color: CURRENT_COLOR, weight: 1.5, dashArray: "3 4" }} />
        )}
        {current && <GeometryLayer geometry={current} variant="current" />}
        {proposed && <GeometryLayer geometry={proposed} variant="proposed" />}
        <MapResizeHandler />
      </MapContainer>

      <MapTopBar isMaximized={isMaximized} onToggleMaximize={toggle}>
        <Legend title={title} hasCurrent={current !== null} hasProposed={proposed !== null} />
      </MapTopBar>
    </div>
  );
}
