import { type FitBoundsOptions, type LatLngBounds, point } from "leaflet";
import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import { type MapSettings, useMapSettings } from "~/app-state/useMapSettings";
import type { FlightPathElement } from "~/features/flight";
import { useMapWheelZoom } from "~/features/flight/hooks/useMapWheelZoom";
import { prefersReducedMotion } from "~/shared/lib/reducedMotion";
import type { Position } from "~/shared/models/geo";

type MapEventsHandlerProps = {
  bounds: LatLngBounds;
  aircraftPosition?: FlightPathElement;
  departurePosition: Position;
  destinationPosition: Position;
  options?: FitBoundsOptions;
  topInset?: number;
  initialZoom?: number | null;
};

type CenterTarget = MapSettings["centerOn"] | null;

export const AIRPORT_ZOOM = 13;
const PAN_KEYS = new Set(["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"]);
const ZOOM_KEYS = new Set(["+", "-", "=", "_"]);

export function MapEventsHandler({
  bounds,
  aircraftPosition,
  departurePosition,
  destinationPosition,
  options,
  topInset = 0,
  initialZoom = null,
}: MapEventsHandlerProps) {
  const map = useMap();
  const { mapSettings, updateMapSettings, intent } = useMapSettings();
  const lastTarget = useRef<CenterTarget | undefined>(undefined);
  const chosenZoom = useRef<number | null>(initialZoom);
  const latest = useRef({ mapSettings, updateMapSettings, intent, topInset });

  useLayoutEffect(() => {
    latest.current = { mapSettings, updateMapSettings, intent, topInset };
  }, [mapSettings, updateMapSettings, intent, topInset]);

  const resetView = useCallback(
    (animate: boolean) => {
      if (!mapSettings.autoCenter) return;

      const motion = { ...options, animate: animate && !prefersReducedMotion() };
      const inset = Math.min(topInset, map.getSize().y / 2);
      const flyBelowInset = (position: Position, zoom: number) => {
        map.flyTo(map.unproject(map.project(position, zoom).subtract([0, inset / 2]), zoom), zoom, motion);
      };

      if (mapSettings.centerOn === "aircraft" && aircraftPosition) {
        flyBelowInset([aircraftPosition.latitude, aircraftPosition.longitude], map.getZoom());
      } else if (mapSettings.centerOn === "route") {
        if (chosenZoom.current === null) {
          map.flyToBounds(bounds, {
            ...motion,
            paddingTopLeft: point(options?.paddingTopLeft ?? options?.padding ?? [0, 0]).add([0, inset]),
          });
        } else {
          flyBelowInset(bounds.getCenter(), chosenZoom.current);
        }
      } else if (mapSettings.centerOn === "departure") {
        flyBelowInset(departurePosition, chosenZoom.current ?? AIRPORT_ZOOM);
      } else if (mapSettings.centerOn === "destination") {
        flyBelowInset(destinationPosition, chosenZoom.current ?? AIRPORT_ZOOM);
      }
    },
    [aircraftPosition, mapSettings, bounds, departurePosition, destinationPosition, map, options, topInset],
  );

  useEffect(() => {
    const target: CenterTarget = mapSettings.autoCenter ? mapSettings.centerOn : null;
    const previous = lastTarget.current;
    lastTarget.current = target;

    if (previous !== undefined && previous !== target) {
      chosenZoom.current = null;
    }

    const isFirstView = previous === undefined;
    const followsAircraft = previous === "aircraft" && target === "aircraft";
    resetView(!isFirstView && (previous !== target || followsAircraft));
  }, [resetView, mapSettings.autoCenter, mapSettings.centerOn]);

  useEffect(() => {
    const container = map.getContainer();

    const stopFollowing = () => {
      const { mapSettings: current, updateMapSettings: update, intent: phaseIntent } = latest.current;
      if (!current.autoCenter) return;
      update({ ...current, mode: phaseIntent === null ? current.mode : "manual", autoCenter: false });
    };
    let zoomedByUser = false;
    const markUserZoom = () => {
      zoomedByUser = true;
    };
    const onTouchStart = (event: TouchEvent) => {
      if (event.touches.length > 1) markUserZoom();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (PAN_KEYS.has(event.key)) stopFollowing();
      if (ZOOM_KEYS.has(event.key)) markUserZoom();
    };
    const rememberUserZoom = () => {
      if (!zoomedByUser) return;
      zoomedByUser = false;
      chosenZoom.current = map.getZoom();
    };

    map.on("dragstart", stopFollowing);
    map.on("zoomend", rememberUserZoom);
    container.addEventListener("keydown", onKeyDown);
    container.addEventListener("dblclick", markUserZoom);
    container.addEventListener("touchstart", onTouchStart, { passive: true });

    return () => {
      map.off("dragstart", stopFollowing);
      map.off("zoomend", rememberUserZoom);
      container.removeEventListener("keydown", onKeyDown);
      container.removeEventListener("dblclick", markUserZoom);
      container.removeEventListener("touchstart", onTouchStart);
    };
  }, [map]);

  useMapWheelZoom(map, {
    around: () => {
      if (!latest.current.mapSettings.autoCenter) return null;

      const size = map.getSize();
      const inset = Math.min(latest.current.topInset, size.y / 2);
      return point(size.x / 2, inset + (size.y - inset) / 2);
    },
    onZoom: (zoom) => {
      if (latest.current.mapSettings.autoCenter) chosenZoom.current = zoom;
    },
  });

  return null;
}
