import L from "leaflet";
import React from "react";
import { MapContainer, Marker } from "react-leaflet";
import { MapTileLayer } from "~/features/flight/components/Map/Element/MapTileLayer";

export type MapTone = "parked" | "cruise" | "assigned" | "base";

const toneDot: Record<MapTone, string> = {
  parked: "bg-emerald-500",
  cruise: "bg-sky-500",
  assigned: "bg-indigo-500",
  base: "bg-indigo-500",
};

export function MapPill({ label, tone }: { label: string; tone: MapTone }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white/85 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-gray-700 backdrop-blur dark:border-gray-700 dark:bg-gray-900/70 dark:text-gray-200">
      <span className={`size-1.5 rounded-full ${toneDot[tone]}`} />
      {label}
    </span>
  );
}

const locationIcon = new L.DivIcon({
  html: `
    <span class="relative block h-3.5 w-3.5">
      <span class="absolute inset-0 rounded-full bg-indigo-500/40 motion-safe:animate-ping"></span>
      <span class="absolute inset-0 rounded-full bg-indigo-600"></span>
    </span>
  `,
  className: "",
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

type Props = {
  center: [number, number];
  label: string;
  pill?: React.ReactNode;
};

export function LocationMap({ center, label, pill }: Props) {
  return (
    <div className="relative h-[170px] overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800">
      <MapContainer
        center={center}
        zoom={14}
        className="z-0 h-full w-full"
        scrollWheelZoom={false}
        dragging={false}
        doubleClickZoom={false}
        zoomControl={false}
        attributionControl={false}
        keyboard={false}
      >
        <MapTileLayer />
        <Marker position={center} icon={locationIcon} interactive={false} />
      </MapContainer>
      <div className="pointer-events-none absolute left-3 top-3 z-10 rounded-lg border border-gray-200 bg-white/95 px-2.5 py-1 font-mono text-sm font-bold text-gray-900 shadow-sm dark:border-gray-800 dark:bg-gray-900/95 dark:text-gray-100">
        {label}
      </div>
      {pill && <div className="pointer-events-none absolute right-3 top-3 z-10">{pill}</div>}
    </div>
  );
}
