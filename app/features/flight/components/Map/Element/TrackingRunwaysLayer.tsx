import { useEffect, useState } from "react";
import { useMap, useMapEvents } from "react-leaflet";
import { type DisplayMode, useMapSettings } from "~/app-state/useMapSettings";
import { RunwayApproach } from "~/features/flight/components/Map/Element/RunwayApproach";
import { RunwayLines } from "~/features/flight/components/Map/Element/RunwayLines";
import {
  RUNWAY_APPROACH_ZOOM_THRESHOLD,
  RUNWAY_ZOOM_THRESHOLD,
} from "~/features/flight/components/Map/Element/zoomThresholds";
import type { Runway } from "~/features/runway";

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

function pickRunways(runways: Runway[], assignedId: string | null, mode: DisplayMode): Runway[] {
  if (mode === "none") return [];
  if (mode === "all") return runways;
  return runways.filter((r) => r.id === assignedId);
}

export function TrackingRunwaysLayer({
  runwayService,
  departureAirportId,
  destinationAirportId,
  departureRunwayId,
  arrivalRunwayId,
}: Props) {
  const map = useMap();
  const { mapSettings } = useMapSettings();
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

  if (zoom < RUNWAY_APPROACH_ZOOM_THRESHOLD) return null;

  const visibleDeparture = pickRunways(departureRunways, departureRunwayId, mapSettings.runwayDisplay);
  const visibleArrival = pickRunways(destinationRunways, arrivalRunwayId, mapSettings.runwayDisplay);
  const showRunways = zoom >= RUNWAY_ZOOM_THRESHOLD;

  return (
    <>
      <RunwayApproach runways={visibleDeparture} selectedRunwayId={departureRunwayId} />
      <RunwayApproach runways={visibleArrival} selectedRunwayId={arrivalRunwayId} />
      {showRunways && <RunwayLines runways={visibleDeparture} selectedRunwayId={departureRunwayId} />}
      {showRunways && <RunwayLines runways={visibleArrival} selectedRunwayId={arrivalRunwayId} />}
    </>
  );
}
