"use client";

import type { LatLngExpression } from "leaflet";
import React from "react";
import { CircleMarker, MapContainer } from "react-leaflet";
import { MapTileLayer } from "~/components/flight/Map/Element/MapTileLayer";
import { Container } from "~/components/shared/Layout/Container";
import type { Airport } from "~/models";

type Props = {
  airport: Airport;
};

export function AirportLocationMap({ airport }: Props) {
  const position: LatLngExpression = [airport.location.latitude, airport.location.longitude];

  return (
    <Container padding="none" className="overflow-hidden">
      <div className="h-72 w-full">
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
      </div>
    </Container>
  );
}
