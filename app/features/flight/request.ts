import type { Aircraft } from "~/features/aircraft";
import type { AirportOnFlight, FlightCrew, FlightStatus, Tracking } from "~/features/flight";
import type { Operator } from "~/features/operator";

export type CreateFlightRequest = Omit<
  ApiFlightResponse,
  | "id"
  | "airports"
  | "aircraft"
  | "operator"
  | "rotationId"
  | "status"
  | "source"
  | "createdAt"
  | "departureParkingPositionId"
  | "departureRunwayId"
  | "arrivalParkingPositionId"
  | "arrivalRunwayId"
  | "hasFlightPath"
>;

export type ApiLoadsheetResponse = {
  flightCrew: FlightCrew;
  passengers: number;
  cargo: number;
  payload: number;
  zeroFuelWeight: number;
  blockFuel: number;
};

export type ApiLoadsheetsResponse = {
  preliminary: ApiLoadsheetResponse | null;
  final: ApiLoadsheetResponse | null;
};

export type ApiFlightResponse = {
  id: string;
  flightNumber: string;
  callsign: string;
  airports: AirportOnFlight[];
  departureAirportId: string;
  destinationAirportId: string;
  aircraftId: string;
  aircraft: Aircraft;
  operatorId: string;
  operator: Operator;
  source: string;
  rotationId: string | null;
  timesheet: {
    scheduled: {
      offBlockTime: string;
      takeoffTime: string;
      arrivalTime: string;
      onBlockTime: string;
    };
    estimated?: {
      offBlockTime: string;
      takeoffTime: string;
      arrivalTime: string;
      onBlockTime: string;
    };
    actual?: {
      offBlockTime: string | null;
      takeoffTime: string | null;
      arrivalTime: string | null;
      onBlockTime: string | null;
    };
  };
  status: FlightStatus;
  tracking: Tracking;
  loadsheets: ApiLoadsheetsResponse;
  departureParkingPositionId: string | null;
  departureRunwayId: string | null;
  arrivalParkingPositionId: string | null;
  arrivalRunwayId: string | null;
  hasActiveEmergency?: boolean;
  isFlightDiverted?: boolean;
  hasFlightPath: boolean;
  createdAt: string;
};
