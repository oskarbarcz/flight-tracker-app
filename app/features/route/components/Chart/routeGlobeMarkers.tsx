import ReactDOMServer from "react-dom/server";
import { twMerge } from "tailwind-merge";
import type { GlobeRouteScene } from "~/features/route/lib/globeRouteOverlay";
import { fixLabelClassName } from "~/features/route/lib/routeFixMarks";
import type { GlobeMarker } from "~/shared/ui/Globe/GlobeMap";

export function fixGlobeMarkers(
  scene: GlobeRouteScene,
  emphasis = 1,
  highlightedKey: string | null = null,
): GlobeMarker[] {
  return scene.fixes.map((fix) => ({
    id: fix.key,
    position: fix.position,
    html: ReactDOMServer.renderToString(
      <div style={{ opacity: emphasis }}>
        <span className={twMerge(fixLabelClassName(fix), fix.key === highlightedKey && "map-fix-label--active")}>
          {fix.name}
        </span>
      </div>,
    ),
  }));
}

export function hoveredFixKey(properties: Record<string, unknown> | null): string | null {
  const key = properties?.key;
  return typeof key === "string" ? key : null;
}

export function selectableFixOrdinal(properties: Record<string, unknown> | null): number | null {
  const ordinal = properties?.ordinal;
  return typeof ordinal === "number" ? ordinal : null;
}

export function ringTitleGlobeMarkers(scene: GlobeRouteScene, emphasis = 1): GlobeMarker[] {
  return scene.rings.map((ring) => ({
    id: `ring-${ring.key}`,
    position: ring.titlePosition,
    html: ReactDOMServer.renderToString(
      <div style={{ opacity: emphasis }}>
        <span className="map-ring-label">{ring.title}</span>
      </div>,
    ),
  }));
}
