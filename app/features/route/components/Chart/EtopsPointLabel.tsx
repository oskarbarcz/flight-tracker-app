import ReactDOMServer from "react-dom/server";
import { twMerge } from "tailwind-merge";
import { translateEtopsPointKindShort } from "~/features/route/i18n";
import type { GlobeRouteScene } from "~/features/route/lib/globeRouteOverlay";
import { type EtopsPoint, EtopsPointKind } from "~/features/route/model";
import type { GlobeMarker } from "~/shared/ui/Globe/GlobeMap";

const LABEL_LANE: Record<EtopsPointKind, number> = {
  [EtopsPointKind.Entry]: 18,
  [EtopsPointKind.Exit]: -20,
  [EtopsPointKind.EqualTime]: 38,
  [EtopsPointKind.Critical]: -40,
};

export function etopsLabelOffset(point: EtopsPoint): number {
  const lane = LABEL_LANE[point.kind];

  return lane + (point.ordinal - 1) * (lane >= 0 ? 18 : -18);
}

export function EtopsPointLabel({ point }: { point: EtopsPoint }) {
  return (
    <div className={twMerge("map-etops-label", point.isCritical && "map-etops-label--critical")}>
      <span className="map-etops-label__kind">{translateEtopsPointKindShort(point.kind)}</span>
    </div>
  );
}

export function etopsGlobeMarker(point: EtopsPoint, emphasis = 1): GlobeMarker {
  return {
    id: `etops-${point.kind}-${point.ordinal}`,
    position: [point.position.latitude, point.position.longitude],
    html: ReactDOMServer.renderToString(
      <div style={{ opacity: emphasis }}>
        <EtopsPointLabel point={point} />
      </div>,
    ),
    lift: etopsLabelOffset(point),
  };
}

export function fixGlobeMarkers(
  scene: GlobeRouteScene,
  emphasis = 1,
  highlightedOrdinal: number | null = null,
): GlobeMarker[] {
  return scene.fixes.map((fix) => ({
    id: `fix-${fix.ordinal}`,
    position: fix.position,
    html: ReactDOMServer.renderToString(
      <div style={{ opacity: emphasis }}>
        <span className={twMerge("map-fix-label", fix.ordinal === highlightedOrdinal && "map-fix-label--active")}>
          {fix.ident}
        </span>
      </div>,
    ),
  }));
}

export function hoveredFixOrdinal(properties: Record<string, unknown> | null): number | null {
  const ordinal = properties?.ordinal;
  return typeof ordinal === "number" ? ordinal : null;
}

export function ringTitleGlobeMarkers(scene: GlobeRouteScene, emphasis = 1): GlobeMarker[] {
  return scene.ringTitles.map((ring) => ({
    id: `ring-${ring.key}`,
    position: ring.position,
    html: ReactDOMServer.renderToString(
      <div style={{ opacity: emphasis }}>
        <span className="map-ring-label">{ring.title}</span>
      </div>,
    ),
  }));
}
