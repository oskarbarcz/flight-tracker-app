import {
  Aircraft,
  AirportOnFlight,
  FlightCrew,
  FlightStatus,
  Operator,
  Tracking,
} from "~/models";

export type CreateFlightRequest = Omit<
  ApiFlightResponse,
  | "id"
  | "airports"
  | "aircraft"
  | "operator"
  | "status"
  | "source"
  | "createdAt"
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
  createdAt: string;
};
