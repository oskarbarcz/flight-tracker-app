import { useEffect, useState } from "react";
import { useMap, useMapEvents } from "react-leaflet";
import { AirportShapePolygon } from "~/components/flight/Map/Element/AirportShapePolygon";
import { ParkingPositionMarkers } from "~/components/flight/Map/Element/ParkingPositionMarkers";
import { TerminalPolygons } from "~/components/flight/Map/Element/TerminalPolygons";
import { AIRPORT_DETAIL_ZOOM_THRESHOLD } from "~/components/flight/Map/Element/zoomThresholds";
import type { Airport, ParkingPosition, Terminal } from "~/models";
import { type DisplayMode, useMapSettings } from "~/state/app/context/useMapSettings";

type TerminalSource = {
  fetchAll: (airportId: string) => Promise<Terminal[]>;
};

type ParkingPositionSource = {
  fetchAll: (airportId: string) => Promise<ParkingPosition[]>;
};

type Props = {
  terminalService: TerminalSource;
  parkingPositionService: ParkingPositionSource;
  departureAirport: Airport;
  destinationAirport: Airport;
  departureParkingPositionId: string | null;
  arrivalParkingPositionId: string | null;
};

export function TrackingAirportLayoutLayer({
  terminalService,
  parkingPositionService,
  departureAirport,
  destinationAirport,
  departureParkingPositionId,
  arrivalParkingPositionId,
}: Props) {
  const map = useMap();
  const { mapSettings } = useMapSettings();
  const [zoom, setZoom] = useState(map.getZoom());
  const [departureTerminals, setDepartureTerminals] = useState<Terminal[]>([]);
  const [destinationTerminals, setDestinationTerminals] = useState<Terminal[]>([]);
  const [departureParkingPositions, setDepartureParkingPositions] = useState<ParkingPosition[]>([]);
  const [destinationParkingPositions, setDestinationParkingPositions] = useState<ParkingPosition[]>([]);

  useMapEvents({
    zoomend: () => setZoom(map.getZoom()),
  });

  useEffect(() => {
    terminalService
      .fetchAll(departureAirport.id)
      .then(setDepartureTerminals)
      .catch(() => setDepartureTerminals([]));
  }, [terminalService, departureAirport.id]);

  useEffect(() => {
    terminalService
      .fetchAll(destinationAirport.id)
      .then(setDestinationTerminals)
      .catch(() => setDestinationTerminals([]));
  }, [terminalService, destinationAirport.id]);

  useEffect(() => {
    parkingPositionService
      .fetchAll(departureAirport.id)
      .then(setDepartureParkingPositions)
      .catch(() => setDepartureParkingPositions([]));
  }, [parkingPositionService, departureAirport.id]);

  useEffect(() => {
    parkingPositionService
      .fetchAll(destinationAirport.id)
      .then(setDestinationParkingPositions)
      .catch(() => setDestinationParkingPositions([]));
  }, [parkingPositionService, destinationAirport.id]);

  if (zoom < AIRPORT_DETAIL_ZOOM_THRESHOLD) return null;

  const visibleDepartureParkingPositions = pickParkingPositions(
    departureParkingPositions,
    departureParkingPositionId,
    mapSettings.parkingPositionDisplay,
  );
  const visibleArrivalParkingPositions = pickParkingPositions(
    destinationParkingPositions,
    arrivalParkingPositionId,
    mapSettings.parkingPositionDisplay,
  );

  const visibleDepartureTerminals = pickTerminals(
    departureTerminals,
    departureParkingPositions,
    departureParkingPositionId,
    mapSettings.terminalDisplay,
  );
  const visibleArrivalTerminals = pickTerminals(
    destinationTerminals,
    destinationParkingPositions,
    arrivalParkingPositionId,
    mapSettings.terminalDisplay,
  );

  return (
    <>
      <AirportShapePolygon airport={departureAirport} />
      <AirportShapePolygon airport={destinationAirport} />
      <TerminalPolygons terminals={visibleDepartureTerminals} />
      <TerminalPolygons terminals={visibleArrivalTerminals} />
      <ParkingPositionMarkers parkingPositions={visibleDepartureParkingPositions} />
      <ParkingPositionMarkers parkingPositions={visibleArrivalParkingPositions} />
    </>
  );
}

function pickParkingPositions(
  parkingPositions: ParkingPosition[],
  assignedId: string | null,
  mode: DisplayMode,
): ParkingPosition[] {
  if (mode === "none") return [];
  if (mode === "all") return parkingPositions;
  return parkingPositions.filter((p) => p.id === assignedId);
}

function pickTerminals(
  terminals: Terminal[],
  parkingPositions: ParkingPosition[],
  assignedParkingPositionId: string | null,
  mode: DisplayMode,
): Terminal[] {
  if (mode === "none") return [];
  if (mode === "all") return terminals;
  if (assignedParkingPositionId === null) return [];
  const assignedTerminalId = parkingPositions.find((p) => p.id === assignedParkingPositionId)?.terminalId;
  if (!assignedTerminalId) return [];
  return terminals.filter((t) => t.id === assignedTerminalId);
}
