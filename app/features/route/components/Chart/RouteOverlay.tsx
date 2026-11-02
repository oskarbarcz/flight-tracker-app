import { useThemeMode } from "flowbite-react";
import L from "leaflet";
import React, { useMemo } from "react";
import ReactDOMServer from "react-dom/server";
import { CircleMarker, Circle as LeafletCircle, Marker, Polyline, useMap } from "react-leaflet";
import type { Airport } from "~/features/airport/model";
import { EtopsPointLabel, etopsLabelOffset } from "~/features/route/components/Chart/EtopsPointLabel";
import type { RouteBriefingState } from "~/features/route/hooks/useRouteBriefing";
import { etopsPointColor, fixMarkerFill } from "~/features/route/lib/chartColors";
import { etopsRingSpecs } from "~/features/route/lib/etopsRings";
import { nauticalMilesToMetres } from "~/features/route/lib/routeFigures";
import { flownTrack, routeLine, trackLine } from "~/features/route/lib/routeGeometry";
import type { FixInsight } from "~/features/route/lib/routeInsights";
import type { EtopsBriefing, EtopsPoint } from "~/features/route/model";
import type { AssignedRunways } from "~/features/runway/hooks/useAssignedRunways";
import { destinationPoint } from "~/features/runway/lib/runwayPairs";
import { escapeHtml } from "~/shared/lib/escapeHtml";
import { ROUTE_LINE_SMOOTH_FACTOR } from "~/shared/lib/greatCircle";
import { FLIGHT_COLOR, RUNWAY_COLOR } from "~/shared/lib/mapColors";
import { shiftPath, shiftPoint, WORLD_COPIES } from "~/shared/lib/worldCopies";

const ROUTE_STYLE = { color: FLIGHT_COLOR, weight: 2.5, opacity: 0.9 };
const TRACK_STYLE = { color: RUNWAY_COLOR, weight: 2.5, opacity: 0.85, dashArray: "2 8" };
const RULE_RING_STYLE = { color: RUNWAY_COLOR, weight: 1, opacity: 0.5, fill: false };
const THRESHOLD_RING_STYLE = { color: RUNWAY_COLOR, weight: 1, opacity: 0.35, fill: false, dashArray: "3 5" };

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

function fixLabelIcon(ident: string, ordinal: number) {
  return new L.DivIcon({
    html: `<span class="map-fix-label" data-fix="${ordinal}">${escapeHtml(ident)}</span>`,
    className: "map-marker",
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
}

const FIX_HIT_RADIUS = 9;

function highlightFixLabel(container: HTMLElement, ordinal: number, active: boolean) {
  for (const label of container.querySelectorAll(`.map-fix-label[data-fix="${ordinal}"]`)) {
    label.classList.toggle("map-fix-label--active", active);
  }
}

function EtopsRings({ briefing, airports, offset }: RingsProps) {
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
                pathOptions={spec.kind === "rule" ? RULE_RING_STYLE : THRESHOLD_RING_STYLE}
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

function etopsPointIcon(point: EtopsPoint) {
  return new L.DivIcon({
    html: ReactDOMServer.renderToString(<EtopsPointLabel point={point} />),
    className: "map-marker",
    iconSize: [0, 0],
    iconAnchor: [0, etopsLabelOffset(point)],
  });
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
  const pointColor = etopsPointColor(computedMode);
  const markerFill = fixMarkerFill(computedMode);
  const plan = briefing.etops;
  const line = useMemo(() => routeLine(briefing, runways), [briefing, runways]);
  const track = useMemo(() => trackLine(flownTrack(briefing)), [briefing]);
  const selected = insights.find((insight) => insight.fix.ordinal === selectedOrdinal) ?? null;

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

      {insights.map(({ fix }) => (
        <Marker
          key={`label-${fix.ordinal}`}
          position={shiftPoint([fix.latitude, fix.longitude], offset)}
          icon={fixLabelIcon(fix.ident, fix.ordinal)}
          eventHandlers={{ click: () => onSelect(fix.ordinal) }}
        />
      ))}

      {insights.map(({ fix }) => (
        <CircleMarker
          key={fix.ordinal}
          center={shiftPoint([fix.latitude, fix.longitude], offset)}
          radius={2.5}
          interactive={false}
          pathOptions={{ color: RUNWAY_COLOR, weight: 1, fillColor: markerFill, fillOpacity: 1 }}
        />
      ))}

      {insights.map(({ fix }) => (
        <CircleMarker
          key={`hit-${fix.ordinal}`}
          center={shiftPoint([fix.latitude, fix.longitude], offset)}
          radius={FIX_HIT_RADIUS}
          pathOptions={{ stroke: false, fillOpacity: 0 }}
          eventHandlers={{
            click: () => onSelect(fix.ordinal),
            mouseover: () => highlightFixLabel(map.getContainer(), fix.ordinal, true),
            mouseout: () => highlightFixLabel(map.getContainer(), fix.ordinal, false),
          }}
        />
      ))}

      {(plan?.points ?? []).map((point) => (
        <React.Fragment key={`${point.kind}-${point.ordinal}`}>
          <CircleMarker
            center={shiftPoint([point.position.latitude, point.position.longitude], offset)}
            radius={point.isCritical ? 3.5 : 3}
            interactive={false}
            pathOptions={{
              color: pointColor,
              weight: 1.25,
              fillColor: point.isCritical ? pointColor : markerFill,
              fillOpacity: 1,
            }}
          />
          <Marker
            position={shiftPoint([point.position.latitude, point.position.longitude], offset)}
            icon={etopsPointIcon(point)}
            zIndexOffset={900}
          />
        </React.Fragment>
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
