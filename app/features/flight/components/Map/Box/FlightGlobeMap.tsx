import { useThemeMode } from "flowbite-react";
import type { LatLngTuple } from "leaflet";
import { type ReactNode, useCallback, useMemo, useState } from "react";
import ReactDOMServer from "react-dom/server";
import { type MapSettings, useMapSettings } from "~/app-state/useMapSettings";
import type { Airport } from "~/features/airport";
import type { Diversion } from "~/features/diversion";
import type { Flight, FlightPathElement } from "~/features/flight";
import { AIRPORT_ZOOM } from "~/features/flight/components/Map/Element/MapEventsHandler";
import {
  aircraftGlobeMarker,
  aircraftLabelGlobeMarker,
  airportGlobeMarkers,
  airportLayoutGlobeMarkers,
} from "~/features/flight/components/Map/Globe/globeMarkers";
import {
  type AirportLayoutData,
  type AirportLayoutServices,
  useAirportLayoutData,
} from "~/features/flight/hooks/useAirportLayoutData";
import {
  pickGates,
  pickParkingPositions,
  pickRunways,
  pickTerminals,
} from "~/features/flight/lib/airportLayoutFilters";
import { type GlobeAirportScene, globeAirportOverlay, globeZoom } from "~/features/flight/lib/globeAirportOverlay";
import { directRouteOverlay, diversionOverlay, flightPathOverlay } from "~/features/flight/lib/globeTrackingOverlay";
import {
  fixGlobeMarkers,
  hoveredFixKey,
  ringTitleGlobeMarkers,
} from "~/features/route/components/Chart/routeGlobeMarkers";
import type { RouteBriefingState } from "~/features/route/hooks/useRouteBriefing";
import {
  FIX_TARGET_LAYER,
  globeEtopsRingLines,
  globeRouteFrame,
  globeRouteOverlay,
  globeRouteScene,
} from "~/features/route/lib/globeRouteOverlay";
import { emphasisOf, hasEtopsRings, hasFiledWaypoints } from "~/shared/lib/flightData";
import type { GlobeInsets } from "~/shared/lib/globeCamera";
import { type GlobeOverlay, mergeOverlays } from "~/shared/lib/globeStyle";
import type { MapCameraView } from "~/shared/lib/mapCameraView";
import { type GlobeCameraTarget, GlobeMap, type GlobeMarker } from "~/shared/ui/Globe/GlobeMap";
import type { GlobeScreenLine } from "~/shared/ui/Globe/screenLines";

type Props = {
  flight: Flight;
  diversion?: Diversion | null;
  flightPath: FlightPathElement[];
  plannedRoute?: RouteBriefingState | null;
  layoutServices: AirportLayoutServices;
  insets: GlobeInsets;
  initialView?: MapCameraView | null;
  onViewChange?: (view: MapCameraView) => void;
  aircraftLabel?: ReactNode;
};
const NO_OVERLAY: GlobeOverlay = { sources: {}, layers: [] };
const NO_SCREEN_LINES: GlobeScreenLine[] = [];

function airportPosition(airport: Airport): LatLngTuple {
  return [airport.location.latitude, airport.location.longitude];
}

function airportScene(
  airport: Airport,
  layout: AirportLayoutData,
  settings: MapSettings,
  assignedRunwayId: string | null,
  assignedParkingPositionId: string | null,
): GlobeAirportScene {
  return {
    airport,
    runways: pickRunways(layout.runways, assignedRunwayId, settings.runwayDisplay),
    assignedRunwayId,
    terminals: pickTerminals(
      layout.terminals,
      layout.parkingPositions,
      assignedParkingPositionId,
      settings.terminalDisplay,
    ),
    gates: pickGates(layout.gates, assignedParkingPositionId, settings.gateDisplay),
    parkingPositions: pickParkingPositions(
      layout.parkingPositions,
      assignedParkingPositionId,
      settings.parkingPositionDisplay,
    ),
    assignedParkingPositionId,
  };
}

function followTarget(
  settings: MapSettings,
  routePoints: LatLngTuple[],
  aircraft: FlightPathElement | undefined,
  departure: Airport,
  destination: Airport,
): GlobeCameraTarget | null {
  if (!settings.autoCenter) return null;

  switch (settings.centerOn) {
    case "route":
      return { key: "route", kind: "fit", points: routePoints };
    case "aircraft":
      return aircraft === undefined
        ? { key: "route", kind: "fit", points: routePoints }
        : { key: "aircraft", kind: "point", position: [aircraft.latitude, aircraft.longitude] };
    case "departure":
      return { key: "departure", kind: "point", position: airportPosition(departure), zoom: globeZoom(AIRPORT_ZOOM) };
    case "destination":
      return {
        key: "destination",
        kind: "point",
        position: airportPosition(destination),
        zoom: globeZoom(AIRPORT_ZOOM),
      };
  }
}

