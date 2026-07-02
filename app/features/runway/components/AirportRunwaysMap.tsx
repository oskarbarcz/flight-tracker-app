import L from "leaflet";
import { useMemo } from "react";
import { MapContainer } from "react-leaflet";
import { AirportShapePolygon } from "~/components/flight/Map/Element/AirportShapePolygon";
import { MapTileLayer } from "~/components/flight/Map/Element/MapTileLayer";
import { ParkingPositionMarkers } from "~/components/flight/Map/Element/ParkingPositionMarkers";
import { RunwayLines } from "~/components/flight/Map/Element/RunwayLines";
import { TerminalPolygons } from "~/components/flight/Map/Element/TerminalPolygons";
import { computeRunwayLines } from "~/features/runway/lib/runwayPairs";
import type { Airport, ParkingPosition, Runway, Terminal } from "~/models";

type Props = {
  airport: Airport;
  runways: Runway[];
  terminals: Terminal[];
  parkingPositions: ParkingPosition[];
  fallbackCenter: { latitude: number; longitude: number };
};

export function AirportRunwaysMap({ airport, runways, terminals, parkingPositions, fallbackCenter }: Props) {
  const lines = useMemo(() => computeRunwayLines(runways), [runways]);

  const bounds = useMemo(() => {
    const points: L.LatLngTuple[] = [];
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
      return L.latLng(fallbackCenter.latitude, fallbackCenter.longitude).toBounds(4000);
    }
    return L.latLngBounds(points);
  }, [lines, airport.shape, terminals, parkingPositions, fallbackCenter.latitude, fallbackCenter.longitude]);

  return (
    <MapContainer
      bounds={bounds}
      boundsOptions={{ padding: [40, 40] }}
      scrollWheelZoom
      className="h-full w-full rounded-xl z-0"
      attributionControl={false}
    >
      <MapTileLayer />
      <AirportShapePolygon airport={airport} />
      <TerminalPolygons terminals={terminals} />
      <ParkingPositionMarkers parkingPositions={parkingPositions} />
      <RunwayLines runways={runways} />
    </MapContainer>
  );
}
