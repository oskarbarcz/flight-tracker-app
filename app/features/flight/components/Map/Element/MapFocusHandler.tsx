import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import type { MapFocus } from "~/shared/lib/mapFocus";
import { prefersReducedMotion } from "~/shared/lib/reducedMotion";
import { alignLongitude } from "~/shared/lib/worldCopies";

const GLIDE_SECONDS = 0.9;

export function MapFocusHandler({ focus }: { focus: MapFocus | null }) {
  const map = useMap();
  const handled = useRef(focus);

  useEffect(() => {
    if (focus === null || focus === handled.current) {
      return;
    }

    handled.current = focus;

    const { insets } = focus;
    const position = alignLongitude(focus.position, map.getCenter().lng);
    const zoom = Math.max(map.getZoom(), focus.zoom ?? 0);
    const center = map.project(position, zoom).add([insets.right / 2, (insets.bottom - insets.top) / 2]);

    map.flyTo(map.unproject(center, zoom), zoom, { animate: !prefersReducedMotion(), duration: GLIDE_SECONDS });
  }, [map, focus]);

  return null;
}
