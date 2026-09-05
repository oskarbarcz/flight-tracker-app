import { useThemeMode } from "flowbite-react";
import L, { type LatLngTuple } from "leaflet";
import React from "react";
import ReactDOMServer from "react-dom/server";
import { CircleMarker, Circle as LeafletCircle, Marker, Polyline } from "react-leaflet";
import { twMerge } from "tailwind-merge";
import type { Airport } from "~/features/airport/model";
import type { RouteBriefingState } from "~/features/route/hooks/useRouteBriefing";
import { translateEtopsPointKindShort } from "~/features/route/i18n";
import { etopsPointColor, fixMarkerFill } from "~/features/route/lib/chartColors";
import { nauticalMilesToMetres } from "~/features/route/lib/routeFigures";
import type { FixInsight } from "~/features/route/lib/routeInsights";
import type { EtopsBriefing, EtopsPoint, OceanicTrack } from "~/features/route/model";
import { EtopsPointKind, OceanicRouting } from "~/features/route/model";
import type { AssignedRunways } from "~/features/runway/hooks/useAssignedRunways";
import type { Runway } from "~/features/runway/model";
import { FLIGHT_COLOR, RUNWAY_COLOR } from "~/shared/lib/mapColors";

const ROUTE_STYLE = { color: FLIGHT_COLOR, weight: 2.5, opacity: 0.9 };
const TRACK_STYLE = { color: RUNWAY_COLOR, weight: 2.5, opacity: 0.85, dashArray: "2 8" };
const RULE_RING_STYLE = { color: RUNWAY_COLOR, weight: 1, opacity: 0.5, fill: false };
const THRESHOLD_RING_STYLE = { color: RUNWAY_COLOR, weight: 1, opacity: 0.35, fill: false, dashArray: "3 5" };

const LABEL_LANE: Record<EtopsPointKind, number> = {
  [EtopsPointKind.Entry]: 18,
  [EtopsPointKind.Exit]: -20,
  [EtopsPointKind.EqualTime]: 38,
  [EtopsPointKind.Critical]: -40,
};

type Props = {
  briefing: EtopsBriefing;
  airports: Map<string, Airport>;
  insights: FixInsight[];
  runways: AssignedRunways;
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

function threshold(runway: Runway | null): LatLngTuple | null {
  return runway === null ? null : [runway.coordinates.latitude, runway.coordinates.longitude];
}

function routeLine(briefing: EtopsBriefing, runways: AssignedRunways): LatLngTuple[] {
  const fixes = briefing.route.fixes.map((fix): LatLngTuple => [fix.latitude, fix.longitude]);
  const start = threshold(runways.departure);
  const end = threshold(runways.arrival);

  return fixes.map((position, index) => {
    if (index === 0 && start !== null) {
      return start;
    }

    if (index === fixes.length - 1 && end !== null) {
      return end;
    }

    return position;
  });
}

export function RouteOverlay({ briefing, airports, insights, runways, selectedOrdinal, onSelect }: Props) {
  const { computedMode } = useThemeMode();
  const pointColor = etopsPointColor(computedMode);
  const markerFill = fixMarkerFill(computedMode);
  const track = flownTrack(briefing);
  const plan = briefing.etops;
  const line = routeLine(briefing, runways);
  const selected = insights.find((insight) => insight.fix.ordinal === selectedOrdinal) ?? null;

  const ringCentres = (plan?.airports ?? [])
    .map((entry) => airports.get(entry.airportId))
    .filter((airport): airport is Airport => airport !== undefined);

  return (
    <>
      {ringCentres.map((airport) => (
        <React.Fragment key={airport.id}>
          {plan?.ruleRadiusNm !== null && plan?.ruleRadiusNm !== undefined && (
            <LeafletCircle
              center={[airport.location.latitude, airport.location.longitude]}
              radius={nauticalMilesToMetres(plan.ruleRadiusNm)}
              pathOptions={RULE_RING_STYLE}
            />
          )}
          {plan?.thresholdRadiusNm !== null && plan?.thresholdRadiusNm !== undefined && (
            <LeafletCircle
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

      {line.length > 1 && <Polyline pathOptions={ROUTE_STYLE} positions={line} />}

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
    </>
  );
}

export function PlannedRouteLayer({ state }: { state: RouteBriefingState | null }) {
  if (state === null || state.briefing === null) {
    return null;
  }

  return (
    <RouteOverlay
      briefing={state.briefing}
      airports={state.airports}
      insights={state.insights}
      runways={state.runways}
      selectedOrdinal={state.selectedOrdinal}
      onSelect={state.select}
    />
  );
}
