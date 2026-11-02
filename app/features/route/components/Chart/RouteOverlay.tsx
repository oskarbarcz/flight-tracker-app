import { useThemeMode } from "flowbite-react";
import L from "leaflet";
import React, { useMemo } from "react";
import { CircleMarker, Circle as LeafletCircle, Marker, Polyline, useMap } from "react-leaflet";
import type { Airport } from "~/features/airport/model";
import type { RouteBriefingState } from "~/features/route/hooks/useRouteBriefing";
import { etopsColor, fixMarkerFill } from "~/features/route/lib/chartColors";
import { etopsRingSpecs } from "~/features/route/lib/etopsRings";
import { nauticalMilesToMetres } from "~/features/route/lib/routeFigures";
import { fixLabelClassName, type RouteFixMark, routeFixMarks } from "~/features/route/lib/routeFixMarks";
import { flownTrack, routeLine, trackLine } from "~/features/route/lib/routeGeometry";
import type { FixInsight } from "~/features/route/lib/routeInsights";
import type { EtopsBriefing } from "~/features/route/model";
import type { AssignedRunways } from "~/features/runway/hooks/useAssignedRunways";
import { destinationPoint } from "~/features/runway/lib/runwayPairs";
import { escapeHtml } from "~/shared/lib/escapeHtml";
import { ROUTE_LINE_SMOOTH_FACTOR } from "~/shared/lib/greatCircle";
import { FLIGHT_COLOR, RUNWAY_COLOR } from "~/shared/lib/mapColors";
import { shiftPath, shiftPoint, WORLD_COPIES } from "~/shared/lib/worldCopies";

const ROUTE_STYLE = { color: FLIGHT_COLOR, weight: 2.5, opacity: 0.9 };
const TRACK_STYLE = { color: RUNWAY_COLOR, weight: 2.5, opacity: 0.85, dashArray: "2 8" };
const RULE_RING_STYLE = { weight: 1, opacity: 0.5, fill: false };
const THRESHOLD_RING_STYLE = { weight: 1, opacity: 0.35, fill: false, dashArray: "3 5" };

type LayerProps = Props & { offset: number };

type Props = {
  briefing: EtopsBriefing;
  airports: Map<string, Airport>;
  insights: FixInsight[];
  runways: AssignedRunways;
  selectedOrdinal: number | null;
  onSelect: (ordinal: number) => void;
  showRings?: boolean;
};

type RingsProps = {
  briefing: EtopsBriefing;
  airports: Map<string, Airport>;
  offset: number;
};

