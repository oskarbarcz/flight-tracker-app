import L from "leaflet";
import React, { useMemo } from "react";
import { MapContainer, ZoomControl } from "react-leaflet";
import { AirportShapePolygon } from "~/components/flight/Map/Element/AirportShapePolygon";
import { MapAirportLabel } from "~/components/flight/Map/Element/MapAirportLabel";
import { MapTileLayer } from "~/components/flight/Map/Element/MapTileLayer";
import { ParkingPositionMarkers } from "~/components/flight/Map/Element/ParkingPositionMarkers";
import { RunwayLines } from "~/components/flight/Map/Element/RunwayLines";
import { TerminalPolygons } from "~/components/flight/Map/Element/TerminalPolygons";
import { TransparentContainer } from "~/components/shared/Layout/TransparentContainer";
import { computeRunwayLines } from "~/functions/runwayPairs";
import type { Airport, ParkingPosition, Runway, Terminal } from "~/models";
import { formatCoordinates } from "~/shared/lib/formatGeo";

type Props = {
  airport: Airport;
  runways: Runway[];
  terminals: Terminal[];
  parkingPositions: ParkingPosition[];
};

export function AirportLocationMap({ airport, runways, terminals, parkingPositions }: Props) {
  const coordinates = formatCoordinates(airport.location.latitude, airport.location.longitude);

  const bounds = useMemo(() => {
    const points: L.LatLngTuple[] = [];

    const lines = computeRunwayLines(runways);
    for (const line of lines) {
      points.push(...line.positions);
    }
    if (airport.shape) {
      for (const p of airport.shape) {
        points.push([p.latitude, p.longitude]);
      }
    }
    for (const t of terminals) {
      if (!t.shape) continue;
      for (const p of t.shape) {
        points.push([p.latitude, p.longitude]);
      }
    }
    for (const p of parkingPositions) {
      if (!p.coordinates) continue;
      points.push([p.coordinates.latitude, p.coordinates.longitude]);
    }

    if (points.length === 0) {
      return L.latLng(airport.location.latitude, airport.location.longitude).toBounds(4000);
    }
    return L.latLngBounds(points);
  }, [runways, airport.shape, airport.location.latitude, airport.location.longitude, terminals, parkingPositions]);

  return (
    <TransparentContainer className="h-full">
      <div className="relative h-full min-h-72 w-full">
        <MapContainer
          bounds={bounds}
          boundsOptions={{ padding: [40, 40] }}
          scrollWheelZoom={false}
          className="h-full w-full z-0"
          zoomControl={false}
          attributionControl={false}
        >
          <ZoomControl position="bottomright" />
          <MapTileLayer />
          <AirportShapePolygon airport={airport} />
          <TerminalPolygons terminals={terminals} />
          <ParkingPositionMarkers parkingPositions={parkingPositions} />
          <RunwayLines runways={runways} />
          <MapAirportLabel airport={airport} />
        </MapContainer>

        <div className="absolute top-3 left-3 z-10 bg-white/95 dark:bg-gray-900/95 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-800 text-sm font-mono font-bold text-gray-900 dark:text-gray-100 shadow-sm pointer-events-none">
          {airport.icaoCode} · {airport.iataCode}
        </div>

        <div className="absolute bottom-3 left-3 z-10 bg-white/90 dark:bg-gray-900/90 px-2.5 py-1 rounded text-xs font-mono text-gray-700 dark:text-gray-300 pointer-events-none">
          {coordinates}
        </div>

        <div className="absolute top-1 right-1 z-10 bg-white/80 dark:bg-gray-900/80 px-1.5 py-0.5 rounded text-[10px] text-gray-500 dark:text-gray-400">
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
    </TransparentContainer>
  );
}
