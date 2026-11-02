import { useThemeMode } from "flowbite-react";
import type { LatLngTuple } from "leaflet";
import { useMemo, useState } from "react";
import type { Flight } from "~/features/flight";
import { airportGlobeMarkers } from "~/features/flight/components/Map/Globe/globeMarkers";
import {
  fixGlobeMarkers,
  hoveredFixKey,
  ringTitleGlobeMarkers,
  selectableFixOrdinal,
} from "~/features/route/components/Chart/routeGlobeMarkers";
import type { RouteBriefingState } from "~/features/route/hooks/useRouteBriefing";
import {
  FIX_TARGET_LAYER,
  globeEtopsRingLines,
  globeRouteFrame,
  globeRouteOverlay,
  globeRouteScene,
} from "~/features/route/lib/globeRouteOverlay";
import type { EtopsBriefing } from "~/features/route/model";
import type { GlobeInsets } from "~/shared/lib/globeCamera";
import type { MapCameraView } from "~/shared/lib/mapCameraView";
import { type GlobeCameraTarget, GlobeMap } from "~/shared/ui/Globe/GlobeMap";

type Props = {
  flight: Flight;
  briefing: EtopsBriefing;
  state: RouteBriefingState;
  initialView: MapCameraView | null;
  onViewChange: (view: MapCameraView) => void;
};

const CHART_INSETS: GlobeInsets = { top: 41, bottom: 0 };

export function GlobeRouteMap({ flight, briefing, state, initialView, onViewChange }: Props) {
  const { computedMode } = useThemeMode();
  const { airports, insights, runways, selectedOrdinal, select } = state;
  const { departureAirport, destinationAirport } = flight;
  const [hoveredFix, setHoveredFix] = useState<string | null>(null);

  const scene = useMemo(
    () => globeRouteScene({ briefing, airports, insights, runways, selectedOrdinal }),
    [briefing, airports, insights, runways, selectedOrdinal],
  );
  const overlay = useMemo(() => globeRouteOverlay(scene, computedMode), [scene, computedMode]);
  const screenLines = useMemo(() => globeEtopsRingLines(scene, computedMode), [scene, computedMode]);
  const target = useMemo(
    (): GlobeCameraTarget => ({
      key: "route",
      kind: "fit",
      points: [
        [departureAirport.location.latitude, departureAirport.location.longitude] satisfies LatLngTuple,
        [destinationAirport.location.latitude, destinationAirport.location.longitude] satisfies LatLngTuple,
        ...globeRouteFrame(scene),
      ],
    }),
    [departureAirport, destinationAirport, scene],
  );
  const markers = useMemo(
    () => [
      ...airportGlobeMarkers(departureAirport),
      ...airportGlobeMarkers(destinationAirport),
      ...fixGlobeMarkers(scene, 1, hoveredFix),
      ...ringTitleGlobeMarkers(scene),
    ],
    [departureAirport, destinationAirport, scene, hoveredFix],
  );

  return (
    <GlobeMap
      overlay={overlay}
      target={target}
      insets={CHART_INSETS}
      markers={markers}
      screenLines={screenLines}
      clickableLayer={FIX_TARGET_LAYER}
      onFeatureHover={(properties) => setHoveredFix(hoveredFixKey(properties))}
      initialView={initialView}
      onViewChange={onViewChange}
      isFeatureClickable={(properties) => selectableFixOrdinal(properties) !== null}
      onFeatureClick={(properties) => {
        const ordinal = selectableFixOrdinal(properties);
        if (ordinal !== null) {
          select(ordinal);
        }
      }}
    />
  );
}
