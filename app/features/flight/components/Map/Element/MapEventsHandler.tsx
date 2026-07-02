import type { FitBoundsOptions, LatLngBounds } from "leaflet";
import { useCallback, useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import { useMapSettings } from "~/app-state/useMapSettings";
import type { FlightPathElement, Position } from "~/models";

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

    if (mapSettings.centerOn === "aircraft" && aircraftPosition) {
      const lastPosition: Position = [aircraftPosition.latitude, aircraftPosition.longitude];
      map.flyTo(lastPosition, map.getZoom(), options);
    } else if (mapSettings.centerOn === "route") {
      map.flyToBounds(bounds, options);
    } else if (mapSettings.centerOn === "departure") {
      map.flyTo(departurePosition, AIRPORT_ZOOM, options);
    } else if (mapSettings.centerOn === "destination") {
      map.flyTo(destinationPosition, AIRPORT_ZOOM, options);
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
