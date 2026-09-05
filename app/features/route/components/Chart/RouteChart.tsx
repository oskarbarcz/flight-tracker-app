import L, { type LatLngTuple } from "leaflet";
import React from "react";
import { FaDrawPolygon } from "react-icons/fa6";
import { MapContainer } from "react-leaflet";
import { twMerge } from "tailwind-merge";
import type { Flight } from "~/features/flight";
import { MapTopBar } from "~/features/flight/components/Map/Box/Overlay/MapTopBar";
import { MapAirportLabel } from "~/features/flight/components/Map/Element/MapAirportLabel";
import { MapResizeHandler } from "~/features/flight/components/Map/Element/MapResizeHandler";
import { MapTileLayer } from "~/features/flight/components/Map/Element/MapTileLayer";
import { MapWorldConstraint } from "~/features/flight/components/Map/Element/MapWorldConstraint";
import { PlannedRouteLayer } from "~/features/route/components/Chart/RouteOverlay";
import type { RouteBriefingState } from "~/features/route/hooks/useRouteBriefing";
import type { EtopsBriefing } from "~/features/route/model";
import { useMapMaximize } from "~/shared/hooks/useMapMaximize";

type Props = {
  flight: Flight;
  briefing: EtopsBriefing;
  state: RouteBriefingState;
};

function chartBounds(flight: Flight, briefing: EtopsBriefing): L.LatLngBounds {
  const points: LatLngTuple[] = [
    [flight.departureAirport.location.latitude, flight.departureAirport.location.longitude],
    [flight.destinationAirport.location.latitude, flight.destinationAirport.location.longitude],
    ...briefing.route.fixes.map((fix): LatLngTuple => [fix.latitude, fix.longitude]),
    ...(briefing.etops?.points ?? []).map((point): LatLngTuple => [point.position.latitude, point.position.longitude]),
  ];

  return L.latLngBounds(points);
}

export function RouteChart({ flight, briefing, state }: Props) {
  const { isMaximized, toggle, containerRef, containerClassName } = useMapMaximize();

  return (
    <div ref={containerRef} className={twMerge("relative h-full min-h-72 w-full", containerClassName)}>
      <MapContainer
        bounds={chartBounds(flight, briefing)}
        boundsOptions={{ padding: [48, 48] }}
        scrollWheelZoom={true}
        className="h-full w-full z-0"
        zoomControl={false}
        attributionControl={false}
      >
        <MapTileLayer />
        <MapWorldConstraint />

        <PlannedRouteLayer state={state} />

        <MapAirportLabel airport={flight.departureAirport} />
        <MapAirportLabel airport={flight.destinationAirport} />
        <MapResizeHandler />
      </MapContainer>

      <MapTopBar isMaximized={isMaximized} onToggleMaximize={toggle}>
        <span className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.08em] text-gray-500 dark:text-gray-400">
          <FaDrawPolygon className="size-3" />
          Planned route
        </span>
      </MapTopBar>

      <div className="absolute bottom-1 right-1 z-10 rounded bg-white/80 px-1.5 py-0.5 text-[11px] text-gray-500 dark:bg-gray-900/80 dark:text-gray-400">
        ©{" "}
        <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer" className="hover:underline">
          OpenStreetMap
        </a>
      </div>
    </div>
  );
}
