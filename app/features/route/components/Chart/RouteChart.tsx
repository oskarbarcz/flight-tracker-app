import { useThemeMode } from "flowbite-react";
import L, { type LatLngTuple } from "leaflet";
import React from "react";
import ReactDOMServer from "react-dom/server";
import { FaDrawPolygon } from "react-icons/fa6";
import { Circle, CircleMarker, MapContainer, Marker, Polyline } from "react-leaflet";
import { twMerge } from "tailwind-merge";
import type { Airport } from "~/features/airport/model";
import type { Flight } from "~/features/flight";
import { MapTopBar } from "~/features/flight/components/Map/Box/Overlay/MapTopBar";
import { MapAirportLabel } from "~/features/flight/components/Map/Element/MapAirportLabel";
import { MapResizeHandler } from "~/features/flight/components/Map/Element/MapResizeHandler";
import { MapTileLayer } from "~/features/flight/components/Map/Element/MapTileLayer";
import { MapWorldConstraint } from "~/features/flight/components/Map/Element/MapWorldConstraint";
import { translateEtopsPointKindShort } from "~/features/route/i18n";
import { etopsPointColor, fixMarkerFill } from "~/features/route/lib/chartColors";
import { nauticalMilesToMetres } from "~/features/route/lib/routeFigures";
import type { FixInsight } from "~/features/route/lib/routeInsights";
import type { EtopsBriefing, EtopsPoint, OceanicTrack } from "~/features/route/model";
import { EtopsPointKind, OceanicRouting } from "~/features/route/model";
import { useMapMaximize } from "~/shared/hooks/useMapMaximize";
import { FLIGHT_COLOR, RUNWAY_COLOR } from "~/shared/lib/mapColors";

const ROUTE_STYLE = { color: FLIGHT_COLOR, weight: 2.5, opacity: 0.9 };
const TRACK_STYLE = { color: RUNWAY_COLOR, weight: 2.5, opacity: 0.85, dashArray: "2 8" };
const RULE_RING_STYLE = { color: RUNWAY_COLOR, weight: 1, opacity: 0.5, fill: false };
const THRESHOLD_RING_STYLE = { color: RUNWAY_COLOR, weight: 1, opacity: 0.35, fill: false, dashArray: "3 5" };

type Props = {
  flight: Flight;
  briefing: EtopsBriefing;
  airports: Map<string, Airport>;
  insights: FixInsight[];
  selectedOrdinal: number | null;
  onSelect: (ordinal: number) => void;
};

function EtopsPointLabel({ point }: { point: EtopsPoint }) {
  return (
    <div className={twMerge("map-etops-label", point.isCritical && "map-etops-label--critical")}>
      <span className="map-etops-label__kind">{translateEtopsPointKindShort(point.kind)}</span>
    </div>
  );
}

const LABEL_LANE: Record<EtopsPointKind, number> = {
  [EtopsPointKind.Entry]: 18,
  [EtopsPointKind.Exit]: -20,
  [EtopsPointKind.EqualTime]: 38,
  [EtopsPointKind.Critical]: -40,
};

function labelOffset(point: EtopsPoint): number {
  const lane = LABEL_LANE[point.kind];

  return lane + (point.ordinal - 1) * (lane >= 0 ? 18 : -18);
}

function etopsPointIcon(point: EtopsPoint) {
  return new L.DivIcon({
    html: ReactDOMServer.renderToString(<EtopsPointLabel point={point} />),
    className: "map-marker",
    iconSize: [0, 0],
    iconAnchor: [0, labelOffset(point)],
  });
}

function flownTrack(briefing: EtopsBriefing): OceanicTrack | null {
  const { routing, trackId, tracks } = briefing.oceanicCrossing;

  if (routing === OceanicRouting.Random || trackId === null) {
    return null;
  }

  return tracks.find((track) => track.identifier === trackId) ?? null;
}

function chartBounds(flight: Flight, briefing: EtopsBriefing): L.LatLngBounds {
  const points: LatLngTuple[] = [
    [flight.departureAirport.location.latitude, flight.departureAirport.location.longitude],
    [flight.destinationAirport.location.latitude, flight.destinationAirport.location.longitude],
    ...briefing.route.fixes.map((fix): LatLngTuple => [fix.latitude, fix.longitude]),
    ...(briefing.etops?.points ?? []).map((point): LatLngTuple => [point.position.latitude, point.position.longitude]),
  ];

  return L.latLngBounds(points);
}

export function RouteChart({ flight, briefing, airports, insights, selectedOrdinal, onSelect }: Props) {
  const { isMaximized, toggle, containerRef, containerClassName } = useMapMaximize();
  const { computedMode } = useThemeMode();
  const pointColor = etopsPointColor(computedMode);
  const markerFill = fixMarkerFill(computedMode);
  const track = flownTrack(briefing);
  const plan = briefing.etops;
  const routeLine = briefing.route.fixes.map((fix): LatLngTuple => [fix.latitude, fix.longitude]);
  const selected = insights.find((insight) => insight.fix.ordinal === selectedOrdinal) ?? null;

  const ringCentres = (plan?.airports ?? [])
    .map((entry) => airports.get(entry.airportId))
    .filter((airport): airport is Airport => airport !== undefined);

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

        {ringCentres.map((airport) => (
          <React.Fragment key={airport.id}>
            {plan?.ruleRadiusNm !== null && plan?.ruleRadiusNm !== undefined && (
              <Circle
                center={[airport.location.latitude, airport.location.longitude]}
                radius={nauticalMilesToMetres(plan.ruleRadiusNm)}
                pathOptions={RULE_RING_STYLE}
              />
            )}
            {plan?.thresholdRadiusNm !== null && plan?.thresholdRadiusNm !== undefined && (
              <Circle
                center={[airport.location.latitude, airport.location.longitude]}
                radius={nauticalMilesToMetres(plan.thresholdRadiusNm)}
                pathOptions={THRESHOLD_RING_STYLE}
              />
            )}
          </React.Fragment>
        ))}

        {track !== null && track.fixes.length > 1 && (
          <Polyline
            pathOptions={TRACK_STYLE}
            positions={track.fixes.map((fix): LatLngTuple => [fix.latitude, fix.longitude])}
          />
        )}

        {routeLine.length > 1 && <Polyline pathOptions={ROUTE_STYLE} positions={routeLine} />}

        {insights.map(({ fix }) => (
          <CircleMarker
            key={fix.ordinal}
            center={[fix.latitude, fix.longitude]}
            radius={2.5}
            pathOptions={{ color: RUNWAY_COLOR, weight: 1, fillColor: markerFill, fillOpacity: 1 }}
            eventHandlers={{ click: () => onSelect(fix.ordinal) }}
          />
        ))}

        {(plan?.points ?? []).map((point) => (
          <React.Fragment key={`${point.kind}-${point.ordinal}`}>
            <CircleMarker
              center={[point.position.latitude, point.position.longitude]}
              radius={point.isCritical ? 6 : 4}
              pathOptions={{
                color: pointColor,
                weight: 1.5,
                fillColor: pointColor,
                fillOpacity: point.isCritical ? 1 : 0.4,
              }}
            />
            <Marker
              position={[point.position.latitude, point.position.longitude]}
              icon={etopsPointIcon(point)}
              zIndexOffset={900}
            />
          </React.Fragment>
        ))}

        {selected !== null && (
          <CircleMarker
            center={[selected.fix.latitude, selected.fix.longitude]}
            radius={6}
            pathOptions={{ color: markerFill, weight: 2, fillColor: FLIGHT_COLOR, fillOpacity: 1 }}
          />
        )}

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
