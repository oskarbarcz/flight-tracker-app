import { useEffect, useState } from "react";
import { useMap, useMapEvents } from "react-leaflet";
import { type DisplayMode, useMapSettings } from "~/app-state/useMapSettings";
import type { Airport } from "~/features/airport";
import { AirportShapePolygon } from "~/features/flight/components/Map/Element/AirportShapePolygon";
import { GateMarkers } from "~/features/flight/components/Map/Element/GateMarkers";
import { ParkingPositionMarkers } from "~/features/flight/components/Map/Element/ParkingPositionMarkers";
import { TerminalPolygons } from "~/features/flight/components/Map/Element/TerminalPolygons";
import {
  AIRPORT_LABELS_ZOOM_THRESHOLD,
  AIRPORT_SHAPE_ZOOM_THRESHOLD,
  AIRPORT_STRUCTURE_ZOOM_THRESHOLD,
} from "~/features/flight/components/Map/Element/zoomThresholds";
import type { Gate } from "~/features/gate";
import type { ParkingPosition } from "~/features/parking-position";
import type { Terminal } from "~/features/terminal";

type TerminalSource = {
  fetchAll: (airportId: string) => Promise<Terminal[]>;
};

type ParkingPositionSource = {
  fetchAll: (airportId: string) => Promise<ParkingPosition[]>;
};

type GateSource = {
  fetchAll: (airportId: string) => Promise<Gate[]>;
};

type Props = {
  terminalService: TerminalSource;
  parkingPositionService: ParkingPositionSource;
  gateService: GateSource;
  departureAirport: Airport;
  destinationAirport: Airport;
  departureParkingPositionId: string | null;
  arrivalParkingPositionId: string | null;
};

export function TrackingAirportLayoutLayer({
  terminalService,
  parkingPositionService,
  gateService,
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
  const [departureGates, setDepartureGates] = useState<Gate[]>([]);
  const [destinationGates, setDestinationGates] = useState<Gate[]>([]);

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

  useEffect(() => {
    gateService
      .fetchAll(departureAirport.id)
      .then(setDepartureGates)
      .catch(() => setDepartureGates([]));
  }, [gateService, departureAirport.id]);

  useEffect(() => {
    gateService
      .fetchAll(destinationAirport.id)
      .then(setDestinationGates)
      .catch(() => setDestinationGates([]));
  }, [gateService, destinationAirport.id]);

  if (zoom < AIRPORT_SHAPE_ZOOM_THRESHOLD) return null;

  const showStructure = zoom >= AIRPORT_STRUCTURE_ZOOM_THRESHOLD;
  const showLabels = zoom >= AIRPORT_LABELS_ZOOM_THRESHOLD;

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

  const visibleDepartureGates = pickGates(departureGates, departureParkingPositionId, mapSettings.gateDisplay);
  const visibleArrivalGates = pickGates(destinationGates, arrivalParkingPositionId, mapSettings.gateDisplay);

  return (
    <>
      <AirportShapePolygon airport={departureAirport} />
      <AirportShapePolygon airport={destinationAirport} />
      {showStructure && <TerminalPolygons terminals={visibleDepartureTerminals} />}
      {showStructure && <TerminalPolygons terminals={visibleArrivalTerminals} />}
      {showLabels && (
        <ParkingPositionMarkers
          parkingPositions={visibleDepartureParkingPositions}
          assignedParkingPositionId={departureParkingPositionId}
        />
      )}
      {showLabels && (
        <ParkingPositionMarkers
          parkingPositions={visibleArrivalParkingPositions}
          assignedParkingPositionId={arrivalParkingPositionId}
        />
      )}
      {showLabels && <GateMarkers gates={visibleDepartureGates} />}
      {showLabels && <GateMarkers gates={visibleArrivalGates} />}
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

function pickGates(gates: Gate[], assignedParkingPositionId: string | null, mode: DisplayMode): Gate[] {
  if (mode === "none") return [];
  if (mode === "all") return gates;
  if (assignedParkingPositionId === null) return [];
  return gates.filter((gate) => gate.parkingPositionId === assignedParkingPositionId);
}
