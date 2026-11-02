import type { LatLngTuple } from "leaflet";
import { useMemo } from "react";
import ReactDOMServer from "react-dom/server";
import type { Airport } from "~/features/airport";
import { airportGlobeMarkers } from "~/features/flight/components/Map/Globe/globeMarkers";
import type { LegPath } from "~/features/rotation/lib";
import type { GlobeInsets } from "~/shared/lib/globeCamera";
import { type GlobeOverlay, lineSource } from "~/shared/lib/globeStyle";
import type { MapCameraView } from "~/shared/lib/mapCameraView";
import { FLIGHT_COLOR } from "~/shared/lib/mapColors";
import { type GlobeCameraTarget, GlobeMap, type GlobeMarker } from "~/shared/ui/Globe/GlobeMap";

type Props = {
  legPaths: LegPath[];
  airports: Airport[];
  insets: GlobeInsets;
  initialView: MapCameraView | null;
  onViewChange: (view: MapCameraView) => void;
};

function LegNumber({ order }: { order: number }) {
  return (
    <span className="flex size-[22px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-indigo-500 text-[11px] font-bold text-white">
      {order}
    </span>
  );
}

export function RotationGlobeMap({ legPaths, airports, insets, initialView, onViewChange }: Props) {
  const overlay = useMemo(
    (): GlobeOverlay => ({
      sources: { "rotation-legs": lineSource(legPaths.map((leg) => ({ path: leg.positions }))) },
      layers: [
        {
          id: "rotation-legs",
          type: "line",
          source: "rotation-legs",
          paint: { "line-color": FLIGHT_COLOR, "line-width": 2, "line-opacity": 0.85, "line-dasharray": [3, 3] },
        },
      ],
    }),
    [legPaths],
  );

  const markers = useMemo(
    () =>
      [
        ...legPaths.map((leg, index) => ({
          id: `leg-${leg.id}`,
          position: leg.midpoint,
          html: ReactDOMServer.renderToString(<LegNumber order={index + 1} />),
          layer: 4,
        })),
        ...airports.flatMap((airport) => airportGlobeMarkers(airport)),
      ] satisfies GlobeMarker[],
    [legPaths, airports],
  );

  const initialTarget = useMemo(
    (): GlobeCameraTarget => ({
      key: "rotation",
      kind: "fit",
      points: legPaths.flatMap((leg): LatLngTuple[] => leg.positions),
    }),
    [legPaths],
  );

  return (
    <GlobeMap
      overlay={overlay}
      target={null}
      initialTarget={initialTarget}
      insets={insets}
      markers={markers}
      initialView={initialView}
      onViewChange={onViewChange}
    />
  );
}
