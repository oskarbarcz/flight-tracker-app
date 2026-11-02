import type L from "leaflet";
import { useEffect, useLayoutEffect, useRef } from "react";
import {
  WHEEL_GLIDE_MS,
  type WheelKind,
  wheelGlide,
  wheelKind,
  wheelPixels,
  wheelZoomChange,
} from "~/shared/lib/wheelZoom";

type WheelZoomOptions = {
  around?: () => L.Point | null;
  onZoom?: (zoom: number) => void;
};

type Glide = {
  from: number;
  to: number;
  startedAt: number;
  around: L.Point;
};

export function useMapWheelZoom(map: L.Map, options: WheelZoomOptions = {}) {
  const latest = useRef(options);

  useLayoutEffect(() => {
    latest.current = options;
  });

  useEffect(() => {
    const container = map.getContainer();
    let pendingPixels = 0;
    let kind: WheelKind | null = null;
    let lastEventAt = Number.NEGATIVE_INFINITY;
    let cursor = map.getSize().divideBy(2);
    let glide: Glide | null = null;
    let frame = 0;

    const anchor = () => latest.current.around?.() ?? cursor;

    const zoomTo = (zoom: number, around: L.Point) => {
      const limited = Math.min(map.getMaxZoom(), Math.max(map.getMinZoom(), zoom));
      if (limited === map.getZoom()) return;

      map.setZoomAround(around, limited, { animate: false });
      latest.current.onZoom?.(limited);
    };

    const step = (now: number) => {
      frame = 0;

      if (pendingPixels !== 0) {
        const target = (glide?.to ?? map.getZoom()) + wheelZoomChange(pendingPixels, kind ?? "trackpad");
        pendingPixels = 0;

        if (kind === "wheel") {
          glide = { from: map.getZoom(), to: target, startedAt: now, around: anchor() };
        } else {
          glide = null;
          zoomTo(target, anchor());
        }
      }

      if (glide !== null) {
        const progress = Math.min((now - glide.startedAt) / WHEEL_GLIDE_MS, 1);
        zoomTo(glide.from + (glide.to - glide.from) * wheelGlide(progress), glide.around);

        if (progress < 1) {
          frame = window.requestAnimationFrame(step);
        } else {
          glide = null;
        }
      }
    };

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      const pixels = wheelPixels(event);
      if (pixels === 0) return;

      const now = performance.now();
      kind = wheelKind(pixels, now - lastEventAt, kind);
      lastEventAt = now;
      cursor = map.mouseEventToContainerPoint(event);
      pendingPixels += pixels;

      if (frame === 0) frame = window.requestAnimationFrame(step);
    };

    map.scrollWheelZoom.disable();
    container.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      window.cancelAnimationFrame(frame);
      container.removeEventListener("wheel", onWheel);
    };
  }, [map]);
}