export function FlightGlobeMap({
  flight,
  diversion = null,
  flightPath,
  plannedRoute = null,
  layoutServices,
  insets,
  initialView = null,
  onViewChange,
  aircraftLabel,
}: Props) {
  const { computedMode } = useThemeMode();
  const { mapSettings, updateMapSettings, intent } = useMapSettings();
  const [hoveredFix, setHoveredFix] = useState<string | null>(null);
  const { departureAirport, destinationAirport } = flight;
  const diversionAirport = diversion?.airport ?? null;
  const departureLayout = useAirportLayoutData(departureAirport.id, layoutServices);
  const destinationLayout = useAirportLayoutData(destinationAirport.id, layoutServices);

  const briefing = plannedRoute?.briefing ?? null;
  const showsRoute = hasFiledWaypoints(briefing) && mapSettings.routeDisplay !== "hide";
  const showsEtopsRings = hasEtopsRings(briefing) && mapSettings.etopsDisplay !== "hide";
  const routeEmphasis = emphasisOf(mapSettings.routeDisplay);
  const ringsEmphasis = emphasisOf(mapSettings.etopsDisplay);
  const greatCircleDisplay = mapSettings.greatCircleDisplay;
  const routeAirports = plannedRoute?.airports;
  const insights = plannedRoute?.insights;
  const runways = plannedRoute?.runways;
  const selectedOrdinal = plannedRoute?.selectedOrdinal ?? null;
  const lastPoint = flightPath.at(-1);

  const scene = useMemo(() => {
    const needsScene = showsRoute || showsEtopsRings;
    if (!needsScene || briefing === null || routeAirports === undefined || insights === undefined || !runways) {
      return null;
    }

    return globeRouteScene({ briefing, airports: routeAirports, insights, runways, selectedOrdinal });
  }, [showsRoute, showsEtopsRings, briefing, routeAirports, insights, runways, selectedOrdinal]);

  const airportScenes = useMemo(
    () => [
      airportScene(
        departureAirport,
        departureLayout,
        mapSettings,
        flight.departureRunwayId,
        flight.departureParkingPositionId,
      ),
      airportScene(
        destinationAirport,
        destinationLayout,
        mapSettings,
        flight.arrivalRunwayId,
        flight.arrivalParkingPositionId,
      ),
    ],
    [flight, departureAirport, destinationAirport, departureLayout, destinationLayout, mapSettings],
  );

  const overlay = useMemo(
    () =>
      mergeOverlays(
        globeAirportOverlay(airportScenes, computedMode),
        greatCircleDisplay === "hide"
          ? NO_OVERLAY
          : directRouteOverlay(departureAirport, destinationAirport, emphasisOf(greatCircleDisplay)),
        scene === null || !showsRoute ? NO_OVERLAY : globeRouteOverlay(scene, computedMode, routeEmphasis),
        diversionAirport === null ? NO_OVERLAY : diversionOverlay(departureAirport, diversionAirport),
        flightPathOverlay(flightPath),
      ),
    [
      airportScenes,
      greatCircleDisplay,
      scene,
      showsRoute,
      routeEmphasis,
      computedMode,
      departureAirport,
      destinationAirport,
      diversionAirport,
      flightPath,
    ],
  );

  const screenLines = useMemo(
    () =>
      scene === null || !showsEtopsRings ? NO_SCREEN_LINES : globeEtopsRingLines(scene, computedMode, ringsEmphasis),
    [scene, showsEtopsRings, computedMode, ringsEmphasis],
  );

  const aircraftLabelHtml = useMemo(
    () => (aircraftLabel === undefined ? null : ReactDOMServer.renderToString(aircraftLabel)),
    [aircraftLabel],
  );

  const markers = useMemo(() => {
    const aircraft = aircraftGlobeMarker(flightPath);
    const label = aircraftLabelHtml === null ? null : aircraftLabelGlobeMarker(flightPath, aircraftLabelHtml);

    return [
      ...airportLayoutGlobeMarkers(airportScenes),
      ...airportGlobeMarkers(departureAirport),
      ...airportGlobeMarkers(destinationAirport),
      ...(diversionAirport === null ? [] : airportGlobeMarkers(diversionAirport, "diversion")),
      ...(showsRoute && scene !== null ? fixGlobeMarkers(scene, routeEmphasis, hoveredFix) : []),
      ...(showsEtopsRings && scene !== null ? ringTitleGlobeMarkers(scene, ringsEmphasis) : []),
      ...(aircraft === null ? [] : [aircraft]),
      ...(label === null ? [] : [label]),
    ] satisfies GlobeMarker[];
  }, [
    airportScenes,
    departureAirport,
    destinationAirport,
    diversionAirport,
    scene,
    showsRoute,
    showsEtopsRings,
    routeEmphasis,
    ringsEmphasis,
    flightPath,
    aircraftLabelHtml,
    hoveredFix,
  ]);

  const routePoints = useMemo(
    (): LatLngTuple[] => [
      airportPosition(departureAirport),
      airportPosition(destinationAirport),
      ...(diversionAirport === null ? [] : [airportPosition(diversionAirport)]),
      ...(scene === null || !showsRoute ? [] : globeRouteFrame(scene)),
      ...(lastPoint === undefined ? [] : [[lastPoint.latitude, lastPoint.longitude] satisfies LatLngTuple]),
    ],
    [departureAirport, destinationAirport, diversionAirport, scene, showsRoute, lastPoint],
  );

  const target = useMemo(
    () => followTarget(mapSettings, routePoints, lastPoint, departureAirport, destinationAirport),
    [mapSettings, routePoints, lastPoint, departureAirport, destinationAirport],
  );
  const initialTarget = useMemo(
    (): GlobeCameraTarget => ({ key: "route", kind: "fit", points: routePoints }),
    [routePoints],
  );

  const stopFollowing = useCallback(() => {
    if (!mapSettings.autoCenter) return;
    updateMapSettings({ ...mapSettings, mode: intent === null ? mapSettings.mode : "manual", autoCenter: false });
  }, [mapSettings, updateMapSettings, intent]);

  return (
    <GlobeMap
      overlay={overlay}
      target={target}
      initialTarget={initialTarget}
      clickableLayer={FIX_TARGET_LAYER}
      onFeatureHover={(properties) => setHoveredFix(hoveredFixKey(properties))}
      insets={insets}
      markers={markers}
      screenLines={screenLines}
      onUserPan={stopFollowing}
      initialView={initialView}
      onViewChange={onViewChange}
    />
  );
}