function ringTitleIcon(title: string) {
  return new L.DivIcon({
    html: `<span class="map-ring-label">${escapeHtml(title)}</span>`,
    className: "map-marker",
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
}

const PASSIVE_FIX_CLASS = "map-fix-passive";

function isSelectable(mark: RouteFixMark): boolean {
  return mark.ordinal !== null;
}

function fixLabelIcon(mark: RouteFixMark) {
  return new L.DivIcon({
    html: `<span class="${fixLabelClassName(mark)}" data-fix="${mark.key}">${escapeHtml(mark.name)}</span>`,
    className: isSelectable(mark) ? "map-marker" : `map-marker ${PASSIVE_FIX_CLASS}`,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
}

const FIX_HIT_RADIUS = 9;

function highlightFixLabel(container: HTMLElement, key: string, active: boolean) {
  for (const label of container.querySelectorAll(`.map-fix-label[data-fix="${key}"]`)) {
    label.classList.toggle("map-fix-label--active", active);
  }
}

function EtopsRings({ briefing, airports, offset }: RingsProps) {
  const { computedMode } = useThemeMode();
  const color = etopsColor(computedMode);
  const specs = etopsRingSpecs(briefing.etops);
  const ringCentres = (briefing.etops?.airports ?? [])
    .map((entry) => airports.get(entry.airportId))
    .filter((airport): airport is Airport => airport !== undefined);

  return (
    <>
      {ringCentres.map((airport) =>
        specs.map((spec) => {
          const { latitude, longitude } = airport.location;
          const radius = nauticalMilesToMetres(spec.radiusNm);

          return (
            <React.Fragment key={`${airport.id}-${spec.kind}`}>
              <LeafletCircle
                center={shiftPoint([latitude, longitude], offset)}
                radius={radius}
                pathOptions={{ ...(spec.kind === "rule" ? RULE_RING_STYLE : THRESHOLD_RING_STYLE), color }}
              />
              <Marker
                position={shiftPoint(destinationPoint(latitude, longitude, 0, radius), offset)}
                icon={ringTitleIcon(`${spec.title} (${airport.icaoCode})`)}
                interactive={false}
              />
            </React.Fragment>
          );
        }),
      )}
    </>
  );
}

function RouteLayer({
  briefing,
  airports,
  insights,
  runways,
  selectedOrdinal,
  onSelect,
  offset,
  showRings = true,
}: LayerProps) {
  const map = useMap();
  const { computedMode } = useThemeMode();
  const markerFill = fixMarkerFill(computedMode);
  const line = useMemo(() => routeLine(briefing, runways), [briefing, runways]);
  const track = useMemo(() => trackLine(flownTrack(briefing)), [briefing]);
  const marks = useMemo(() => routeFixMarks(insights, briefing.etops?.points ?? []), [insights, briefing]);
  const selected = insights.find((insight) => insight.fix.ordinal === selectedOrdinal) ?? null;
  const selectMark = (mark: RouteFixMark) => {
    if (mark.ordinal !== null) {
      onSelect(mark.ordinal);
    }
  };

  return (
    <>
      {showRings && <EtopsRings briefing={briefing} airports={airports} offset={offset} />}

      {track.length > 1 && (
        <Polyline
          pathOptions={TRACK_STYLE}
          positions={shiftPath(track, offset)}
          smoothFactor={ROUTE_LINE_SMOOTH_FACTOR}
        />
      )}

      {line.length > 1 && (
        <Polyline
          pathOptions={ROUTE_STYLE}
          positions={shiftPath(line, offset)}
          smoothFactor={ROUTE_LINE_SMOOTH_FACTOR}
        />
      )}

      {marks.map((mark) => (
        <Marker
          key={`label-${mark.key}`}
          position={shiftPoint(mark.position, offset)}
          icon={fixLabelIcon(mark)}
          keyboard={isSelectable(mark)}
          eventHandlers={{ click: () => selectMark(mark) }}
        />
      ))}

      {marks.map((mark) => (
        <CircleMarker
          key={mark.key}
          center={shiftPoint(mark.position, offset)}
          radius={2.5}
          interactive={false}
          pathOptions={{ color: RUNWAY_COLOR, weight: 1, fillColor: markerFill, fillOpacity: 1 }}
        />
      ))}

      {marks.map((mark) => (
        <CircleMarker
          key={`hit-${mark.key}`}
          center={shiftPoint(mark.position, offset)}
          radius={FIX_HIT_RADIUS}
          className={isSelectable(mark) ? undefined : PASSIVE_FIX_CLASS}
          pathOptions={{ stroke: false, fillOpacity: 0 }}
          eventHandlers={{
            click: () => selectMark(mark),
            mouseover: () => highlightFixLabel(map.getContainer(), mark.key, true),
            mouseout: () => highlightFixLabel(map.getContainer(), mark.key, false),
          }}
        />
      ))}

      {selected !== null && (
        <CircleMarker
          center={shiftPoint([selected.fix.latitude, selected.fix.longitude], offset)}
          radius={6}
          pathOptions={{ color: markerFill, weight: 2, fillColor: FLIGHT_COLOR, fillOpacity: 1 }}
        />
      )}
    </>
  );
}

export function RouteOverlay(props: Props) {
  return (
    <>
      {WORLD_COPIES.map((offset) => (
        <RouteLayer key={offset} {...props} offset={offset} />
      ))}
    </>
  );
}

export function PlannedRouteLayer({
  state,
  showRings = true,
}: {
  state: RouteBriefingState | null;
  showRings?: boolean;
}) {
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
      showRings={showRings}
    />
  );
}

export function PlannedEtopsRingsLayer({ state }: { state: RouteBriefingState | null }) {
  const briefing = state?.briefing ?? null;

  if (state === null || briefing === null) {
    return null;
  }

  return (
    <>
      {WORLD_COPIES.map((offset) => (
        <EtopsRings key={offset} briefing={briefing} airports={state.airports} offset={offset} />
      ))}
    </>
  );
}
