"use client";

import { LatLngBounds } from "leaflet";
import { useMap } from "react-leaflet";
import { useCallback, useEffect, useRef } from "react";

type MapEventsHandlerProps = {
  bounds: LatLngBounds;
};

export default function MapEventsHandler({ bounds }: MapEventsHandlerProps) {
  const map = useMap();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const resetView = useCallback(() => {
    if (bounds.isValid()) {
      map.flyToBounds(bounds, {
        paddingTopLeft: [0, 70],
        paddingBottomRight: [0, 0],
        duration: 1,
      });
    }
  }, [map, bounds]);

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
