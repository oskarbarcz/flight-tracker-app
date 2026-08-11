import { Button } from "flowbite-react";
import { useField } from "formik";
import L, { type LatLngExpression } from "leaflet";
import { useEffect, useRef, useState } from "react";
import { MapContainer, Marker, Polygon, Polyline, useMap, useMapEvents } from "react-leaflet";
import { twMerge } from "tailwind-merge";
import { MapTileLayer } from "~/features/flight/components/Map/Element/MapTileLayer";
import { MapWorldConstraint } from "~/features/flight/components/Map/Element/MapWorldConstraint";
import { closingEdgeCrosses, newEdgeCrossesPolyline } from "~/shared/lib/polygon";
import type { Coordinates } from "~/shared/models/coordinates";
import { FormSectionLabel } from "~/shared/ui/Form/FormSectionLabel";
import { MAP_CONTROL_CLASS } from "~/shared/ui/Form/MapPicker/mapControl";

type Props = {
  field: string;
  airportLocation: Coordinates;
  label: string;
  tone: "airport" | "terminal";
  className?: string;
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

function CenterSync({ latitude, longitude, frozen }: { latitude: number; longitude: number; frozen: boolean }) {
  const map = useMap();
  const frozenRef = useRef(frozen);

  useEffect(() => {
    frozenRef.current = frozen;
  }, [frozen]);

  useEffect(() => {
    if (frozenRef.current) return;
    map.setView([latitude, longitude], map.getZoom());
  }, [map, latitude, longitude]);

  return null;
}

function vertexIcon(stroke: string, fill: string, highlightFirst: boolean): L.DivIcon {
  const size = highlightFirst ? 16 : 10;
  const bg = highlightFirst ? "#ffffff" : fill;
  const border = highlightFirst ? 3 : 1;
  return new L.DivIcon({
    html: `<span style="display:block;width:${size}px;height:${size}px;border-radius:50%;background:${bg};border:${border}px solid ${stroke};box-sizing:border-box;cursor:pointer;"></span>`,
    className: "shape-picker-vertex",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

export function PolygonShapePicker({ field, airportLocation, label, tone, className }: Props) {
  const [, meta, helpers] = useField<Coordinates[] | null>(field);
  const vertices = meta.value ?? [];
  const tones = TONE_STYLE[tone];

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
    if (closed) {
      setClosed(false);
      setError(null);
      return;
    }
    const next = vertices.slice(0, -1);
    setVertices(next);
    setError(null);
  };

  const onVertexDrag = (idx: number, latlng: L.LatLng) => {
    const wrapped = latlng.wrap();
    const moved: Coordinates = { latitude: round6(wrapped.lat), longitude: round6(wrapped.lng) };
    const next = vertices.map((v, i) => (i === idx ? moved : v));
    setVertices(next);
    setError(null);
  };

  const onClear = () => {
    setVertices([]);
    setClosed(false);
    setError(null);
  };

  const positions = vertices.map((v) => [v.latitude, v.longitude] as [number, number]);
  const vertexMarkers = positions.map((position, index) => ({ index, position }));
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
    <div className={twMerge("flex w-full flex-col gap-2", className)}>
      <FormSectionLabel>{label}</FormSectionLabel>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span
          className={`font-mono text-xs ${error ? "text-red-600 dark:text-red-400" : "text-gray-500 dark:text-gray-400"}`}
        >
          {statusText}
        </span>
        <div className="flex items-center gap-2">
          <Button
            className={MAP_CONTROL_CLASS}
            color="gray"
            size="xs"
            type="button"
            onClick={onUndo}
            disabled={vertices.length === 0}
          >
            Undo last
          </Button>
          <Button
            className={MAP_CONTROL_CLASS}
            color="gray"
            size="xs"
            type="button"
            onClick={onClear}
            disabled={vertices.length === 0}
          >
            Clear
          </Button>
        </div>
      </div>
      <MapContainer
        center={initialCenter}
        zoom={14}
        scrollWheelZoom
        className={`min-h-72 w-full flex-1 rounded-xl z-0 shape-picker-map${closed ? "" : " shape-picker-map--adding"}`}
        attributionControl={false}
      >
        <MapTileLayer />
        <MapWorldConstraint />
        <ClickHandler onPick={onMapClick} />
        <CenterSync
          latitude={airportLocation.latitude}
          longitude={airportLocation.longitude}
          frozen={vertices.length > 0}
        />

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

        {vertexMarkers.map(({ index, position }) => {
          const highlightFirst = index === 0 && canClose;
          return (
            <Marker
              key={index}
              position={position}
              icon={vertexIcon(tones.stroke, tones.fill, highlightFirst)}
              draggable
              eventHandlers={{
                click: () => onVertexClick(index),
                dragend: (e) => onVertexDrag(index, (e.target as L.Marker).getLatLng()),
              }}
            />
          );
        })}
      </MapContainer>
    </div>
  );
}
