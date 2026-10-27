import { type FitBoundsOptions, type LatLngBounds, point } from "leaflet";
import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import { type MapSettings, useMapSettings } from "~/app-state/useMapSettings";
import type { FlightPathElement } from "~/features/flight";
import { prefersReducedMotion } from "~/shared/lib/reducedMotion";
import type { Position } from "~/shared/models/geo";

type MapEventsHandlerProps = {
  bounds: LatLngBounds;
  aircraftPosition?: FlightPathElement;
  departurePosition: Position;
  destinationPosition: Position;
  options?: FitBoundsOptions;
  topInset?: number;
};

type CenterTarget = MapSettings["centerOn"] | null;

const AIRPORT_ZOOM = 13;
const RETURN_AFTER_INTERACTION_MS = 7500;
const USER_INPUT_EVENTS = ["pointerdown", "wheel", "keydown"] as const;

export function MapEventsHandler({
  bounds,
  aircraftPosition,
  departurePosition,
  destinationPosition,
  options,
  topInset = 0,
}: MapEventsHandlerProps) {
  const map = useMap();
  const { mapSettings } = useMapSettings();
  const lastTarget = useRef<CenterTarget | undefined>(undefined);
  const isHeldByUser = useRef(false);
  const latestResetView = useRef<(animate: boolean) => void>(() => {});

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
        map.flyToBounds(bounds, {
          ...motion,
          paddingTopLeft: point(options?.paddingTopLeft ?? options?.padding ?? [0, 0]).add([0, inset]),
        });
      } else if (mapSettings.centerOn === "departure") {
        flyBelowInset(departurePosition, AIRPORT_ZOOM);
      } else if (mapSettings.centerOn === "destination") {
        flyBelowInset(destinationPosition, AIRPORT_ZOOM);
      }
    },
    [aircraftPosition, mapSettings, bounds, departurePosition, destinationPosition, map, options, topInset],
  );

  useLayoutEffect(() => {
    latestResetView.current = resetView;
  }, [resetView]);

  useEffect(() => {
    const target: CenterTarget = mapSettings.autoCenter ? mapSettings.centerOn : null;
    const previous = lastTarget.current;
    lastTarget.current = target;

    if (isHeldByUser.current) return;

    const isFirstView = previous === undefined;
    const followsAircraft = previous === "aircraft" && target === "aircraft";
    resetView(!isFirstView && (previous !== target || followsAircraft));
  }, [resetView, mapSettings.autoCenter, mapSettings.centerOn]);

  useEffect(() => {
    const container = map.getContainer();
    let returnTimer: ReturnType<typeof setTimeout> | undefined;

    const hold = () => {
      isHeldByUser.current = true;
      clearTimeout(returnTimer);
      returnTimer = setTimeout(() => {
        isHeldByUser.current = false;
        latestResetView.current(true);
      }, RETURN_AFTER_INTERACTION_MS);
    };

    for (const event of USER_INPUT_EVENTS) {
      container.addEventListener(event, hold, { passive: true });
    }

    return () => {
      clearTimeout(returnTimer);
      isHeldByUser.current = false;
      for (const event of USER_INPUT_EVENTS) {
        container.removeEventListener(event, hold);
      }
    };
  }, [map]);

  return null;
}
