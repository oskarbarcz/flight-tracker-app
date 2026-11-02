import L, { type LatLngTuple } from "leaflet";
import React, { Suspense, useCallback, useEffect, useMemo, useRef } from "react";
import { MapContainer, Marker, Polyline, useMap } from "react-leaflet";
import { twMerge } from "tailwind-merge";
import { MapSettingsProvider } from "~/app-state/useMapSettings";
import type { Airport } from "~/features/airport";
import { MapTopBar } from "~/features/flight/components/Map/Box/Overlay/MapTopBar";
import { MapAirportLabel } from "~/features/flight/components/Map/Element/MapAirportLabel";
import { MapProjectionSwitch } from "~/features/flight/components/Map/Element/MapProjectionSwitch";
import { MapResizeHandler } from "~/features/flight/components/Map/Element/MapResizeHandler";
import { MapTileLayer } from "~/features/flight/components/Map/Element/MapTileLayer";
import { MapViewMemory } from "~/features/flight/components/Map/Element/MapViewMemory";
import { MapWorldConstraint } from "~/features/flight/components/Map/Element/MapWorldConstraint";
import { useMapProjection } from "~/features/flight/hooks/useMapProjection";
import type { Rotation } from "~/features/rotation";
import { buildLegPaths, type Segment } from "~/features/rotation/lib";
import { useMapMaximize } from "~/shared/hooks/useMapMaximize";
import type { GlobeInsets } from "~/shared/lib/globeCamera";
import { ROUTE_LINE_SMOOTH_FACTOR } from "~/shared/lib/greatCircle";
import type { MapCameraView } from "~/shared/lib/mapCameraView";
import { shiftPath, shiftPoint, WORLD_COPIES } from "~/shared/lib/worldCopies";
import { TransparentContainer } from "~/shared/ui/Layout/TransparentContainer";
import { MapAttribution } from "~/shared/ui/Map/MapAttribution";

const LEG_LINE_STYLE = { color: "#6366f1", weight: 2, dashArray: "6 6", opacity: 0.85 } as const;
const TOP_BAR_HEIGHT = 41;
const TOP_BAR_INSETS: GlobeInsets = { top: TOP_BAR_HEIGHT, bottom: 0 };

const RotationGlobeMap = React.lazy(() =>
  import("~/features/rotation/components/RotationGlobeMap").then((module) => ({
    default: module.RotationGlobeMap,
  })),
);

type Props = {
  rotation: Rotation;
  airports: Airport[];
};

function legNumberIcon(order: number): L.DivIcon {
  return new L.DivIcon({
    html: `<span style="transform:translate(-50%,-50%);display:flex;align-items:center;justify-content:center;width:22px;height:22px;border-radius:9999px;background:#6366f1;color:#fff;border:2px solid #fff;font-size:11px;font-weight:700">${order}</span>`,
    className: "map-marker",
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
}

function FitBounds({ positions }: { positions: LatLngTuple[] }) {
  const map = useMap();
  useEffect(() => {
    if (positions.length > 0) {
      map.fitBounds(L.latLngBounds(positions), { padding: [40, 40] });
    }
  }, [positions, map]);
  return null;
}

export function RotationMap({ rotation, airports }: Props) {
  const { isMaximized, toggle, containerRef, containerClassName } = useMapMaximize();
  const [projection, setProjection] = useMapProjection("map-projection.rotation");
  const view = useRef<MapCameraView | null>(null);
  const rememberView = useCallback((next: MapCameraView) => {
    view.current = next;
  }, []);
  const byId = useMemo(() => new Map(airports.map((airport) => [airport.id, airport])), [airports]);

  const segments = useMemo<Segment[]>(() => {
    return rotation.legs
      .map((leg) => ({ id: leg.id, start: byId.get(leg.departure.id), end: byId.get(leg.arrival.id) }))
      .filter((segment): segment is Segment => Boolean(segment.start && segment.end));
  }, [rotation.legs, byId]);

  const legPaths = useMemo(() => buildLegPaths(segments), [segments]);

  const uniqueAirports = useMemo(() => {
    const collected = new Map<string, Airport>();
    for (const { start, end } of segments) {
      collected.set(start.id, start);
      collected.set(end.id, end);
    }
    return [...collected.values()];
  }, [segments]);

  const boundsPositions = useMemo<LatLngTuple[]>(() => legPaths.flatMap((leg) => leg.positions), [legPaths]);

  if (uniqueAirports.length === 0) {
    return (
      <TransparentContainer className="flex min-h-[36rem] items-center justify-center text-center text-sm text-gray-500 dark:text-gray-400">
        Add legs to preview the route on the map.
      </TransparentContainer>
    );
  }

  return (
    <TransparentContainer className="h-full">
      <div ref={containerRef} className={twMerge("relative h-full min-h-[36rem] w-full", containerClassName)}>
        <MapSettingsProvider>
          {projection === "globe" ? (
            <Suspense fallback={<div className="h-full w-full animate-pulse bg-gray-100 dark:bg-gray-900" />}>
              <RotationGlobeMap
                legPaths={legPaths}
                airports={uniqueAirports}
                insets={TOP_BAR_INSETS}
                initialView={view.current}
                onViewChange={rememberView}
              />
            </Suspense>
          ) : (
            <MapContainer
              worldCopyJump={true}
              bounds={L.latLngBounds(boundsPositions)}
              boundsOptions={{ padding: [40, 40] }}
              scrollWheelZoom
              zoomSnap={0}
              className="z-0 h-full w-full"
              zoomControl={false}
              attributionControl={false}
            >
              <MapTileLayer />
              <MapWorldConstraint crossAntimeridian={true} />
              {WORLD_COPIES.map((offset) =>
                legPaths.map((leg, index) => (
                  <React.Fragment key={`${offset}-${leg.id}`}>
                    <Polyline
                      pathOptions={LEG_LINE_STYLE}
                      positions={shiftPath(leg.positions, offset)}
                      smoothFactor={ROUTE_LINE_SMOOTH_FACTOR}
                    />
                    <Marker
                      position={shiftPoint(leg.midpoint, offset)}
                      icon={legNumberIcon(index + 1)}
                      zIndexOffset={1200}
                    />
                  </React.Fragment>
                )),
              )}
              {uniqueAirports.map((airport) => (
                <MapAirportLabel key={airport.id} airport={airport} />
              ))}
              <FitBounds positions={boundsPositions} />
              <MapResizeHandler />
              <MapViewMemory initialView={view.current} onViewChange={rememberView} topInset={TOP_BAR_HEIGHT} />
            </MapContainer>
          )}
          <MapTopBar isMaximized={isMaximized} onToggleMaximize={toggle}>
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Route
              </span>
              <MapProjectionSwitch value={projection} onChange={setProjection} />
            </div>
          </MapTopBar>
          <MapAttribution />
        </MapSettingsProvider>
      </div>
    </TransparentContainer>
  );
}
