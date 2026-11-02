import React, { Suspense, useCallback, useRef } from "react";
import { FaDrawPolygon } from "react-icons/fa6";
import { twMerge } from "tailwind-merge";
import type { Flight } from "~/features/flight";
import { MapTopBar } from "~/features/flight/components/Map/Box/Overlay/MapTopBar";
import { MapProjectionSwitch } from "~/features/flight/components/Map/Element/MapProjectionSwitch";
import { useMapProjection } from "~/features/flight/hooks/useMapProjection";
import { FlatRouteMap } from "~/features/route/components/Chart/FlatRouteMap";
import type { RouteBriefingState } from "~/features/route/hooks/useRouteBriefing";
import type { EtopsBriefing } from "~/features/route/model";
import { useMapMaximize } from "~/shared/hooks/useMapMaximize";
import type { MapCameraView } from "~/shared/lib/mapCameraView";
import { MapAttribution } from "~/shared/ui/Map/MapAttribution";

const GlobeRouteMap = React.lazy(() =>
  import("~/features/route/components/Chart/GlobeRouteMap").then((module) => ({ default: module.GlobeRouteMap })),
);

type Props = {
  flight: Flight;
  briefing: EtopsBriefing;
  state: RouteBriefingState;
};

export function RouteChart({ flight, briefing, state }: Props) {
  const { isMaximized, toggle, containerRef, containerClassName } = useMapMaximize();
  const [renderer, setRenderer] = useMapProjection("map-projection.route-chart");
  const view = useRef<MapCameraView | null>(null);
  const rememberView = useCallback((next: MapCameraView) => {
    view.current = next;
  }, []);

  return (
    <div ref={containerRef} className={twMerge("relative h-full min-h-72 w-full", containerClassName)}>
      {renderer === "globe" ? (
        <Suspense fallback={<div className="h-full w-full animate-pulse bg-gray-100 dark:bg-gray-800" />}>
          <GlobeRouteMap
            flight={flight}
            briefing={briefing}
            state={state}
            initialView={view.current}
            onViewChange={rememberView}
          />
        </Suspense>
      ) : (
        <FlatRouteMap
          flight={flight}
          briefing={briefing}
          state={state}
          initialView={view.current}
          onViewChange={rememberView}
        />
      )}

      <MapTopBar isMaximized={isMaximized} onToggleMaximize={toggle}>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-2 text-2xs font-bold uppercase tracking-[0.08em] text-gray-500 dark:text-gray-400">
            <FaDrawPolygon className="size-3" />
            Planned route
          </span>
          <MapProjectionSwitch value={renderer} onChange={setRenderer} />
        </div>
      </MapTopBar>

      <MapAttribution />
    </div>
  );
}
