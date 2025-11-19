"use client";

import { FitBoundsOptions, LatLngBounds } from "leaflet";
import { useCallback, useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import { FlightPathElement, Position } from "~/models";
import { useMapSettings } from "~/state/contexts/settings/map-settings.context";

type MapEventsHandlerProps = {
  bounds: LatLngBounds;
  aircraftPosition?: FlightPathElement;
  options?: FitBoundsOptions;
};

export default function MapEventsHandler({
  bounds,
  aircraftPosition,
  options,
}: MapEventsHandlerProps) {
  const map = useMap();
  const { mapSettings } = useMapSettings();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const resetView = useCallback(() => {
    if (!mapSettings.autoCenter) return;

    if (mapSettings.centerOn === "aircraft" && aircraftPosition) {
      const lastPosition: Position = [
        aircraftPosition.latitude,
        aircraftPosition.longitude,
      ];
      map.flyTo(lastPosition, map.getZoom(), options);
    } else if (mapSettings.centerOn === "route") {
      map.flyToBounds(bounds, options);
    }
  }, [aircraftPosition, mapSettings, bounds, map, options]);

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
