"use client";

import type { LatLngExpression } from "leaflet";
import React from "react";
import { CircleMarker, MapContainer } from "react-leaflet";
import { MapTileLayer } from "~/components/flight/Map/Element/MapTileLayer";
import { Container } from "~/components/shared/Layout/Container";
import { formatCoordinates } from "~/functions/formatGeo";
import type { Airport } from "~/models";

type Props = {
  airport: Airport;
};

export function AirportLocationMap({ airport }: Props) {
  const position: LatLngExpression = [airport.location.latitude, airport.location.longitude];
  const coordinates = formatCoordinates(airport.location.latitude, airport.location.longitude);

  return (
    <Container padding="none" className="overflow-hidden h-full">
      <div className="relative h-full min-h-72 w-full">
        <MapContainer
          center={position}
          zoom={11}
          scrollWheelZoom={false}
          className="h-full w-full z-0"
          zoomControl={false}
          attributionControl={false}
        >
          <MapTileLayer />
          <CircleMarker
            center={position}
            radius={8}
            pathOptions={{ color: "#6366f1", fillColor: "#6366f1", fillOpacity: 0.8, weight: 2 }}
          />
        </MapContainer>

        <div className="absolute top-3 left-3 z-10 bg-white/95 dark:bg-gray-900/95 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-800 text-sm font-mono font-bold text-gray-900 dark:text-gray-100 shadow-sm pointer-events-none">
          {airport.icaoCode} · {airport.iataCode}
        </div>

        <div className="absolute bottom-3 left-3 z-10 bg-white/90 dark:bg-gray-900/90 px-2.5 py-1 rounded text-xs font-mono text-gray-700 dark:text-gray-300 pointer-events-none">
          {coordinates}
        </div>

        <div className="absolute bottom-1 right-1 z-10 bg-white/80 dark:bg-gray-900/80 px-1.5 py-0.5 rounded text-[10px] text-gray-500 dark:text-gray-400">
          ©{" "}
          <a
            href="https://www.openstreetmap.org/copyright"
            target="_blank"
            rel="noreferrer"
            className="hover:underline"
          >
            OpenStreetMap
          </a>
        </div>
      </div>
    </Container>
  );
}
