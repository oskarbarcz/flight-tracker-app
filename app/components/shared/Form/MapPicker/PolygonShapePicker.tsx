"use client";

import { Button, Label } from "flowbite-react";
import { useField } from "formik";
import type { LatLngExpression } from "leaflet";
import { useEffect, useState } from "react";
import { CircleMarker, MapContainer, Polygon, Polyline, useMapEvents } from "react-leaflet";
import { MapTileLayer } from "~/components/flight/Map/Element/MapTileLayer";
import { closingEdgeCrosses, newEdgeCrossesPolyline } from "~/functions/polygon";
import type { Coordinates } from "~/models/runway.model";

type Props = {
  field: string;
  airportLocation: Coordinates;
  label: string;
  tone: "airport" | "terminal";
};

const TONE_STYLE = {
  airport: { stroke: "#3b82f6", fill: "#3b82f6" },
  terminal: { stroke: "#eab308", fill: "#eab308" },
};

const ERROR_FLASH_MS = 3000;

function round6(value: number): number {
  return Math.round(value * 1_000_000) / 1_000_000;
}

function ClickHandler({ onPick }: { onPick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(event) {
      const wrapped = event.latlng.wrap();
      onPick(round6(wrapped.lat), round6(wrapped.lng));
    },
  });
  return null;
}

export function PolygonShapePicker({ field, airportLocation, label, tone }: Props) {
  const [, meta, helpers] = useField<Coordinates[] | null>(field);
  const vertices = meta.value ?? [];
  const tones = TONE_STYLE[tone];

  // Closed state is UI-only. Initial closed when loading an existing saved polygon.
  const [closed, setClosed] = useState(() => (meta.value?.length ?? 0) >= 3);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!error) return;
    const id = setTimeout(() => setError(null), ERROR_FLASH_MS);
    return () => clearTimeout(id);
  }, [error]);

  const [initialCenter] = useState<LatLngExpression>(() => {
    if (vertices.length > 0) {
      return [vertices[0].latitude, vertices[0].longitude];
    }
    return [airportLocation.latitude, airportLocation.longitude];
  });

  const setVertices = (next: Coordinates[]) => {
    helpers.setValue(next.length === 0 ? null : next, true);
    helpers.setTouched(true, false);
  };

  const onMapClick = (lat: number, lng: number) => {
    if (closed) return;
    const candidate = { latitude: lat, longitude: lng };
    if (newEdgeCrossesPolyline(vertices, candidate)) {
      setError("Edges cannot cross — pick a point that doesn't cause a kink");
      return;
    }
    setError(null);
    setVertices([...vertices, candidate]);
  };

  const onVertexClick = (idx: number) => {
    if (closed) return;
    if (idx !== 0 || vertices.length < 3) return;
    if (closingEdgeCrosses(vertices)) {
      setError("Closing edge would cross an existing edge — rearrange the polygon");
      return;
    }
    setError(null);
    setClosed(true);
  };

  const onUndo = () => {
    const next = vertices.slice(0, -1);
    setVertices(next);
    if (next.length < 3) setClosed(false);
    setError(null);
  };

  const onClear = () => {
    setVertices([]);
    setClosed(false);
    setError(null);
  };

  const positions = vertices.map((v) => [v.latitude, v.longitude] as [number, number]);
  const canClose = !closed && vertices.length >= 3;

  const statusText = error
    ? error
    : vertices.length === 0
      ? "no points — optional"
      : closed
        ? `${vertices.length} points — closed`
        : canClose
          ? `${vertices.length} points — click first point to close`
          : `${vertices.length} ${vertices.length === 1 ? "point" : "points"} — keep clicking`;

  return (
    <div className="mb-4 w-full">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <Label>{label}</Label>
        <div className="flex items-center gap-2">
          <span
            className={`font-mono text-xs ${error ? "text-red-600 dark:text-red-400" : "text-gray-500 dark:text-gray-400"}`}
          >
            {statusText}
          </span>
          <Button color="gray" size="xs" type="button" onClick={onUndo} disabled={vertices.length === 0}>
            Undo last
          </Button>
          <Button color="gray" size="xs" type="button" onClick={onClear} disabled={vertices.length === 0}>
            Clear
          </Button>
        </div>
      </div>
      <MapContainer
        center={initialCenter}
        zoom={14}
        scrollWheelZoom
        className="h-72 w-full rounded-xl z-0"
        attributionControl={false}
      >
        <MapTileLayer />
        <ClickHandler onPick={onMapClick} />

        {closed && positions.length >= 3 && (
          <Polygon
            positions={positions}
            pathOptions={{ color: tones.stroke, fillColor: tones.fill, weight: 1.5, fillOpacity: 0.25 }}
            interactive={false}
          />
        )}
        {!closed && positions.length >= 2 && (
          <Polyline positions={positions} pathOptions={{ color: tones.stroke, weight: 1.5 }} interactive={false} />
        )}

        {positions.map((pos, idx) => {
          const isFirst = idx === 0;
          const highlightFirst = isFirst && canClose;
          return (
            <CircleMarker
              key={`${pos[0]},${pos[1]},${idx}`}
              center={pos}
              radius={highlightFirst ? 8 : 5}
              pathOptions={{
                color: tones.stroke,
                fillColor: highlightFirst ? "#ffffff" : tones.fill,
                fillOpacity: 1,
                weight: highlightFirst ? 3 : 1,
              }}
              eventHandlers={{ click: () => onVertexClick(idx) }}
            />
          );
        })}
      </MapContainer>
    </div>
  );
}
