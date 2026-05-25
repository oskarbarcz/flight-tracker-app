"use client";

import { useEffect, useState } from "react";
import { useMap, useMapEvents } from "react-leaflet";
import { AirportShapePolygon } from "~/components/flight/Map/Element/AirportShapePolygon";
import { GateMarkers } from "~/components/flight/Map/Element/GateMarkers";
import { TerminalPolygons } from "~/components/flight/Map/Element/TerminalPolygons";
import { AIRPORT_DETAIL_ZOOM_THRESHOLD } from "~/components/flight/Map/Element/zoomThresholds";
import type { Airport, Gate, Terminal } from "~/models";

type TerminalSource = {
  fetchAll: (airportId: string) => Promise<Terminal[]>;
};

type GateSource = {
  fetchAll: (airportId: string) => Promise<Gate[]>;
};

type Props = {
  terminalService: TerminalSource;
  gateService: GateSource;
  departureAirport: Airport;
  destinationAirport: Airport;
  departureGateId: string | null;
  arrivalGateId: string | null;
};

export function TrackingAirportLayoutLayer({
  terminalService,
  gateService,
  departureAirport,
  destinationAirport,
  departureGateId,
  arrivalGateId,
}: Props) {
  const map = useMap();
  const [zoom, setZoom] = useState(map.getZoom());
  const [departureTerminals, setDepartureTerminals] = useState<Terminal[]>([]);
  const [destinationTerminals, setDestinationTerminals] = useState<Terminal[]>([]);
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

  if (zoom < AIRPORT_DETAIL_ZOOM_THRESHOLD) return null;

  const selectedDepartureGates = departureGates.filter((g) => g.id === departureGateId);
  const selectedArrivalGates = destinationGates.filter((g) => g.id === arrivalGateId);

  return (
    <>
      <AirportShapePolygon airport={departureAirport} />
      <AirportShapePolygon airport={destinationAirport} />
      <TerminalPolygons terminals={departureTerminals} />
      <TerminalPolygons terminals={destinationTerminals} />
      <GateMarkers gates={selectedDepartureGates} />
      <GateMarkers gates={selectedArrivalGates} />
    </>
  );
}
