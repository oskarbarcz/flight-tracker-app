import type { FitBoundsOptions, LatLngBounds } from "leaflet";
import { useCallback, useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import { useMapSettings } from "~/app-state/useMapSettings";
import type { FlightPathElement } from "~/features/flight";
import { prefersReducedMotion } from "~/shared/lib/reducedMotion";
import type { Position } from "~/shared/models/geo";

type MapEventsHandlerProps = {
  bounds: LatLngBounds;
  aircraftPosition?: FlightPathElement;
  departurePosition: Position;
  destinationPosition: Position;
  options?: FitBoundsOptions;
};

const AIRPORT_ZOOM = 13;

export function MapEventsHandler({
  bounds,
  aircraftPosition,
  departurePosition,
  destinationPosition,
  options,
}: MapEventsHandlerProps) {
  const map = useMap();
  const { mapSettings } = useMapSettings();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const resetView = useCallback(() => {
    if (!mapSettings.autoCenter) return;

    const motion = { ...options, animate: !prefersReducedMotion() };

    if (mapSettings.centerOn === "aircraft" && aircraftPosition) {
      const lastPosition: Position = [aircraftPosition.latitude, aircraftPosition.longitude];
      map.flyTo(lastPosition, map.getZoom(), motion);
    } else if (mapSettings.centerOn === "route") {
      map.flyToBounds(bounds, motion);
    } else if (mapSettings.centerOn === "departure") {
      map.flyTo(departurePosition, AIRPORT_ZOOM, motion);
    } else if (mapSettings.centerOn === "destination") {
      map.flyTo(destinationPosition, AIRPORT_ZOOM, motion);
    }
  }, [aircraftPosition, mapSettings, bounds, departurePosition, destinationPosition, map, options]);

  const startTimeout = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(resetView, 7500);
  }, [resetView]);

  useEffect(() => {
    resetView();
  }, [resetView]);

  useEffect(() => {
    if (!mapSettings.autoCenter) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      return;
    }

    startTimeout();

    const resetTimerEvents = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };

    map.on("dragstart zoomstart", resetTimerEvents);
    map.on("dragend zoomend", startTimeout);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      map.off("dragstart zoomstart", resetTimerEvents);
      map.off("dragend zoomend", startTimeout);
    };
  }, [map, startTimeout, mapSettings.autoCenter]);

  return null;
}
