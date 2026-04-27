"use client";

import L from "leaflet";
import React from "react";
import { MapContainer } from "react-leaflet";
import { GreatCirclePath } from "~/components/flight/Map/Element/GreatCirclePath";
import MapAirportLabel from "~/components/flight/Map/Element/MapAirportLabel";
import { MapTileLayer } from "~/components/flight/Map/Element/MapTileLayer";
import { Container } from "~/components/shared/Layout/Container";
import type { Flight } from "~/models";

type Props = {
  flight: Flight;
};

export function RouteMap({ flight }: Props) {
  const bounds = L.latLngBounds([
    [flight.departureAirport.location.latitude, flight.departureAirport.location.longitude],
    [flight.destinationAirport.location.latitude, flight.destinationAirport.location.longitude],
  ]);

  return (
    <Container padding="none" className="overflow-hidden h-full">
      <div className="relative h-full min-h-72 w-full">
        <MapContainer
          bounds={bounds}
          boundsOptions={{ padding: [40, 40] }}
          scrollWheelZoom={false}
          className="h-full w-full z-0"
          zoomControl={false}
          attributionControl={false}
        >
          <MapTileLayer />
          <GreatCirclePath start={flight.departureAirport} end={flight.destinationAirport} />
          <MapAirportLabel airport={flight.departureAirport} />
          <MapAirportLabel airport={flight.destinationAirport} />
        </MapContainer>

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
