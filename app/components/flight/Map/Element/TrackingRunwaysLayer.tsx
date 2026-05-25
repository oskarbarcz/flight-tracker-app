"use client";

import { useEffect, useState } from "react";
import { useMap, useMapEvents } from "react-leaflet";
import { RunwayLines } from "~/components/flight/Map/Element/RunwayLines";
import { AIRPORT_DETAIL_ZOOM_THRESHOLD } from "~/components/flight/Map/Element/zoomThresholds";
import type { Runway } from "~/models";

type RunwaySource = {
  fetchAll: (airportId: string) => Promise<Runway[]>;
};

type Props = {
  runwayService: RunwaySource;
  departureAirportId: string;
  destinationAirportId: string;
  departureRunwayId: string | null;
  arrivalRunwayId: string | null;
};

export function TrackingRunwaysLayer({
  runwayService,
  departureAirportId,
  destinationAirportId,
  departureRunwayId,
  arrivalRunwayId,
}: Props) {
  const map = useMap();
  const [zoom, setZoom] = useState(map.getZoom());
  const [departureRunways, setDepartureRunways] = useState<Runway[]>([]);
  const [destinationRunways, setDestinationRunways] = useState<Runway[]>([]);

  useMapEvents({
    zoomend: () => setZoom(map.getZoom()),
  });

  useEffect(() => {
    runwayService.fetchAll(departureAirportId).then(setDepartureRunways);
  }, [runwayService, departureAirportId]);

  useEffect(() => {
    runwayService.fetchAll(destinationAirportId).then(setDestinationRunways);
  }, [runwayService, destinationAirportId]);

  if (zoom < AIRPORT_DETAIL_ZOOM_THRESHOLD) return null;

  return (
    <>
      <RunwayLines runways={departureRunways} selectedRunwayId={departureRunwayId} />
      <RunwayLines runways={destinationRunways} selectedRunwayId={arrivalRunwayId} />
    </>
  );
}
