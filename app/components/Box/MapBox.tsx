"use client";

import { FlightPathElement } from "~/models";
import { useFlightService } from "~/state/hooks/api/useFlightService";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import L, { LatLngBounds, LatLngExpression, LatLngTuple } from "leaflet";
import {
  MapContainer,
  Marker,
  Polyline,
  TileLayer,
  useMap,
} from "react-leaflet";
import { calculateLastBearing, createSmoothPath } from "~/functions/smooth";
import { useThemeMode } from "flowbite-react";
import { EmptyMapBox } from "~/components/Box/EmptyMapBox";

type MapBoxProps = {
  flightId: string;
};

type Position = LatLngTuple | LatLngExpression;

function MapEventsHandler({ bounds }: { bounds: LatLngBounds }) {
  const map = useMap();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const resetView = useCallback(() => {
    if (bounds.isValid()) {
      map.flyToBounds(bounds, { padding: [50, 50], duration: 1.5 });
    }
  }, [map, bounds]);

  const startTimeout = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(resetView, 10000);
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

export function MapBox({ flightId }: MapBoxProps) {
  const { mode } = useThemeMode();

  const flightService = useFlightService();
  const [flightPath, setFlightPath] = useState<FlightPathElement[]>([]);

  useEffect(() => {
    flightService.getFlightPath(flightId).then(setFlightPath);
  }, [flightId, flightService]);

  const positions: Position[] = useMemo(
    () => flightPath.map((p) => [p.latitude, p.longitude]),
    [flightPath],
  );

  const bearing = useMemo(() => calculateLastBearing(positions), [positions]);
  const planeIcon = useMemo(
    () =>
      new L.DivIcon({
        html: `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#6875F5" width="36px" height="36px" style="transform: rotate(${bearing}deg);">
          <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
        </svg>
      `,
        className: "",
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      }),
    [bearing],
  );

  const bounds = useMemo(
    () => L.latLngBounds(positions as LatLngTuple[]),
    [positions],
  );

  const smoothPositions = useMemo(
    () => createSmoothPath(positions),
    [positions],
  );

  if (flightPath.length === 0) {
    return <EmptyMapBox />;
  }

  const lastPosition = positions[positions.length - 1];
  const pathOptions = { color: "#6875F5", weight: 4 };

  const tileUrls = {
    light:
      "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
    dark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    auto: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
  };

  return (
    <div className="w-full h-full rounded-2xl">
      <MapContainer
        center={lastPosition}
        bounds={bounds}
        boundsOptions={{ padding: [50, 50] }}
        style={{ height: "100%", width: "100%", borderRadius: "2rem" }}
        scrollWheelZoom={true}
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer key={mode} url={tileUrls[mode]} />
        <Polyline pathOptions={pathOptions} positions={smoothPositions} />

        <Marker position={lastPosition} icon={planeIcon} />

        <MapEventsHandler bounds={bounds} />
      </MapContainer>
    </div>
  );
}
