"use client";

import { FitBoundsOptions, LatLngBounds } from "leaflet";
import { useMap } from "react-leaflet";
import { useCallback, useEffect, useRef } from "react";

type MapEventsHandlerProps = {
  bounds: LatLngBounds;
  options?: FitBoundsOptions;
};

export default function MapEventsHandler({
  bounds,
  options,
}: MapEventsHandlerProps) {
  const map = useMap();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const resetView = useCallback(() => {
    if (bounds.isValid()) {
      map.flyToBounds(bounds, options);
    }
  }, [bounds, map, options]);

  const startTimeout = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(resetView, 7500);
  }, [resetView]);

  useEffect(() => {
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
  }, [map, startTimeout]);

  return null;
}
