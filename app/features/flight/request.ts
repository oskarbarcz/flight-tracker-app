import type { Aircraft } from "~/features/aircraft";
import type {
  AirportOnFlight,
  AirportOnFlightType,
  FlightCrew,
  FlightStatus,
  FuelBreakdown,
  Pilot,
  Tracking,
} from "~/features/flight";
import type { Operator } from "~/features/operator";

export type AlternateAirportRequest = {
  airportId: string;
  type: AirportOnFlightType;
};

export type CreateFlightRequest = Omit<
  ApiFlightResponse,
  | "id"
  | "airports"
  | "aircraft"
  | "operator"
  | "pilot"
  | "status"
  | "source"
  | "createdAt"
  | "departureParkingPositionId"
  | "departureRunwayId"
  | "arrivalParkingPositionId"
  | "arrivalRunwayId"
  | "hasFlightPath"
  | "actualFuelBurned"
> & {
  alternateAirports: AlternateAirportRequest[];
};

export type CloseFlightRequest = {
  actualFuelBurned: number;
};

export type ApiLoadsheetResponse = {
  flightCrew: FlightCrew;
  passengers: number;
  cargo: number;
  payload: number;
  zeroFuelWeight: number;
  blockFuel: number;
  fuel: FuelBreakdown | null;
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
  pilot: Pilot | null;
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
  departureParkingPositionId: string | null;
  departureRunwayId: string | null;
  arrivalParkingPositionId: string | null;
  arrivalRunwayId: string | null;
  hasActiveEmergency?: boolean;
  isFlightDiverted?: boolean;
  hasFlightPath: boolean;
  actualFuelBurned: number | null;
  createdAt: string;
};
